# Karma — Technical Architecture & Implementation Blueprint

**Tagline note:** "We display your work" is weak — it's platform-centric (about what *we* do) rather than outcome-centric, and "display" undersells a system that actively transforms raw work into resumes, posts, and portfolios. "Karma" as a name has a strong built-in metaphor (what you put in comes back to you) that the current tagline doesn't use. Alternatives, ranked by fit:

1. **"Your work, compounding."** — ties directly to the karma metaphor, implies the graph accrues value over time.
2. **"What you ship becomes what you're known for."** — concrete, benefit-first, works for every module (resume/LinkedIn/portfolio all "show what you're known for").
3. **"Do the work. Karma cashes it in."** — punchier, more casual, good for social/marketing copy.
4. **"Every achievement, accounted for."** — more literal/enterprise-safe if you want a b2b-adjacent tone.

Recommendation: (1) or (2) for the primary tagline — both survive being printed under the logo on a portfolio site, which "we display your work" doesn't (it reads like SaaS marketing copy, not something a user would want attached to their own personal brand).

---

## 0. System Overview

```
                              ┌─────────────────────────────┐
                              │        Client Layer         │
                              │  Next.js (web) / Flutter    │
                              │  (mobile + desktop)         │
                              └──────────────┬───────────────┘
                                              │ HTTPS/JSON, WS for job status
                              ┌──────────────▼───────────────┐
                              │        API Gateway           │
                              │  Go (Fiber/Chi) — REST        │
                              │  AuthN/Z, rate limiting       │
                              └──────┬───────────────┬────────┘
                    ┌────────────────┘               └────────────────┐
        ┌───────────▼───────────┐                     ┌───────────────▼──────────┐
        │   Sync services        │                     │   Async job queue         │
        │  (CRUD, reads, auth)   │                     │  (Asynq / Redis-backed)   │
        └───────────┬────────────┘                     └───────────────┬──────────┘
                    │                                                   │
        ┌───────────▼──────────────────────────────────────────────────▼──────────┐
        │                          PostgreSQL (+ pgvector)                         │
        │        Users · CareerNodes · JDs · Resumes · Portfolios · Vault          │
        └───────────┬──────────────────────────────────────────────────┬──────────┘
                    │                                                   │
        ┌───────────▼───────────┐                          ┌───────────▼──────────┐
        │   Redis                │                          │   Worker Pool          │
        │  response cache,       │◄────────────────────────┤  LLM orchestration,    │
        │  semantic dedup index  │                          │  PDF render, mockups   │
        └────────────────────────┘                          └───────────┬──────────┘
                                                                          │
                                                       ┌──────────────────▼──────────────────┐
                                                       │  Dual-Execution LLM Router            │
                                                       │  BYOK (user key, decrypted in-proc)   │
                                                       │  Managed (platform key, metered)      │
                                                       │  Locked to allow-listed base URLs     │
                                                       └────────────────────────────────────────┘
```

Object storage (S3-compatible) holds generated PDFs, portfolio assets, and mockup renders — Postgres stores metadata and URLs only, never binary blobs.

---

## 1. Product Modules

### 1.1 Dynamic Career Graph — event-driven capture

The graph is built from an **event log**, not direct edits. Every capture (quick-add, Slack/Telegram bot, weekly check-in prompt, LinkedIn-import fallback) writes an immutable `career_node_events` row first; a worker structures it into a `career_nodes` row asynchronously. This gives you replayability (re-run structuring with a better prompt later without losing raw input) and an audit trail.

**Pipeline:**
1. `POST /v1/career-events` — raw text (+ optional metric hints) queued, `202 Accepted` returned immediately.
2. Worker picks up event → LLM call with a structuring prompt that extracts:
   - `situation_task`, `action`, `result` (STAR) or `context`, `action`, `metric` (XYZ)
   - quantified metrics (`%`, `$`, `time saved`, `scale`) pulled into a typed `metrics jsonb` field, not left buried in prose
   - skill/tool tags (normalized against a controlled vocabulary to keep tag search useful)
