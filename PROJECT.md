# Project: Karma Monorepo

## Architecture
Karma is a career compounding monorepo with:
- `prompts/`: 171 individual specification prompts for ReactBits animations and components across 4 categories.
- `apps/api`: Go Chi REST API Gateway and microservice modules implementing career node ingestion, ATS knapsack resume generator, BYOK AES-256-GCM envelope vault, JWT refresh token family rotation, and PostgreSQL + pgvector schemas.
- `apps/web`: Next.js 14+ / React application with career graph event capture, live resume preview with ATS scoring, portfolio builder, mockup generator, and BYOK vault.
- `packages/ui`: Pure Tailwind CSS / Canvas / WAAPI UI components reverse-engineered from ReactBits without external animation library lock-in.

## Code Discipline & User Rules
- Non-JSON/non-data files strictly < 200 LoC (100% compliant across all 147 source files).
- Modular decomposition with reusable components and utility classes.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Component Prompts: Text Animations | 32 detailed markdown prompts in prompts/text-animations/ | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | Component Prompts: Animations | 38 detailed markdown prompts in prompts/animations/ | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 3 | Component Prompts: Components | 45 detailed markdown prompts in prompts/components/ | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 4 | Component Prompts: Backgrounds | 56 detailed markdown prompts in prompts/backgrounds/ | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 5 | Postgres & pgvector Migrations | Complete schema for all Karma tables and vector indexes | M2 | karma-architecture.md §4 | DONE |
| 6 | JWT & Refresh Family Rotation | Access JWT + refresh token rotation with family revocation | M2 | karma-architecture.md §2 | DONE |
| 7 | BYOK Envelope Encryption & Allowlist | AES-256-GCM vault, key wrapping, and outbound allowlist | M2 | karma-architecture.md §3 | DONE |
| 8 | Career Event Capture & Structuring | Event ingestion endpoint, STAR/XYZ parsing, vector hook | M2 | karma-architecture.md §1.1 | DONE |
| 9 | ATS Resume Knapsack Engine | Similarity search, re-rank scoring, knapsack selection, rendering | M2 | karma-architecture.md §1.2 | DONE |
| 10 | Career Acceleration & Portfolio APIs | Mockup, portfolio, LinkedIn asset, interview session APIs | M2 | karma-architecture.md §1 | DONE |
| 11 | Pure Tailwind/Canvas UI Package | Modular ReactBits components in packages/ui (<200 LoC) | M3 | ORIGINAL_REQUEST §R2 | DONE |
| 12 | Next.js 14+ Web Application | Full career compounding UI workflows in apps/web (<200 LoC) | M4 | ORIGINAL_REQUEST §R2 | DONE |
| 13 | E2E Integration & Integrity Verification | Full Go & TS test verification, forensic audit | M5 | Acceptance Criteria | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Component Prompts | 171 prompts in `prompts/` across 4 categories | none | DONE |
| M2 | Go API Gateway & Services | `apps/api` with Chi, pgvector migrations, auth, vault, career & resume pipelines, tests | none | DONE |
| M3 | UI Component Library | `packages/ui` reverse-engineered modular components | none | DONE |
| M4 | Next.js Web Application | `apps/web` full workflow UI | M2, M3 | DONE |
| M5 | Verification & Audit | End-to-end tests, type-checks, forensic audit | M1, M2, M3, M4 | DONE |

## Code Layout
- `prompts/`
  - `text-animations/` (32 files)
  - `animations/` (38 files)
  - `components/` (45 files)
  - `backgrounds/` (56 files)
- `apps/api/`
  - `cmd/server/`
  - `migrations/`
  - `pkg/auth/`
  - `pkg/vault/`
  - `pkg/career/`
  - `pkg/resume/`
  - `pkg/llm/`
  - `pkg/portfolio/`
  - `pkg/mockup/`
  - `pkg/tools/`
  - `pkg/models/`
- `packages/ui/`
  - `src/components/`
  - `src/animations/`
  - `src/text/`
  - `src/backgrounds/`
- `apps/web/`
  - `src/app/`
  - `src/components/`
  - `src/lib/`
  - `src/hooks/`
