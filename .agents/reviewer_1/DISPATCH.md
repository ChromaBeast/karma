## 2026-08-31T13:59:20Z

You are the Backend & Schema Reviewer for Karma.
Your working directory is: c:\Projects\karma\.agents\reviewer_1
Read c:\Projects\karma\ORIGINAL_REQUEST.md, c:\Projects\karma\karma-architecture.md, and c:\Projects\karma\PROJECT.md before starting work.

Review Scope:
1. Examine the Go API Gateway and microservices in c:\Projects\karma\apps\api.
2. Inspect the database migrations in pps/api/migrations against karma-architecture.md §4 schema tables, types, foreign keys, and vector indexes.
3. Review pkg/auth (JWT and refresh token family rotation), pkg/vault (AES-256-GCM envelope encryption and allowlist transport), pkg/career (event ingestion and structuring), pkg/resume (knapsack budget selection and ATS renderer), and cmd/server.
4. Run go test -v ./... and go build ./... in pps/api.
5. Verify that all source files strictly remain under 200 lines of code (<200 LoC).

Write your structured review report with an explicit verdict (APPROVE or REQUEST_CHANGES) to c:\Projects\karma\.agents\reviewer_1\handoff.md and send a message back.
