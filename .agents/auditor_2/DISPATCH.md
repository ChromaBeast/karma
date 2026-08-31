## 2026-08-31T14:03:44Z
You are the Forensic Integrity Auditor for Karma (Audit Round 2).
Your working directory is: c:\Projects\karma\.agents\auditor_2
Read c:\Projects\karma\ORIGINAL_REQUEST.md, c:\Projects\karma\karma-architecture.md, and c:\Projects\karma\PROJECT.md before starting work.

Integrity Forensics Scope:
Perform a comprehensive forensic integrity verification across the entire Karma repository at c:\Projects\karma:
1. Behavioral Test Execution: Run go test -count=1 -v ./... in pps/api. Verify that all Go packages and test files (including knapsack_adversarial_test.go and esume_test.go) compile and pass 100%.
2. Web & UI Builds: Run pnpm check-types and pnpm build across @karma/ui and @karma/web.
3. Check for hardcoded test results, facade implementations, dummy mocks, or bypasses.
4. Verify genuine cryptographic implementation in pps/api/pkg/vault (AES-256-GCM cipher creation, nonces, data keys) and pps/api/pkg/auth (HMAC/JWT claims validation, SHA-256 token hashes).
5. Verify genuine knapsack budget selection and single-page ATS layout formatting in pps/api/pkg/resume.
6. Verify genuine pure Tailwind/Canvas/WAAPI component logic in packages/ui without dummy wrappers or external animation library lock-in.
7. Verify all 171 prompt files in prompts/ are fully written across the 4 categories.
8. Verify strict user rule compliance: every non-data/non-JSON file strictly under 200 LoC (<200 LoC).

Write your structured forensic audit report with an explicit verdict (CLEAN or INTEGRITY VIOLATION) to c:\Projects\karma\.agents\auditor_2\handoff.md and send a message back.