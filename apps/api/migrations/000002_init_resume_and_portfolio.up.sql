-- 000002_init_resume_and_portfolio.up.sql

-- ============ RESUME ENGINE ============
CREATE TABLE IF NOT EXISTS job_descriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_text            TEXT NOT NULL,
    company             TEXT,
    role_title          TEXT,
    parsed_requirements JSONB NOT NULL DEFAULT '{}',
    embedding           VECTOR(1536),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_jd_user ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_jd_embedding ON job_descriptions USING hnsw (embedding vector_cosine_ops);

CREATE TABLE IF NOT EXISTS generated_resumes (
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
CREATE INDEX IF NOT EXISTS idx_resumes_user ON generated_resumes(user_id);

CREATE TABLE IF NOT EXISTS resume_bullet_selections (
    resume_id       UUID NOT NULL REFERENCES generated_resumes(id) ON DELETE CASCADE,
    career_node_id  UUID NOT NULL REFERENCES career_nodes(id) ON DELETE CASCADE,
    rank_score      NUMERIC(6,4),
    final_text      TEXT NOT NULL,
    PRIMARY KEY (resume_id, career_node_id)
);

-- ============ PORTFOLIO & MOCKUPS ============
CREATE TABLE IF NOT EXISTS portfolios (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme_id            TEXT NOT NULL,
    subdomain           TEXT UNIQUE NOT NULL,
    custom_domain       TEXT UNIQUE,
    domain_verified_at  TIMESTAMPTZ,
    config              JSONB NOT NULL DEFAULT '{}',
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id    UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    career_node_id  UUID NOT NULL REFERENCES career_nodes(id) ON DELETE CASCADE,
    display_order   INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mockups (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_node_id   UUID REFERENCES career_nodes(id) ON DELETE SET NULL,
    asset_type       TEXT NOT NULL CHECK (asset_type IN ('device_frame','social_card')),
    source_image_url TEXT NOT NULL,
    rendered_url     TEXT,
    params           JSONB NOT NULL DEFAULT '{}',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mockups_user ON mockups(user_id);
