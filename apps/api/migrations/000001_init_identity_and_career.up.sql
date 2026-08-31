-- 000001_init_identity_and_career.up.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- ============ IDENTITY ============
CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id       UUID NOT NULL,
    token_hash      TEXT NOT NULL,
    rotated_from    UUID REFERENCES refresh_tokens(id),
    revoked_at      TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ============ CAREER GRAPH ============
CREATE TABLE IF NOT EXISTS career_node_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_text        TEXT NOT NULL,
    capture_channel TEXT NOT NULL CHECK (capture_channel IN ('quick_add','chat','slack_bot','voice','check_in','resume_import')),
    processed_at    TIMESTAMPTZ,
    career_node_id  UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_unprocessed ON career_node_events(user_id) WHERE processed_at IS NULL;

CREATE TABLE IF NOT EXISTS career_nodes (
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
CREATE INDEX IF NOT EXISTS idx_career_nodes_user ON career_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_career_nodes_parent ON career_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_career_nodes_tags ON career_nodes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_career_nodes_embedding ON career_nodes USING hnsw (embedding vector_cosine_ops);
