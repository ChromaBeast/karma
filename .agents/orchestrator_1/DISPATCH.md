# Dispatch Log

## 2026-08-31T13:48:13Z
Mission: Orchestrate the complete implementation of Karma according to ORIGINAL_REQUEST.md and karma-architecture.md.
Key deliverables:
1. Component Specification Prompts in `prompts/` (171 individual markdown files across 4 categories).
2. Clean Monorepo Architecture: `apps/api` (Go Chi), `apps/web` (Next.js 14+), `packages/ui` (ReactBits reverse-engineered pure Tailwind/Canvas/WAAPI components), strictly adhering to <200 LoC per file.
3. Go API Gateway & Services: Postgres + pgvector migrations, JWT + refresh token rotation with family reuse revocation, event ingestion pipeline, BYOK AES-256-GCM envelope vault with base-URL lock, ATS resume knapsack engine, and comprehensive tests.

## 2026-08-31T13:50:03Z
[SCOPE UPDATE FROM USER]
User update: Only generate component prompts and UI components that will actually be used in the Karma product modules (e.g., landing/marketing page, career graph visualizer, ATS resume builder & preview, LinkedIn asset optimizer, portfolio showcase, mockup generator, dashboard, interactive navigation, and vault settings). Do not generate unused or redundant components from the ReactBits list; focus specifically on the active, necessary set for Karma.
Please incorporate this directive into your plan and task dispatches. Maintain strict code discipline (<200 LoC per file).