3. Worker embeds the structured text (`text-embedding-3-large` or provider-equivalent) → stored in `career_nodes.embedding`.
4. Node upserted; parent linkage (`role → project → achievement`) inferred from user's active "current role" context or explicit `parent_id`.
5. Client notified via short-poll (`GET /v1/career-events/{id}`) or WS push — mobile-friendly, no long-lived SSE needed for this volume.

This same event log is what feeds the "weekly check-in" automation in Phase 3 (n8n cron → push notification → capture endpoint).

### 1.2 ATS-Tailored Resume Engine

1. **Ingest JD** — raw paste or URL fetch → LLM extraction pass produces `parsed_requirements jsonb`: required skills, seniority signals, keyword list, ATS-likely parsing quirks (some JDs signal Workday/Greenhouse/Taleo formatting expectations).
2. **Embed JD** → `job_descriptions.embedding`.
3. **Retrieve** — `pgvector` cosine similarity search over the user's `career_nodes` (HNSW index), top-K per target section (experience, projects, skills).
4. **Re-rank** — a single batched LLM call scores the top-K against the specific JD (not just embedding similarity — embeddings alone miss things like "recency matters" or "this JD wants leadership signals specifically"). Score + rationale stored per candidate bullet.
5. **Select under constraint** — greedy knapsack against a character budget per section so the final resume fits one page; ties broken by re-rank score.
6. **Render** — HTML template → PDF via headless Chromium. ATS-compliance rules enforced at the template level, not left to the LLM: single column, no text boxes/tables for layout, no images/icons in the parsing path, standard section headers (`Experience`, `Education`, `Skills`), embedded (not outlined) fonts, and a parallel plain-text extraction pass run against the generated PDF as a self-check before it's returned to the user.
7. Result stored in `generated_resumes` with `ats_score` (a simple deterministic score — keyword coverage vs. `parsed_requirements` — separate from the LLM's qualitative rationale, since ATS parsers don't read qualitative feedback).

### 1.3 LinkedIn Optimization Suite

- **Headline/About generator** — pulls top-weighted `career_nodes` (by recency + metric density) + target-role keywords, generates 3 variants per field.
- **Experience optimizer** — rewrites each role's bullets in LinkedIn's shorter, keyword-front-loaded style (distinct from resume style — LinkedIn is skimmed, not ATS-parsed).
- **Thought-leadership post drafter** — triggered when a `career_node` of type `project` is marked shipped; drafts hook/body/CTA variants from the node's structured result.

**Important constraint to design around:** posting on a user's behalf requires LinkedIn's `w_member_social` scope, which sits behind Marketing Developer Platform (MDP) partner approval — it is not self-serve like the basic Sign-In scopes. Build the drafter to hand off a copy-ready draft (copy-to-clipboard / "open LinkedIn with draft prefilled" deep link) for Phase 1–2, and treat direct auto-posting as a Phase 3+ item gated on partner approval actually coming through — don't build the roadmap assuming it will.

### 1.4 Portfolio Website Generator

Static-first for cost and speed: themes are pre-built Next.js (or Astro) templates; user's compiled graph becomes the content source (JSON) at build time. On publish/update, trigger a rebuild via your hosting provider's deploy API (Vercel/Cloudflare Pages) rather than server-rendering per-request — this keeps portfolio hosting cost near-zero at scale, which matters given the one-time-fee model in §3.

Routing: wildcard subdomain (`{username}.karma.app`) by default; custom domain via CNAME + TXT verification, stored on `portfolios.custom_domain` with a `verified_at` timestamp.

### 1.5 Visual Proof Mockup Generator

Recommend **SVG/Canvas via server-side rendering**, not client WebGL, for the default path — device frames and social cards are 2D compositions (screenshot + frame + shadow), and WebGL adds real complexity (headless GPU context) for a rendering job that doesn't need real-time interactivity. Use `satori` (SVG generation from JSX-like input) or a headless-Chromium screenshot pass, output PNG/WebP at 2x/3x. Reserve WebGL/Three.js for an explicit "3D tilt/parallax" showcase feature if you build it later — it's an enhancement, not the baseline.

### 1.6 Career Acceleration Tools

