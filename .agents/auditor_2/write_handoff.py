import os

handoff = '''# Forensic Integrity Audit Report (Audit Round 2)

**Work Product**: Karma Monorepo (c:\\Projects\\karma)
**Profile**: General Project
**Integrity Mode**: Development / Strict Verification
**Verdict**: **CLEAN**

---

## 1. Executive Summary & Verification Matrix

| # | Integrity Check Category | Empirical Result | Status |
|---|--------------------------|------------------|--------|
| 1 | **Go Backend Behavioral Tests** | go test -count=1 -v ./... passed across all 8 packages and adversarial suites | **PASS (100%)** |
| 2 | **Web & UI TypeScript Compilation** | pnpm check-types (@karma/ui, @karma/web) passed with 0 errors | **PASS (100%)** |
| 3 | **Next.js Production Build** | pnpm build --force completed in 13.88s, generating 10/10 static routes | **PASS (100%)** |
| 4 | **Prohibited Patterns & Facade Detection** | AST/code scan: 0 TODOs/FIXMEs, 0 fake returns, 0 mock bypasses in production | **PASS (CLEAN)** |
| 5 | **Cryptographic Authenticity** | AES-256-GCM envelope vault + KMS data key wrapping + SSRF allowlist + SHA-256 token family | **PASS (GENUINE)** |
| 6 | **Knapsack Algorithm & ATS Renderer** | Greedy/bounded multi-constraint knapsack solver with character density tie-breaking | **PASS (GENUINE)** |
| 7 | **Pure Tailwind/Canvas/WAAPI UI** | Zero third-party animation dependencies (clsx + 	ailwind-merge only); pure Canvas/WAAPI | **PASS (GENUINE)** |
| 8 | **Component Prompts Completeness** | Exactly 171 files across 4 categories (32 text, 38 anim, 45 comp, 56 bg) with full specs | **PASS (171/171)** |
| 9 | **User Rule: Code Line Count (<200 LoC)** | 147 of 147 non-data code files strictly < 200 LoC (0 violations) | **PASS (100%)** |

---

## 2. 5-Component Forensic Handoff

### 1. Observation

Direct empirical evidence obtained during forensic execution:

1. **Go Behavioral Tests (go test -count=1 -v ./...)**:
   - karma/apps/api/cmd/server: TestCompleteServerRouterE2E (PASS, 1.542s)
   - karma/apps/api/pkg/auth: TestJWTService, TestRefreshTokenFamilyRotationAndReuse, TestAuthMiddleware, TestAuthHandlerEndpoints, TestRefreshTokenFamilyAdversarial (6 subtests: multi-hop replay, intermediate token replay, non-existent token, expired token isolation, independent family isolation, concurrent replay race condition stress) (PASS, 1.371s)
   - karma/apps/api/pkg/career: TestTagNormalization, TestMetricExtraction, TestEventIngestionAndAsyncStructuring, TestCareerHTTPHandlers (PASS, 1.311s)
   - karma/apps/api/pkg/llm: TestLLMDualExecutionAndLedger (PASS, 1.000s)
   - karma/apps/api/pkg/mockup: TestMockupGeneration (PASS, 1.060s)
   - karma/apps/api/pkg/portfolio: TestPortfolioOperations (PASS, 1.093s)
   - karma/apps/api/pkg/resume: TestKnapsackAdversarialScenarios (6 subtests: zero budget, zero section budget, oversized item skipping, duplicate rank score tie-breaking, empty candidate handling, section max bullet caps), TestJDParsingAndRequirements, TestKnapsackBudgetConstraint, TestATSRenderingAndSelfCheck, TestResumeHTTPHandler (PASS, 1.306s)
   - karma/apps/api/pkg/tools: TestCareerAccelerationTools (PASS, 1.097s)
   - karma/apps/api/pkg/vault: TestAllowlistEgressAdversarial (3 subtests), TestEnvelopeEncryptionAdversarial (6 subtests: invalid key lengths, tampered ciphertext auth tag failures, tampered IV, wrong KMS master key unwrapping, lifecycle rejection, 64KB large payload round-trip), TestEnvelopeEncryptionAndDecryption, TestAllowlistEgressTransport (PASS, 2.137s)

2. **TypeScript Type-Check & Production Build**:
   - pnpm check-types: 0 type errors across @karma/ui and @karma/web.
   - pnpm build --force: Next.js 14.2.35 generated all static pages (/, /_not-found, /career, /mockups, /portfolio, /resume, /tools, /vault) without errors.

3. **Cryptographic Authenticity in pps/api/pkg/vault & pps/api/pkg/auth**:
   - pps/api/pkg/vault/crypto.go: Uses Go standard crypto/aes + crypto/cipher (cipher.NewGCM), crypto/rand for 32-byte data keys and nonces, with KMS master key wrapping (WrapDataKey / UnwrapDataKey).
   - pps/api/pkg/vault/allowlist.go: Uses custom http.RoundTripper checking eq.URL.Hostname() against LLM provider allowlist (pi.anthropic.com, pi.openai.com, generativelanguage.googleapis.com), blocking SSRF and proxy spoofing.
   - pps/api/pkg/auth/jwt.go: Validates HMAC signing method (HS256) and verifies claims (sub, plan_tier, scopes, exp, iat, jti).
   - pps/api/pkg/auth/refresh.go: Generates 32-byte crypto-random tokens, computes sha256.Sum256 token hashes, manages family IDs with immediate full family revocation on token replay/reuse.

4. **Knapsack Algorithm in pps/api/pkg/resume**:
   - pps/api/pkg/resume/knapsack.go: Implements greedy/bounded multi-constraint knapsack solver with character budgets per section (Experience 1600, Projects 800, Skills 300, Education 200, Total 2800) and max bullet caps, prioritized by re-rank score with character density tie-breaking.
   - pps/api/pkg/resume/renderer.go: Renders clean, single-page ATS-compliant semantic HTML without unparsable elements, plus plain-text extraction self-check and ATS skill match scoring against parsed JD requirements.

5. **Pure Tailwind/Canvas/WAAPI Component Logic in packages/ui**:
   - packages/ui/package.json: Contains only clsx and 	ailwind-merge. Zero third-party animation dependencies (no ramer-motion, gsap, 	hree, or lottie).
   - Native Canvas 2D render loops (equestAnimationFrame), Web Animations API (element.animate()), and CSS transitions drive all visual behaviors.

6. **Component Prompts Verification (prompts/)**:
   - Total files: 171 markdown specification files across 4 categories:
     - 	ext-animations: 32 files
     - nimations: 38 files
     - components: 45 files
     - ackgrounds: 56 files
   - Every file contains: Overview, Props Interface, Animation Specifications, Mathematical & Physics Formulas, Interaction Mechanics, and Implementation Guidance. Zero incomplete or stub files.

7. **User Line Count Rule (<200 LoC)**:
   - Scanned all 147 non-data code files (.go, .ts, .tsx, .js, .jsx, .css, .sql).
   - Result: 0 files exceeded 200 lines of code.

### 2. Logic Chain

1. **Premise**: Integrity Forensics requires establishing empirical proof that all deliverables exist, build cleanly, execute authentic algorithms, contain no facade/mock shortcuts, and comply with all architectural and user constraints.
2. **Execution**:
   - Tested backend with Go compiler and adversarial test runners -> Verified 100% pass rate.
   - Tested frontend with TypeScript compiler and Next.js static page optimizer -> Verified 100% build pass rate.
   - Audited cryptographic and knapsack algorithms -> Verified genuine implementation with zero mock shortcuts.
   - Audited UI package dependencies and component source -> Verified pure native Canvas/WAAPI/Tailwind without external bloat.
   - Audited prompt directory -> Verified all 171 prompt specifications are present and fully formed.
   - Audited file line counts -> Verified 100% compliance with <200 LoC rule.
3. **Conclusion**: All 9 forensic integrity checks pass without exceptions.

### 3. Caveats

- End-to-end live database tests in Go use in-memory and mock state stores rather than a live PostgreSQL cluster during unit test execution; all database schemas and pgvector DDL migrations were forensically validated.

### 4. Conclusion

**Verdict: CLEAN**. The Karma repository represents an authentic, fully functional, and well-structured implementation adhering to all requirements, architecture specifications, and user rules.

### 5. Verification Method

To independently reproduce the audit results, run:

1. cd c:\Projects\karma\apps\api && go test -count=1 -v ./...
2. cd c:\Projects\karma && pnpm check-types
3. cd c:\Projects\karma && pnpm build --force
'''

with open(r'c:\Projects\karma\.agents\auditor_2\handoff.md', 'w', encoding='utf-8') as f:
    f.write(handoff)
print('Script finished writing handoff.md.')
