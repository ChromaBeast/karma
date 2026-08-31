## 2026-08-31T13:49:15Z

You are the Frontend & Monorepo Engineer for Karma.
Your working directory is: c:\Projects\karma\.agents\worker_frontend_1
Read c:\Projects\karma\ORIGINAL_REQUEST.md, c:\Projects\karma\karma-architecture.md, and c:\Projects\karma\PROJECT.md before starting work.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission:
Establish the modern monorepo and implement `packages/ui` (ReactBits reverse-engineered pure Tailwind/Canvas/WAAPI components) and `apps/web` (Next.js 14+ / React application with full Karma workflows).

Requirements:
1. Monorepo Setup:
   - Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`.
   - Workspaces: `packages/ui`, `apps/web`.
2. `packages/ui`:
   - Reverse-engineered, dependency-free ReactBits UI components using pure Tailwind CSS, native Canvas/WebGL, or Web Animations API (zero heavy external animation library bloat like framer-motion/gsap).
   - Text Animations: `DecryptedText`, `ShinyText`, `SplitText`, `BlurText`, `RotatingText`, `GlitchText`, `CountUp`, `TextPressure`.
   - Animations: `GlowCursor`, `Magnet`, `StarBorder`, `RippleDistortion`, `SplashCursor`, `PixelTransition`, `GlareHover`.
   - Components: `SpotlightCard`, `TiltedCard`, `MagicBento`, `ElasticSlider`, `Stepper`, `CircularGallery`, `Dock`, `PixelCard`.
   - Backgrounds: `Particles`, `Waves`, `Aurora`, `DotGrid`, `Hyperspeed`, `GridMotion`, `Ballpit`.
   - Modular structure: Every component is clean and all files strictly remain under 200 lines of code (<200 LoC).
3. `apps/web`:
   - Next.js 14+ with App Router (`src/app/`), Tailwind CSS, Lucide icons.
   - Comprehensive user workflows:
     a. Dynamic Career Graph Event Ingestion & Visual Timeline (`/career`): Quick-add event capture drawer/modal, event status poller, interactive career nodes timeline with STAR/XYZ metric badges and filterable tags.
     b. ATS-Tailored Resume Builder (`/resume`): JD text input/URL fetcher, requirement extraction preview, career node retrieval list, knapsack character budget bar (1-page constraint budget indicator), ATS compliance score breakdown, and live A4 document preview.
     c. Visual Proof Mockup Generator (`/mockups`): Screenshot upload, device frame selector (MacBook, iPhone, Browser, Social Card), aspect ratio & gradient backdrop controls, live canvas renderer & export.
     d. Portfolio Website Configurator (`/portfolio`): Theme picker (Minimal, Dark Glass, Modern Bento), subdomain/custom domain settings, project order manager, live responsive preview.
     e. BYOK Security Vault (`/vault`): Envelope encryption key manager for Anthropic, OpenAI, and Gemini with client-side key masking, active status indicator, last-4 display, and allowlisted base-URL security badging.
     f. Career Acceleration Tools (`/tools`): LinkedIn headline & post optimizer, AI mock interview session simulator, cover letter generator, skill gap analyzer.
   - Clean navigation, responsive layouts, header/sidebar, and toast notifications.
4. STRICT USER RULE:
   - In any project, if the file is not JSON / raw data, make sure every file strictly remains under 200 lines of code (<200 LoC). Deconstruct into sub-components, custom hooks, and utility modules.
5. Verification:
   - Run type checks / build checks to verify TypeScript compiles cleanly.
   - Write your completion handoff report to `c:\Projects\karma\.agents\worker_frontend_1\handoff.md` and send a message back.

## 2026-08-31T13:50:22Z

**Context**: Scope update from User / Sentinel
**Content**: User directive received: Only generate component prompts and UI components that will actually be used in the Karma product modules (e.g., landing/marketing page, career graph visualizer, ATS resume builder & preview, LinkedIn asset optimizer, portfolio showcase, mockup generator, dashboard, interactive navigation, and vault settings). Focus specifically on the active, necessary set for Karma.
**Action**: Implement the focused, high-impact set of ReactBits UI components in `packages/ui` and integrate them across all Next.js app workflows in `apps/web`. Maintain strict code discipline (<200 LoC per file).
