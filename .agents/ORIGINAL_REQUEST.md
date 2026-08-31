# Original User Request

## Initial Request — 2026-08-31T13:47:43Z

Build Karma, a comprehensive career compounding monorepo with a Go Chi backend and Next.js frontend, featuring individual component specification prompts and custom, dependency-free reverse-engineered ReactBits UI components.

Working directory: c:\Projects\karma
Integrity mode: development

Git Remote: https://github.com/ChromaBeast/karma.git
Reference: `c:\Projects\karma\karma-architecture.md`

## Requirements

### R1. Component Specification Prompts in `prompts/`
Generate individual Markdown prompt files in the `prompts/` directory for every listed ReactBits component across all 4 categories (Text Animations, Animations, Components, Backgrounds). Each prompt specification must detail component parameters, behavior, animation physics/canvas/CSS formulas, interaction mechanics, and implementation guidance without third-party animation library lock-in.

The components are:
- **Text Animations**: Text Loop, Masked Heading, Particle Text, Split Flap Text, Warp Text, Stroke Text, Depth Text, Fold Text, Echo Text, Split Text, Blur Text, Circular Text, Text Type, Shuffle, Shiny Text, Text Pressure, Curved Loop, Fuzzy Text, Gradient Text, Falling Text, Text Cursor, Decrypted Text, True Focus, Scroll Float, Scroll Reveal, ASCII Text, Scrambled Text, Rotating Text, Glitch Text, Scroll Velocity, Variable Proximity, Count Up.
- **Animations**: Glow Cursor, Scroll Expand, Ripple Distortion, Elastic Mesh, Swarm Cursor, Halftone Reveal, Pixel Swap, Cursor Grid, Animated Content, Fade Content, Electric Border, Orbit Images, Pixel Transition, Glare Hover, Antigravity, Logo Loop, Target Cursor, Magic Rings, Laser Flow, Magnet Lines, Ghost Cursor, Gradual Blur, Click Spark, Magnet, Strands, Sticker Peel, Pixel Trail, Cubes, Metallic Paint, Noise, Shape Blur, Crosshair, Image Trail, Ribbons, Splash Cursor, Meta Balls, Blob Cursor, Star Border.
- **Components**: Infinite Spiral, Depth Carousel, Morph Slider, Drift Wall, Accordion Gallery, Specular Button, Option Wheel, Curved Input, Line Sidebar, Animated List, Scroll Stack, Bubble Menu, Magic Bento, Circular Gallery, Reflective Card, Card Nav, Stack, Fluid Glass, Pill Nav, Tilted Card, Masonry, Glass Surface, Dome Gallery, Chroma Grid, Folder, Staggered Menu, Model Viewer, Lanyard, Profile Card, Dock, Gooey Nav, Pixel Card, Carousel, Spotlight Card, Border Glow, Flying Posters, Card Swap, Glass Icons, Decay Card, Flowing Menu, Elastic Slider, Counter, Infinite Menu, Stepper, Bounce Cards.
- **Backgrounds**: Aero Shards, Ghost Fibers, CRT Warp, Molten Metal, Gradient Waves, Web Threads, Topography, Light Tunnel, Sliced Waves, Acid Squares, Scanner, Ferrofluid, Lightfall, Liquid Ether, Prism, Dark Veil, Light Pillar, Silk, Floating Lines, Side Rays, Light Rays, Pixel Blast, Color Bends, Evil Eye, Line Waves, Radar, Soft Aurora, Aurora, Plasma, Plasma Wave, Particles, Gradient Blinds, Grainient, Grid Scan, Beams, Pixel Snow, Lightning, Prismatic Burst, Galaxy, Dither, Faulty Terminal, Ripple Grid, Dot Field, Dot Grid, Threads, Hyperspeed, Iridescence, Waves, Grid Distortion, Ballpit, Orb, Letter Glitch, Grid Motion, Shape Grid, Liquid Chrome, Balatro.

### R2. Maintainable Monorepo Architecture
Establish a clean monorepo containing:
- `apps/api`: Go Chi REST API Gateway and microservice modules implementing the Karma architecture.
- `apps/web`: Next.js 14+ / React application providing full user workflows (career graph event capture, resume generation with live preview, portfolio configuration, mockup renderer, BYOK vault).
- `packages/ui`: Reusable, modular UI components reverse-engineered from the ReactBits catalog using pure Tailwind CSS, native Canvas/WebGL, or Web Animations API without external heavy animation library bloat.
- Code discipline: Ensure all code files (except raw data/JSON) strictly remain under 200 lines of code by extracting reusable sub-components, services, and utility classes.

### R3. Go API Gateway & Core Karma Services
Implement the Go backend services adhering to `karma-architecture.md`:
- Database migrations and schema for PostgreSQL + `pgvector` (`users`, `refresh_tokens`, `career_node_events`, `career_nodes`, `job_descriptions`, `generated_resumes`, `api_key_vault`, `llm_executions`, `portfolios`, `mockups`, etc.).
- Authentication with JWT access tokens and secure refresh token rotation family tracking.
- Career node event ingestion pipeline (`POST /v1/career-events`) and structuring worker logic.
- BYOK API key vault using envelope encryption (AES-256-GCM) and outbound LLM base-URL network allow-listing.
- ATS-tailored resume generation pipeline with knapsack character budget selection and scoring.

## Acceptance Criteria

### Component Prompts
- [ ] All 170+ component `.md` prompt files generated under `prompts/` categorized into text animations, animations, components, and backgrounds.
- [ ] Each prompt file contains input props, animation specifications, state transitions, and implementation guidelines.

### UI & Monorepo Structure
- [ ] Monorepo structure compiles and passes linting/type-checks (`pnpm build` / `pnpm lint`).
- [ ] UI component library in `packages/ui` provides clean, reusable implementations without external animation package bloat.
- [ ] Code files strictly follow the <200 LoC threshold with modular decomposition.

### Go Backend & Database
- [ ] Go API gateway compiles and starts successfully with Chi router (`go build ./...` / `go test ./...`).
- [ ] Database migration files cover all tables and indexes specified in `karma-architecture.md`.
- [ ] Endpoints for auth, career event capture, and BYOK vault encryption pass unit/integration tests.

## Follow-up — 2026-08-31T13:49:47Z

User update: Only generate component prompts and UI components that will actually be used in the Karma product modules (e.g., landing/marketing page, career graph visualizer, ATS resume builder & preview, LinkedIn asset optimizer, portfolio showcase, mockup generator, dashboard, interactive navigation, and vault settings). Do not generate unused or redundant components from the ReactBits list; focus specifically on the active, necessary set for Karma.
