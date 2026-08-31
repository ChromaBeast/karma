# BRIEFING — 2026-08-31T13:56:00Z

## Mission
Implement the complete, production-ready Go Chi REST API Gateway and microservice modules in c:\Projects\karma\apps\api with full test coverage and strict <200 LoC per file.

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa, specialist
- Working directory: c:\Projects\karma\.agents\worker_go_api_1
- Original parent: 031e8b9a-dfed-400b-835e-1aaf03bc783c
- Milestone: M2 (Go API Gateway & Services)

## 🔒 Key Constraints
- All non-JSON/non-raw-data files strictly < 200 LoC.
- Genuine production-grade implementation, no hardcoded cheating, no facades.
- Must pass `go build ./...` and `go test -v ./...`.
- All tables, vector indexes, auth, vault encryption, career pipelines, resume knapsack engine, and career tools implemented according to `karma-architecture.md`.

## Current Parent
- Conversation ID: 031e8b9a-dfed-400b-835e-1aaf03bc783c
- Updated: 2026-08-31T13:56:00Z

## Task Summary
- **What to build**: Go Chi REST API Gateway & Microservices in `apps/api`
- **Success criteria**: All endpoints functional, migrations complete with pgvector, auth with refresh token family rotation, vault with AES-256-GCM + KMS wrap, career event async structuring, resume knapsack selection & ATS rendering, tools & LLM router, 100% passing tests.
- **Interface contracts**: `karma-architecture.md`, `PROJECT.md`
- **Code layout**: `apps/api/` (`cmd/server`, `migrations`, `pkg/models`, `pkg/auth`, `pkg/vault`, `pkg/career`, `pkg/resume`, `pkg/llm`, `pkg/portfolio`, `pkg/mockup`, `pkg/tools`)

## Key Decisions Made
- Used Chi v5 router with modular sub-routers and clean middleware chain.
- Implemented genuine envelope encryption with per-user data key and simulated KMS master key wrap.
- Implemented outbound network-level allowlist filtering for BYOK LLM egress.
- Implemented knapsack character budget selection algorithm for single-page ATS resumes.
- Maintained every single non-data file under 160 lines of code (<200 LoC).

## Change Tracker
- **Files modified**: All Go API microservices and migrations created in `apps/api/`
- **Build status**: PASS (`go build ./...` and `go test -v ./...`)
- **Pending issues**: None

## Quality Status
- **Build/test result**: 100% PASS across all packages
- **Lint status**: Clean
- **Tests added/modified**: Unit and integration test suites in `pkg/auth`, `pkg/vault`, `pkg/career`, `pkg/resume`, `pkg/llm`, `pkg/portfolio`, `pkg/mockup`, `pkg/tools`, and `cmd/server`

## Artifact Index
- `.agents/worker_go_api_1/progress.md` — Liveness & task execution progress
- `.agents/worker_go_api_1/handoff.md` — Final completion report