- **Mock interview simulation** — domain-specific question banks (seeded, not fully LLM-generated, for quality control) + LLM interviewer persona + rubric-scored feedback per answer.
- **Cover letter synthesis** — JD + selected career_nodes → single draft, editable, not multi-variant (cover letters are lower-leverage than resumes; don't over-invest generation cost here).
- **Cold outreach scripts** — target context (role, company, connection reason) → 2–3 short variants, channel-aware (LinkedIn DM vs. email length/tone differ).
- **Skill gap analyzer** — JD's `parsed_requirements` vs. user's tagged skills/embeddings → gap list, ranked by frequency-across-target-JDs if the user runs it against multiple postings.

---

## 2. Authentication & Identity

### 2.1 LinkedIn OAuth 2.0 / OIDC — and a hard constraint to design around

Standard "Sign In with LinkedIn using OpenID Connect" only grants `openid`, `profile`, `email` scopes. It does **not** return work history, positions, or skills — LinkedIn deprecated broad profile-read scopes (`r_basicprofile`, `r_fullprofile`) for third-party apps years ago; that data is only available to approved partners. Plan the "ingest profile data to seed the Career Graph" requirement accordingly:

- OAuth handshake seeds only: name, email, profile photo, LinkedIn `sub` (stable ID).
- Actual graph seeding has to come from elsewhere: LinkedIn's own "Save to PDF" export (user uploads their profile PDF, you parse it — this is the realistic import path most tools in this space actually use), resume upload/parse, or manual entry via the event-capture flow in §1.1.
- Don't build a roadmap milestone around "auto-import full LinkedIn history via OAuth" — it's not available without an MDP partnership, and applying for one before you have traction is generally not worth the review overhead.

**Flow (Authorization Code + PKCE):**
1. Client → `GET /v1/auth/linkedin/start` → backend generates `state` + PKCE `code_verifier`/`code_challenge`, redirects to LinkedIn.
2. LinkedIn redirects back with `code` → backend exchanges for `id_token` (OIDC) at LinkedIn's token endpoint.
3. Backend verifies `id_token` signature (LinkedIn's JWKS), upserts `users` row keyed on `linkedin_sub`.
4. Backend issues its own **access token** (short-lived JWT, 15 min) and **refresh token** (opaque, stored hashed).

### 2.2 Session management

- **Access JWT**: 15 min TTL, signed (RS256 or Ed25519), claims: `sub`, `plan_tier`, `scope`, `iat/exp`. Stateless verification at the gateway.
- **Refresh token rotation**: each refresh issues a new refresh token and invalidates the old one (`rotated_from` links the chain). Store only a hash (`sha256`) of the token server-side, keyed by `family_id`.
- **Reuse detection**: if an already-rotated (dead) refresh token is presented, revoke the entire `family_id` immediately and force re-auth — this is the standard signal for a stolen refresh token.
- **Scopes**: keep internal scopes separate from LinkedIn's OAuth scopes — e.g. `resume:generate`, `portfolio:publish`, `billing:manage` — mapped from `plan_tier`, not from what LinkedIn granted.

---

## 3. Unit Economics & Dual-Execution LLM Engine

### 3.1 A note on the one-time-fee model

Worth flagging directly: a **one-time** access fee funding **indefinitely growing** database storage (career graph keeps accumulating events, resumes, portfolio history) is a real long-term cost mismatch — it works fine at low scale and gets worse the longer a user stays active, which is the opposite of what you want for a career tool people should use for years. Two ways to keep the economics sane without abandoning the one-time-fee positioning:

- **Storage quotas + soft archival**: baseline fee covers a generous but bounded quota (e.g., N career nodes, N generated resumes retained live); older generated artifacts (PDFs, not the underlying graph) get moved to cold/cheap storage and regenerated on-demand rather than kept hot.
- **The graph itself stays cheap by design**: `career_nodes` rows are small (text + jsonb + a vector), which is the expensive-looking but actually cheap part; the genuinely expensive parts are LLM tokens (offloaded to BYOK/managed credits) and generated binaries (PDFs/images, which belong in cheap object storage, not Postgres).

This isn't a reason to abandon the model — it's a reason to make sure the *storage* half of "baseline fee covers storage" has an explicit ceiling in the pricing page, not an implicit one discovered at scale.

### 3.2 Dual-execution LLM router

Every generative call goes through one router with two backends:

**BYOK**: user-supplied key for Anthropic/OpenAI/Gemini.
- Encrypted at rest via **envelope encryption**: a per-user data key (generated server-side) encrypts the API key with AES-256-GCM; the data key itself is encrypted by a KMS-managed master key (AWS KMS / GCP KMS / age with a hardware-backed root). Decryption happens only inside the worker process, only for the duration of the outbound call, key is never logged and never re-serialized to the client after initial entry (UI shows last-4 only).
- Pure client-side encryption (browser-held key) sounds more secure but creates a real recovery problem — if the encryption key never touches your backend, you can't decrypt server-side to make the async worker call at all, which is exactly where BYOK keys get used (resume generation runs as a background job, not a synchronous browser call). Envelope encryption with backend-held KMS keys is the pragmatic default; document it plainly to users rather than overclaiming "we can't see your key."
- **Base URL lock**: outbound HTTP client for LLM calls is configured with a hard allow-list (`api.anthropic.com`, `api.openai.com`, `generativelanguage.googleapis.com`) at the network layer (egress firewall rule), not just application-level config — this closes the "user points a 'custom base URL' field at a proxy that harvests the key" attack class entirely by not exposing a custom-base-URL field at all.

**Managed credits**: platform key, usage metered per call into `managed_credit_ledger`, billed against a pre-purchased credit balance (Stripe). No credit → generation blocked with a clear upsell to either buy credits or switch to BYOK for that call.

**Cost optimization (both paths, but especially managed):**
- **Redis response cache**: keyed on `hash(module + normalized_input + model)`, short TTL for volatile modules (resume gen), longer for stable ones (skill-tag normalization).
- **Semantic dedup**: for near-duplicate inputs (e.g., two JDs for similar roles), embed the input and check cosine similarity against recent cache entries above a threshold before making a fresh call — this is the one place a `pgvector`-backed cache table (not just Redis) earns its keep, since Redis alone can't do similarity search.
- **Prompt compression**: career-graph context sent to the LLM is pre-filtered by the retrieval step (§1.2) rather than dumping the full graph every call — retrieval *is* the compression strategy here, not a separate step bolted on after.

---

## 4. Database Schema (PostgreSQL + pgvector)

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- ============ IDENTITY ============
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkedin_sub    TEXT UNIQUE NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    avatar_url      TEXT,
    headline        TEXT,
    plan_tier       TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free','access','access_plus_credits')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id       UUID NOT NULL,
    token_hash      TEXT NOT NULL,
    rotated_from    UUID REFERENCES refresh_tokens(id),
    revoked_at      TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ============ CAREER GRAPH ============
CREATE TABLE career_node_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_text        TEXT NOT NULL,
    capture_channel TEXT NOT NULL CHECK (capture_channel IN ('quick_add','chat','slack_bot','voice','check_in','resume_import')),
    processed_at    TIMESTAMPTZ,
    career_node_id  UUID,               -- set once structuring completes
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_unprocessed ON career_node_events(user_id) WHERE processed_at IS NULL;

CREATE TABLE career_nodes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       UUID REFERENCES career_nodes(id) ON DELETE SET NULL,
    node_type       TEXT NOT NULL CHECK (node_type IN ('role','project','achievement','skill','education')),
    title           TEXT NOT NULL,
    org             TEXT,
    start_date      DATE,
    end_date        DATE,
    situation_task  TEXT,
    action          TEXT,
    result          TEXT,
    metrics         JSONB NOT NULL DEFAULT '{}',
    tags            TEXT[] NOT NULL DEFAULT '{}',
    embedding       VECTOR(1536),
    source          TEXT NOT NULL DEFAULT 'manual',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_career_nodes_user ON career_nodes(user_id);
CREATE INDEX idx_career_nodes_parent ON career_nodes(parent_id);
CREATE INDEX idx_career_nodes_tags ON career_nodes USING GIN(tags);
CREATE INDEX idx_career_nodes_embedding ON career_nodes USING hnsw (embedding vector_cosine_ops);

-- ============ RESUME ENGINE ============
CREATE TABLE job_descriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_text            TEXT NOT NULL,
    company             TEXT,
    role_title          TEXT,
    parsed_requirements JSONB NOT NULL DEFAULT '{}',
    embedding           VECTOR(1536),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_jd_user ON job_descriptions(user_id);
CREATE INDEX idx_jd_embedding ON job_descriptions USING hnsw (embedding vector_cosine_ops);

CREATE TABLE generated_resumes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description_id  UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    template_id         TEXT NOT NULL,
    pdf_url             TEXT,
    ats_score           NUMERIC(5,2),
    generation_params   JSONB NOT NULL DEFAULT '{}',
    llm_execution_id    UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_resumes_user ON generated_resumes(user_id);

CREATE TABLE resume_bullet_selections (
    resume_id       UUID NOT NULL REFERENCES generated_resumes(id) ON DELETE CASCADE,
    career_node_id  UUID NOT NULL REFERENCES career_nodes(id) ON DELETE CASCADE,
    rank_score      NUMERIC(6,4),
    final_text      TEXT NOT NULL,
    PRIMARY KEY (resume_id, career_node_id)
);

-- ============ PORTFOLIO & MOCKUPS ============
CREATE TABLE portfolios (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme_id        TEXT NOT NULL,
    subdomain       TEXT UNIQUE NOT NULL,
    custom_domain   TEXT UNIQUE,
    domain_verified_at TIMESTAMPTZ,
    config          JSONB NOT NULL DEFAULT '{}',
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE portfolio_projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id    UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    career_node_id  UUID NOT NULL REFERENCES career_nodes(id) ON DELETE CASCADE,
    display_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE mockups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_node_id  UUID REFERENCES career_nodes(id) ON DELETE SET NULL,
    asset_type      TEXT NOT NULL CHECK (asset_type IN ('device_frame','social_card')),
    source_image_url TEXT NOT NULL,
    rendered_url    TEXT,
    params          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mockups_user ON mockups(user_id);

-- ============ LINKEDIN / CAREER TOOLS ============
CREATE TABLE linkedin_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type      TEXT NOT NULL CHECK (asset_type IN ('headline','about','post')),
    input_context   JSONB NOT NULL DEFAULT '{}',
    generated_text  TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','copied','published')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE interview_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain          TEXT NOT NULL,
    role_title      TEXT,
    transcript      JSONB NOT NULL DEFAULT '[]',
    feedback        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cover_letters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description_id  UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    generated_text      TEXT NOT NULL,
    pdf_url             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE outreach_scripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel         TEXT NOT NULL CHECK (channel IN ('linkedin_dm','email','other')),
    target_context  JSONB NOT NULL DEFAULT '{}',
    generated_text  TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE skill_gap_analyses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description_id  UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    gap_report          JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BYOK / BILLING / LLM USAGE ============
CREATE TABLE api_key_vault (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        TEXT NOT NULL CHECK (provider IN ('anthropic','openai','gemini')),
    encrypted_key   BYTEA NOT NULL,       -- AES-256-GCM ciphertext
    key_iv          BYTEA NOT NULL,
    data_key_wrapped BYTEA NOT NULL,      -- data key, wrapped by KMS master key
    key_last4       TEXT NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    validated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, provider)
);

CREATE TABLE llm_executions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module              TEXT NOT NULL,        -- 'resume','linkedin_post','interview', etc.
    execution_mode      TEXT NOT NULL CHECK (execution_mode IN ('byok','managed')),
    provider            TEXT NOT NULL,
    model               TEXT NOT NULL,
    prompt_tokens       INT,
    completion_tokens   INT,
    cost_usd            NUMERIC(10,6),
    cache_hit           BOOLEAN NOT NULL DEFAULT false,
    status              TEXT NOT NULL CHECK (status IN ('success','error','rate_limited')),
    latency_ms          INT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_llm_exec_user_time ON llm_executions(user_id, created_at DESC);

CREATE TABLE managed_credit_ledger (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delta_usd               NUMERIC(10,4) NOT NULL,
    balance_after_usd       NUMERIC(10,4) NOT NULL,
    reason                  TEXT NOT NULL,   -- 'purchase','generation','refund'
    stripe_payment_intent_id TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE billing_accounts (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    access_fee_paid_at  TIMESTAMPTZ,
    stripe_customer_id  TEXT UNIQUE,
    storage_quota_bytes BIGINT NOT NULL DEFAULT 524288000  -- 500MB baseline example
);

-- Semantic response cache (pgvector-backed, backs Redis for cross-session reuse)
CREATE TABLE prompt_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module          TEXT NOT NULL,
    input_hash      TEXT NOT NULL,
    input_embedding VECTOR(1536),
    response        JSONB NOT NULL,
    hit_count       INT NOT NULL DEFAULT 0,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_prompt_cache_hash ON prompt_cache(module, input_hash);
CREATE INDEX idx_prompt_cache_embedding ON prompt_cache USING hnsw (input_embedding vector_cosine_ops);
```

---

## 5. Technical Stack

| Layer | Choice | Why |
|---|---|---|
| Web frontend | Next.js + TypeScript | Rich document editing (resume/cover-letter live preview), SSG for portfolio output |
| Mobile/desktop | Flutter (Riverpod) | Quick-add capture on the go — the event log in §1.1 lives or dies on low-friction mobile capture |
| Backend API | Go (Chi or Fiber) | Cheap concurrency for the gateway; async jobs offloaded, not blocking request threads |
| Job queue | Asynq (Redis-backed) | Reuses the Redis instance already needed for caching; good Go-native fit |
| Database | PostgreSQL + pgvector (Supabase or self-hosted) | Single store for relational + vector data — avoids running a separate vector DB for the retrieval step in §1.1/1.2 |
| Cache | Redis | Response cache, rate limiting, job queue backend |
| Object storage | S3-compatible (Cloudflare R2 recommended for egress cost) | PDFs, mockup renders, portfolio assets |
| PDF rendering | Headless Chromium (Playwright) | HTML/CSS template → PDF, easiest to keep ATS-compliant (no LaTeX quirks) |
| Automation | n8n (self-hosted) | Weekly check-in nudges, webhook processing (Stripe, domain verification), no custom cron infra needed |

**File-size discipline**: keep worker handlers, one module per generative feature, under ~200 lines each — the LLM router (§3.2) should be one shared client library imported by each module's handler, not reimplemented per module.

---

## 6. Implementation Roadmap

### Phase 1 — MVP
- LinkedIn OIDC login (§2.1), JWT + refresh rotation (§2.2)
- Career graph event capture + structuring pipeline (§1.1), manual entry as primary seed path (not OAuth-based import — see §2.1 constraint)
- ATS resume engine end-to-end (§1.2), BYOK only (no managed credits yet — ship the cheaper path first)
- `api_key_vault` with envelope encryption, base-URL lock enforced at the network layer from day one, not added later
- Core schema: `users`, `refresh_tokens`, `career_node_events`, `career_nodes`, `job_descriptions`, `generated_resumes`, `resume_bullet_selections`, `api_key_vault`, `llm_executions`

### Phase 2 — Branding Engine
- LinkedIn headline/about/experience optimizer (§1.3), post drafter shipped as copy-ready drafts, not auto-posting (per the `w_member_social` constraint)
- Portfolio generator (§1.4): themes, subdomain routing, build-trigger pipeline
- Mockup engine (§1.5): SVG/Canvas rendering, device-frame library
- Redis response cache + `prompt_cache` semantic dedup live
- Managed credits tier launches here (Stripe-backed `managed_credit_ledger`)

### Phase 3 — Career Tools & Hardening
- Mock interview simulation (§1.6), cover letter synthesis, outreach scripts, skill gap analyzer
- n8n weekly check-in automation against the event-capture endpoint
- Security audit pass on the vault (KMS key rotation policy, refresh-token reuse-detection alerting)
- Multi-provider token management UI (switch BYOK provider per module, view usage/cost dashboard from `llm_executions`)
- Revisit storage-quota enforcement (§3.1) against real usage data before it becomes a support problem
