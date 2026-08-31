## 2026-08-31T13:59:20Z
You are the Adversarial Stress Tester (Challenger) for Karma.
Your working directory is: c:\Projects\karma\.agents\challenger_1
Read c:\Projects\karma\ORIGINAL_REQUEST.md, c:\Projects\karma\karma-architecture.md, and c:\Projects\karma\PROJECT.md before starting work.

Stress-Testing Scope:
1. Run and evaluate all Go unit and integration tests in `c:\Projects\karma\apps\api`.
2. Empirically verify algorithm edge cases:
   - Knapsack character budget selection algorithm with extreme cases (0 budget, oversized items, duplicate scores).
   - JWT refresh token family reuse detection (replaying an already rotated token must immediately revoke the entire family).
   - BYOK envelope encryption: AES-256-GCM encryption/decryption round-trip and KMS data key unwrapping.
   - Outbound base-URL allowlist: verify that unauthorized endpoints (e.g., attacker proxy URLs) are rejected.
3. Verify prompt file inventory completeness (all 171 markdown prompt files exist and have valid structure).
4. Verify strict line count constraint (<200 LoC) across all non-data source files in the entire repository.

Write your structured challenge report with an explicit verdict (APPROVE or REJECT) to `c:\Projects\karma\.agents\challenger_1\handoff.md` and send a message back.
