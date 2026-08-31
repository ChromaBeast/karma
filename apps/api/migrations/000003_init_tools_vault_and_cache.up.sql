-- 000003_init_tools_vault_and_cache.up.sql

-- ============ LINKEDIN / CAREER TOOLS ============
CREATE TABLE IF NOT EXISTS linkedin_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type      TEXT NOT NULL CHECK (asset_type IN ('headline','about','post')),
    input_context   JSONB NOT NULL DEFAULT '{}',
    generated_text  TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','copied','published')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain          TEXT NOT NULL,
    role_title      TEXT,
    transcript      JSONB NOT NULL DEFAULT '[]',
    feedback        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cover_letters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description_id  UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    generated_text      TEXT NOT NULL,
    pdf_url             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_scripts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel         TEXT NOT NULL CHECK (channel IN ('linkedin_dm','email','other')),
    target_context  JSONB NOT NULL DEFAULT '{}',
    generated_text  TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_gap_analyses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description_id  UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    gap_report          JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ BYOK / BILLING / LLM USAGE ============
CREATE TABLE IF NOT EXISTS api_key_vault (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider            TEXT NOT NULL CHECK (provider IN ('anthropic','openai','gemini')),
    encrypted_key       BYTEA NOT NULL,
    key_iv              BYTEA NOT NULL,
    data_key_wrapped    BYTEA NOT NULL,
    key_last4           TEXT NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT true,
    validated_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS llm_executions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module              TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_llm_exec_user_time ON llm_executions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS managed_credit_ledger (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delta_usd               NUMERIC(10,4) NOT NULL,
    balance_after_usd       NUMERIC(10,4) NOT NULL,
    reason                  TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing_accounts (
    user_id             UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    access_fee_paid_at  TIMESTAMPTZ,
    stripe_customer_id  TEXT UNIQUE,
    storage_quota_bytes BIGINT NOT NULL DEFAULT 524288000
);

-- Semantic response cache (pgvector-backed)
CREATE TABLE IF NOT EXISTS prompt_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module          TEXT NOT NULL,
    input_hash      TEXT NOT NULL,
    input_embedding VECTOR(1536),
    response        JSONB NOT NULL,
    hit_count       INT NOT NULL DEFAULT 0,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prompt_cache_hash ON prompt_cache(module, input_hash);
CREATE INDEX IF NOT EXISTS idx_prompt_cache_embedding ON prompt_cache USING hnsw (input_embedding vector_cosine_ops);
