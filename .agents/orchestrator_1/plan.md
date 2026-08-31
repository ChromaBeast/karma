# Detailed Execution Plan

## Objective
Deliver a production-ready, clean monorepo for Karma containing 171 component specification prompts, Go Chi REST API microservices with comprehensive Postgres+pgvector schema, Next.js web application, and modular ReactBits UI package (<200 LoC per file).

## Milestone Breakdown

### Milestone 1: Component Specification Prompts (`prompts/`)
- Generate all 171 individual markdown files across 4 categories:
  1. `prompts/text-animations/` (32 components: Text Loop, Masked Heading, Particle Text, Split Flap Text, Warp Text, Stroke Text, Depth Text, Fold Text, Echo Text, Split Text, Blur Text, Circular Text, Text Type, Shuffle, Shiny Text, Text Pressure, Curved Loop, Fuzzy Text, Gradient Text, Falling Text, Text Cursor, Decrypted Text, True Focus, Scroll Float, Scroll Reveal, ASCII Text, Scrambled Text, Rotating Text, Glitch Text, Scroll Velocity, Variable Proximity, Count Up)
  2. `prompts/animations/` (38 components: Glow Cursor, Scroll Expand, Ripple Distortion, Elastic Mesh, Swarm Cursor, Halftone Reveal, Pixel Swap, Cursor Grid, Animated Content, Fade Content, Electric Border, Orbit Images, Pixel Transition, Glare Hover, Antigravity, Logo Loop, Target Cursor, Magic Rings, Laser Flow, Magnet Lines, Ghost Cursor, Gradual Blur, Click Spark, Magnet, Strands, Sticker Peel, Pixel Trail, Cubes, Metallic Paint, Noise, Shape Blur, Crosshair, Image Trail, Ribbons, Splash Cursor, Meta Balls, Blob Cursor, Star Border)
  3. `prompts/components/` (45 components: Infinite Spiral, Depth Carousel, Morph Slider, Drift Wall, Accordion Gallery, Specular Button, Option Wheel, Curved Input, Line Sidebar, Animated List, Scroll Stack, Bubble Menu, Magic Bento, Circular Gallery, Reflective Card, Card Nav, Stack, Fluid Glass, Pill Nav, Tilted Card, Masonry, Glass Surface, Dome Gallery, Chroma Grid, Folder, Staggered Menu, Model Viewer, Lanyard, Profile Card, Dock, Gooey Nav, Pixel Card, Carousel, Spotlight Card, Border Glow, Flying Posters, Card Swap, Glass Icons, Decay Card, Flowing Menu, Elastic Slider, Counter, Infinite Menu, Stepper, Bounce Cards)
  4. `prompts/backgrounds/` (56 components: Aero Shards, Ghost Fibers, CRT Warp, Molten Metal, Gradient Waves, Web Threads, Topography, Light Tunnel, Sliced Waves, Acid Squares, Scanner, Ferrofluid, Lightfall, Liquid Ether, Prism, Dark Veil, Light Pillar, Silk, Floating Lines, Side Rays, Light Rays, Pixel Blast, Color Bends, Evil Eye, Line Waves, Radar, Soft Aurora, Aurora, Plasma, Plasma Wave, Particles, Gradient Blinds, Grainient, Grid Scan, Beams, Pixel Snow, Lightning, Prismatic Burst, Galaxy, Dither, Faulty Terminal, Ripple Grid, Dot Field, Dot Grid, Threads, Hyperspeed, Iridescence, Waves, Grid Distortion, Ballpit, Orb, Letter Glitch, Grid Motion, Shape Grid, Liquid Chrome, Balatro)
- Verification: Count markdown files = 171; verify structured headings (Overview, Props Interface, Animation Specifications, Canvas/CSS formulas, State Transitions, Implementation Guidelines).

### Milestone 2: Go Chi API Gateway & Services (`apps/api`)
- `migrations/`: Comprehensive SQL schema for PostgreSQL + `pgvector` covering all tables: `users`, `refresh_tokens`, `career_node_events`, `career_nodes`, `job_descriptions`, `generated_resumes`, `resume_bullet_selections`, `portfolios`, `portfolio_projects`, `mockups`, `linkedin_assets`, `interview_sessions`, `cover_letters`, `outreach_scripts`, `skill_gap_analyses`, `api_key_vault`, `llm_executions`, `managed_credit_ledger`, `billing_accounts`, `prompt_cache`.
- `pkg/auth`: JWT generation/verification, Refresh token family rotation with SHA-256 hash tracking and reuse revocation.
- `pkg/vault`: AES-256-GCM envelope encryption for BYOK keys, key wrapping, last-4 display logic, base-URL allowlist validation.
- `pkg/career`: `POST /v1/career-events` ingestion handler, asynchronous structuring worker mock/pipeline with STAR/XYZ metric parsing, vector embedding generation stub.
- `pkg/resume`: JD requirements parser, embedding similarity search, LLM re-ranking scorer, knapsack character budget selection algorithm, ATS-compliant rendering template.
- `pkg/llm`: Dual router with BYOK vs managed credits, network allowlist enforcement.
- `pkg/portfolio`, `pkg/mockup`, `pkg/tools`: Full API modules.
- `cmd/server/main.go`: Chi router assembly, middleware (CORS, logger, recovery, rate limiter).
- Verification: `go test ./...` with high test coverage and all files <200 LoC.

### Milestone 3: ReactBits Reverse-Engineered UI Library (`packages/ui`)
- Workspace setup with Tailwind CSS, TypeScript, and clean modular exports.
- Pure Tailwind CSS, native Canvas/WebGL, or Web Animations API without heavy 3rd-party animation libraries.
- Modular decomposition to ensure all files are <200 LoC.

### Milestone 4: Next.js 14+ Web Application (`apps/web`)
- Complete frontend workflows:
  - Career Event capture modal & timeline view.
  - Resume Builder with live ATS preview and knapsack section budget indicators.
  - Portfolio theme customizer with real-time preview.
  - Mockup generator (device frame / social card).
  - BYOK Vault manager (Anthropic, OpenAI, Gemini key inputs with client-side masking).
- Modular architecture with reusable components adhering to <200 LoC.

### Milestone 5: Verification, Audit & Sentinel Handoff
- Worker and Reviewer runs of `go test ./...`, typescript compilation, and linting.
- Forensic Auditor integrity check.
- Synthesis and completion report to Sentinel.
