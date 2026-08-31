import os

PROMPTS_DIR = r"c:\Projects\karma\prompts\text-animations"
os.makedirs(PROMPTS_DIR, exist_ok=True)

ITEMS = [
    {
        "id": "text-loop",
        "name": "Text Loop",
        "category": "Text Animations",
        "overview": "Text Loop renders an automated cyclical ticker that smoothly swaps words, phrases, or custom JSX nodes in a rhythmic cadence. Features zero layout shift via predictive bounding-box reservation, seamless vertical or horizontal sliding, pause-on-hover mechanics, and cubic-bezier easing.",
        "props": """interface TextLoopProps {
  /** Array of text strings or React elements to cycle through */
  items: (string | React.ReactNode)[];
  /** Dwell interval per item in milliseconds (default: 3000) */
  interval?: number;
  /** Transition duration in milliseconds (default: 450) */
  duration?: number;
  /** Sliding direction for transition (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Cubic bezier timing function (default: 'cubic-bezier(0.16, 1, 0.3, 1)') */
  easing?: string;
  /** Pause cycling when user pointer hovers over the element (default: true) */
  pauseOnHover?: boolean;
  /** CSS class name for outer container */
  className?: string;
  /** CSS class name for item wrapper */
  itemClassName?: string;
  /** Callback triggered on item transition with new active index */
  onIndexChange?: (index: number) => void;
}""",
        "timing": "Each cycle consists of an idle dwell duration $T_{dwell} = 3000\\text{ms}$ followed by an active transition duration $T_{trans} = 450\\text{ms}$. Easing follows quintic ease-out curve $C(t) = \\text{cubic-bezier}(0.16, 1, 0.3, 1)$. Active incoming item enters from $+100\\%$ along the motion vector to $0\\%$, while outgoing item departs from $0\\%$ to $-100\\%$.",
        "math": """The normalized transition progress $\\tau(t) = \\text{clamp}\\left(\\frac{t - t_0}{T_{trans}}, 0, 1\\right)$ is mapped through a quintic ease-out function:
$$f(\\tau) = 1 - (1 - \\tau)^5$$
For translation along coordinate axis $u \\in \\{x, y\\}$ with offset distance $L$:
$$u_{in}(\\tau) = L \\cdot (1 - f(\\tau))$$
$$u_{out}(\\tau) = -L \\cdot f(\\tau)$$
Opacity crossfade functions:
$$\\alpha_{in}(\\tau) = f(\\tau), \\quad \\alpha_{out}(\\tau) = 1 - f(\\tau)$$""",
        "interaction": "Listens for `pointerenter` and `pointerleave` to toggle `isPaused` state. Supports `aria-live=\"polite\"` and `aria-atomic=\"true\"`. If `prefers-reduced-motion` is active, 3D translation is skipped in favor of a 150ms crossfade.",
        "implementation": """1. Container Setup: Inline-flex wrapper with `relative overflow-hidden` and dynamic height matching the largest child.
2. Slot Buffer: Maintain current index $i$ and next index $j = (i + 1) \\% N$ in a dual-slot sliding buffer to minimize DOM nodes.
3. Web Animations API (WAAPI): Drive transitions via `element.animate()` with keyframes `translateY(100%) -> translateY(0%)`.
4. ResizeObserver: Auto-measure dimensions to eliminate layout shifts.""",
        "modularity": "Organized into `TextLoop.tsx` (main orchestrator, <140 LoC), `useTextLoop.ts` (timer hook, <80 LoC), and `textLoopStyles.ts` (<50 LoC)."
    },
    {
        "id": "masked-heading",
        "name": "Masked Heading",
        "category": "Text Animations",
        "overview": "Masked Heading reveals typography using dynamic geometric clip-paths, SVG masks, or radial spotlight gradients that follow pointer coordinates or scroll progress. Delivers high visual contrast between masked and unmasked text layers.",
        "props": """interface MaskedHeadingProps {
  /** Heading text content */
  text: string;
  /** HTML semantic heading tag (default: 'h1') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  /** Mask style: spotlight following pointer, linear wipe, or radial gradient */
  maskType?: 'spotlight' | 'linear-wipe' | 'radial' | 'svg';
  /** Spotlight radius in pixels (default: 160) */
  spotlightRadius?: number;
  /** Reveal progress [0..1] when controlled externally by scroll */
  progress?: number;
  /** Color of exposed highlight text */
  revealColor?: string;
  /** Base background color of unmasked text */
  baseColor?: string;
  /** Custom CSS class names */
  className?: string;
}""",
        "timing": "Scroll/linear reveals transition over 600ms with cubic-bezier `(0.25, 1, 0.5, 1)`. Pointer tracking spotlight executes at 60/120 FPS with an exponential lerp factor $\\alpha = 0.15$ ($16\\text{ms}$ lag response).",
        "math": """Pointer coordinates $(x_c, y_c)$ are smoothed via discrete exponential low-pass filter:
$$x_c(t) = x_c(t-1) + \\alpha \\cdot (x_{target} - x_c(t-1))$$
$$y_c(t) = y_c(t-1) + \\alpha \\cdot (y_{target} - y_c(t-1))$$
CSS mask-image definition:
$$\\text{mask}(x, y) = \\text{radial-gradient}(R\\text{px at } x_c\\text{px } y_c\\text{px}, \\#fff \\ 0\\%, \\#fff \\ 70\\%, \\text{transparent } 100\\%)$$
For linear scroll wipes at angle $\\theta$:
$$\\text{clip-path: polygon}(0\\% \\ 0\\%, p \\cdot 100\\% \\ 0\\%, (p - 0.15) \\cdot 100\\% \\ 100\\%, 0\\% \\ 100\\%)$$""",
        "interaction": "Attaches `pointermove` to element bounding box. On touch devices, automatically falls back to continuous gentle pulse animation or scroll-driven reveal.",
        "implementation": """1. Dual Text Layering: Underlay renders inactive text with `baseColor`; absolute overlay renders highlight text.
2. GPU Masking: Apply `mask-image` or `clip-path` with `will-change: mask-image, transform`.
3. CSS Custom Properties: Update `--mask-x` and `--mask-y` directly on element style inside `requestAnimationFrame` loop.
4. Fallback: Uses `background-clip: text` if CSS masks are unsupported.""",
        "modularity": "Divided into `MaskedHeading.tsx` (<120 LoC), `usePointerMask.ts` (<80 LoC), and `maskCalculations.ts` (<60 LoC)."
    },
    {
        "id": "particle-text",
        "name": "Particle Text",
        "category": "Text Animations",
        "overview": "Particle Text rasterizes typography onto an offscreen canvas, samples luminance to create a coordinate grid of particles, and simulates real-time physics including cursor repulsion, spring equilibrium return, velocity damping, and jitter turbulence.",
        "props": """interface ParticleTextProps {
  /** Text string to render in particles */
  text: string;
  /** Font family for rasterization */
  fontFamily?: string;
  /** Font size in pixels (default: 72) */
  fontSize?: number;
  /** Font weight (default: 700) */
  fontWeight?: number | string;
  /** Grid sampling density step in pixels (default: 3) */
  density?: number;
  /** Particle color or array of colors for gradients */
  color?: string | string[];
  /** Repulsion radius around cursor in pixels (default: 120) */
  repulsionRadius?: number;
  /** Repulsion strength coefficient (default: 4.5) */
  repulsionStrength?: number;
  /** Spring return stiffness constant k (default: 0.08) */
  springTension?: number;
  /** Friction damping factor (default: 0.88) */
  damping?: number;
  /** Canvas width in pixels or '100%' */
  width?: number | string;
  /** Canvas height in pixels or '100%' */
  height?: number | string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Physics simulation runs continuously at display refresh rate (60/120 FPS). Particle displacement rise time is $<16\\text{ms}$, and spring settling duration is $\\approx 550\\text{ms}$.",
        "math": """For particle $i$ with current position $\\vec{p}_i = (x_i, y_i)$, rest position $\\vec{p}_{0,i} = (x_{0,i}, y_{0,i})$, and cursor $\\vec{p}_{c} = (x_c, y_c)$:
1. Restoring Spring Force:
   $$\\vec{F}_{spring} = -k \\cdot (\\vec{p}_i - \\vec{p}_{0,i})$$
2. Cursor Repulsion Force ($r = \\|\\vec{p}_i - \\vec{p}_c\\|$):
   $$\\vec{F}_{rep} = \\begin{cases} \\frac{G}{r^2 + \\epsilon} \\cdot \\frac{\\vec{p}_i - \\vec{p}_c}{r} & \\text{if } r < R_{rep} \\\\ 0 & \\text{otherwise} \\end{cases}$$
3. Velocity Integration:
   $$\\vec{v}_i(t + \\Delta t) = \\left(\\vec{v}_i(t) + \\frac{\\vec{F}_{spring} + \\vec{F}_{rep}}{m} \\cdot \\Delta t\\right) \\cdot c$$
   $$\\vec{p}_i(t + \\Delta t) = \\vec{p}_i(t) + \\vec{v}_i(t + \\Delta t) \\cdot \\Delta t$$""",
        "interaction": "Mouse move updates cursor position vector. Clicks trigger a high-velocity radial impulse wave radiating outward from click origin.",
        "implementation": """1. Rasterization: Render text to offscreen canvas using `ctx.fillText()` and extract pixel buffer with `ctx.getImageData()`.
2. Particle Buffer: Pack active particle coordinates into typed arrays `Float32Array` for cache-friendly memory access.
3. Canvas Render Loop: Clear canvas and draw particle paths in a batch using `ctx.arc()` or WebGL instanced point drawing.
4. Resource Cleanup: Cancel `requestAnimationFrame` handle and dispose typed buffers upon unmount.""",
        "modularity": "Organized into `ParticleText.tsx` (<110 LoC), `ParticleEngine.ts` (<150 LoC), `rasterizer.ts` (<80 LoC), and `particleTypes.ts` (<50 LoC)."
    },
    {
        "id": "split-flap-text",
        "name": "Split Flap Text",
        "category": "Text Animations",
        "overview": "Split Flap Text replicates retro mechanical airport/train departures boards with 3D cascading split-flap cards. Features split top/bottom character tiles, 3D perspective fold rotation, authentic shadow gradients, and staggered character flipping.",
        "props": """interface SplitFlapTextProps {
  /** Target text string to display */
  text: string;
  /** Character set available for mechanical flipping (default: alphanumeric + symbols) */
  charset?: string;
  /** Stagger delay between successive character columns in milliseconds (default: 80) */
  stagger?: number;
  /** Flip animation duration per character step in milliseconds (default: 120) */
  flipDuration?: number;
  /** Number of intermediate flips before settling on target (default: 5) */
  flipsPerChar?: number;
  /** 3D perspective depth in pixels (default: 600) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
  /** Character card background color */
  cardColor?: string;
  /** Text color */
  textColor?: string;
}""",
        "timing": "Each individual half-flap rotates $180^\\circ$ across two phases of $60\\text{ms}$ ($120\\text{ms}$ total per flip step). Sequential characters start with an $80\\text{ms}$ cascade delay.",
        "math": """The 3D card rotation angle $\\theta(t)$ over normalized step time $\\tau \\in [0, 1]$ is:
$$\\theta(\\tau) = 180^\\circ \\cdot \\tau$$
Phase 1 (Top half folding down from $0^\\circ$ to $90^\\circ$):
$$\\text{transform: rotateX}(-\\theta_1), \\quad \\theta_1 \\in [0^\\circ, 90^\\circ]$$
$$\\text{shadow opacity: } S_1 = \\sin(\\theta_1) \\cdot 0.6$$
Phase 2 (Bottom half dropping from $-90^\\circ$ to $0^\\circ$):
$$\\text{transform: rotateX}(\\theta_2), \\quad \\theta_2 \\in [-90^\\circ, 0^\\circ]$$
$$\\text{shadow opacity: } S_2 = \\cos(\\theta_2) \\cdot 0.6$$""",
        "interaction": "Triggers flip sequences whenever `text` prop changes. Supports hover-triggered preview flip. Accessible hidden `<span>` contains the current target string for screen readers.",
        "implementation": """1. Tile Hierarchy: Each character column consists of static top/bottom halves and dynamic 3D folding top/bottom cards.
2. CSS 3D Transforms: Apply `perspective: 600px`, `transform-style: preserve-3d`, and `transform-origin: bottom` on top flap.
3. Audio/Haptic sync: Optional audio tick event synchronized at flip midpoint ($90^\\circ$).
4. Reduced Motion: Instant character change without 3D rotation if `prefers-reduced-motion` is enabled.""",
        "modularity": "Decompose into `SplitFlapText.tsx` (<120 LoC), `SplitFlapColumn.tsx` (<130 LoC), `useSplitFlapController.ts` (<80 LoC), and `flapStyles.ts` (<50 LoC)."
    },
    {
        "id": "warp-text",
        "name": "Warp Text",
        "category": "Text Animations",
        "overview": "Warp Text deforms and animates typography along dynamic cubic Bezier curves, parametric sine waves, or interactive vector paths using SVG `<textPath>` or Canvas 2D matrix warping with real-time curvature control.",
        "props": """interface WarpTextProps {
  /** Text content to warp */
  text: string;
  /** Warping geometry curve type */
  curveType?: 'arch' | 'wave' | 'circle' | 'flag' | 'bezier';
  /** Curvature amplitude in pixels or percentage (default: 50) */
  amplitude?: number;
  /** Wave frequency count across text length (default: 2) */
  frequency?: number;
  /** Speed of continuous wave animation (0 = static, default: 1.0) */
  speed?: number;
  /** SVG viewBox width (default: 600) */
  width?: number;
  /** SVG viewBox height (default: 200) */
  height?: number;
  /** Custom CSS classes */
  className?: string;
  /** Text fill color */
  fill?: string;
}""",
        "timing": "Continuous wave phase $\\phi(t)$ oscillates with period $T = \\frac{2\\pi}{\\omega \\cdot \\text{speed}}$. Interactive hover transitions interpolate curvature with spring duration $350\\text{ms}$.",
        "math": """Parametric curve definition $P(s) = (x(s), y(s))$ for normalized arc length $s \\in [0, 1]$:
$$x(s) = s \\cdot W$$
$$y(s) = \\frac{H}{2} + A \\cdot \\sin(2\\pi \\cdot f \\cdot s + \\omega t)$$
For cubic Bezier path interpolation:
$$B(s) = (1-s)^3 P_0 + 3(1-s)^2 s P_1 + 3(1-s) s^2 P_2 + s^3 P_3$$
Local tangent angle $\\theta(s)$ for letter orientation:
$$\\theta(s) = \\arctan\\left(\\frac{y'(s)}{x'(s)}\\right) = \\arctan(2\\pi f A \\cdot \\cos(2\\pi f s + \\omega t) / W)$$""",
        "interaction": "Mouse movement shifts control points $P_1, P_2$ dynamically, warping text toward cursor position.",
        "implementation": """1. SVG TextPath: Render `<path id=\"warp-curve\" d=\"...\">` and bind `<text><textPath href=\"#warp-curve\">`.
2. Animation Loop: Update path `d` attribute string or CSS transform in `requestAnimationFrame`.
3. Font Metrics: Calculate `textLength` and `startOffset` for precise centering.
4. Optimization: Use vector path caching to minimize DOM string parsing overhead.""",
        "modularity": "Decompose into `WarpText.tsx` (<130 LoC), `bezierCurves.ts` (<90 LoC), and `useWarpAnimation.ts` (<80 LoC)."
    },
    {
        "id": "stroke-text",
        "name": "Stroke Text",
        "category": "Text Animations",
        "overview": "Stroke Text renders hollow outlined typography with animated SVG stroke drawing paths (`stroke-dashoffset`), glowing neon vector contours, dynamic gradient fills, and synchronized fill-in transitions.",
        "props": """interface StrokeTextProps {
  /** Text to render with animated stroke outlines */
  text: string;
  /** Stroke outline color */
  strokeColor?: string;
  /** Stroke width in pixels (default: 2) */
  strokeWidth?: number;
  /** Delay before drawing begins in milliseconds (default: 200) */
  delay?: number;
  /** Duration of path stroke draw in milliseconds (default: 1800) */
  drawDuration?: number;
  /** Duration of subsequent fill-in fade in milliseconds (default: 600) */
  fillDuration?: number;
  /** Fill color revealed after stroke completion */
  fillColor?: string;
  /** Glow blur radius in pixels (0 for sharp outline, default: 0) */
  glowRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Stroke drawing phase takes $T_{stroke} = 1800\\text{ms}$ with `cubic-bezier(0.65, 0, 0.35, 1)`, followed by fill fade-in over $T_{fill} = 600\\text{ms}$.",
        "math": """For an SVG path segment with total path length $L$:
$$\\text{stroke-dasharray} = L$$
$$\\text{stroke-dashoffset}(\\tau) = L \\cdot (1 - f(\\tau))$$
where $f(\\tau) = \\tau^2 (3 - 2\\tau)$ (Hermite smoothstep).
Fill opacity ramp:
$$\\alpha_{fill}(t) = \\begin{cases} 0 & \\text{if } t < T_{stroke} \\\\ \\frac{t - T_{stroke}}{T_{fill}} & \\text{if } T_{stroke} \\le t \\le T_{stroke} + T_{fill} \\\\ 1 & \\text{if } t > T_{stroke} + T_{fill} \\end{cases}$$""",
        "interaction": "Replays stroke drawing on viewport intersection (scroll trigger) or cursor hover.",
        "implementation": """1. SVG Typography: Render text glyphs as `<text>` with `fill: transparent; stroke: var(--stroke-color)`.
2. Path Measurement: Compute SVG path length using `path.getTotalLength()`.
3. Keyframe Animation: Animate `stroke-dashoffset` from $L$ to $0$ using WAAPI or CSS keyframes.
4. Glow Layer: Add duplicate `<text>` layer with `filter: drop-shadow(0 0 Xpx var(--stroke-color))`.""",
        "modularity": "Organized into `StrokeText.tsx` (<120 LoC), `useStrokeDraw.ts` (<80 LoC), and `strokeStyles.ts` (<50 LoC)."
    },
    {
        "id": "depth-text",
        "name": "Depth Text",
        "category": "Text Animations",
        "overview": "Depth Text generates pseudo-3D layered extruded typography using multi-layered directional text-shadows, lighting specular highlights, and real-time mouse parallax tilt.",
        "props": """interface DepthTextProps {
  /** Text content */
  text: string;
  /** Extrusion depth in pixels (default: 12) */
  depth?: number;
  /** Direction angle of extrusion in degrees (default: 45) */
  angle?: number;
  /** Front face color */
  frontColor?: string;
  /** Shadow extrusion base color */
  shadowColor?: string;
  /** Enable mouse tilt parallax (default: true) */
  interactive?: number | boolean;
  /** Parallax intensity scale (default: 1.0) */
  intensity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Mouse parallax tilt responds via critically damped spring with settling time $\\approx 300\\text{ms}$ and damping ratio $\\zeta = 0.85$.",
        "math": """For extrusion depth $D$ and angle $\\theta$:
$$S_n = \\sum_{k=1}^D (k \\cdot \\cos(\\theta))\\text{px } (k \\cdot \\sin(\\theta))\\text{px } 0\\text{px } \\text{color}(k)$$
where $\\text{color}(k) = \\text{lerpColor}(\\text{baseShadow}, \\text{darkShadow}, k / D)$.
3D perspective rotation from cursor offset $(\\Delta x, \\Delta y)$:
$$\\text{rotateX} = -\\frac{\\Delta y}{H} \\cdot \\theta_{max}, \\quad \\text{rotateY} = \\frac{\\Delta x}{W} \\cdot \\theta_{max}$$""",
        "interaction": "Tracks pointer offset relative to component center $(x - x_0, y - y_0)$ to compute directional lighting and perspective tilt.",
        "implementation": """1. Dynamic Style Generation: Compute comma-separated `text-shadow` layers inside a memoized hook.
2. Perspective Wrapper: Container with `perspective: 800px; transform-style: preserve-3d`.
3. Spring Lerp: Update CSS variables `--tilt-x`, `--tilt-y` smoothly via `requestAnimationFrame`.
4. Performance: Avoid layout thrashing by updating transforms only on composite layer.""",
        "modularity": "Decompose into `DepthText.tsx` (<120 LoC), `depthShadows.ts` (<80 LoC), and `useTiltSpring.ts` (<80 LoC)."
    },
    {
        "id": "fold-text",
        "name": "Fold Text",
        "category": "Text Animations",
        "overview": "Fold Text creates an origami 3D accordion folding typography effect where characters or text lines fold and unfold along horizontal or vertical crease lines with realistic shading.",
        "props": """interface FoldTextProps {
  /** Text content to fold */
  text: string;
  /** Number of fold segments per line (default: 2) */
  folds?: number;
  /** Unfold progress from 0 (fully folded) to 1 (flat) */
  progress?: number;
  /** Trigger mode (default: 'scroll') */
  trigger?: 'hover' | 'scroll' | 'mount';
  /** Fold orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** Perspective depth in pixels (default: 800) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Unfolding transitions take $650\\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Crease shadows fade synchronously from $0.7$ opacity to $0$.",
        "math": """For fold segment $k \\in [0, N-1]$ with fold angle $\\theta_k$:
$$\\theta_k(p) = (1 - p) \\cdot (-1)^k \\cdot \\theta_{max}$$
where $\\theta_{max} = 75^\\circ$ and $p \\in [0, 1]$ is progress.
Segment height compression:
$$h_{visible} = h_{original} \\cdot \\cos(\\theta_k)$$
Crease shading gradient:
$$I_{shadow} = (1 - p) \\cdot |\\sin(\\theta_k)| \\cdot 0.65$$""",
        "interaction": "Unfolds on hover or scroll progress. Accessible plain text is retained in DOM for indexing.",
        "implementation": """1. Slicing: Split text into top and bottom clip-paths `polygon(0 0, 100% 0, 100% 50%, 0 50%)`.
2. 3D Origin: Top half uses `transform-origin: bottom`, bottom half uses `transform-origin: top`.
3. Shading Overlays: Add dynamic linear gradient overlay to simulate ambient occlusion.
4. Composite Layer: Use `backface-visibility: hidden` to prevent rendering artifacts.""",
        "modularity": "Organized into `FoldText.tsx` (<130 LoC), `FoldSegment.tsx` (<100 LoC), and `foldGeometry.ts` (<70 LoC)."
    },
    {
        "id": "echo-text",
        "name": "Echo Text",
        "category": "Text Animations",
        "overview": "Echo Text renders trailing translucent typography clones that follow pointer motion or scroll velocity with decaying opacity, chromatic color shifts, and staggered elastic spring delays.",
        "props": """interface EchoTextProps {
  /** Text content */
  text: string;
  /** Number of echo ghost clones (default: 5) */
  echoCount?: number;
  /** Spring lag delay between successive echoes in milliseconds (default: 40) */
  lagMs?: number;
  /** Opacity decay factor per echo layer (default: 0.6) */
  opacityDecay?: number;
  /** Chromatic aberration color offset array */
  colorPalette?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Echo clones follow lead element with a series of 1st-order lag filters ($\tau_k = k \cdot 40\text{ms}$). Settles within $400\text{ms}$ after motion stops.",
        "math": """For echo layer $k \in [1, N]$ at time $t$:
$$\vec{p}_k(t) = \vec{p}_k(t - \Delta t) + \frac{\Delta t}{\tau_k} \cdot (\vec{p}_{k-1}(t) - \vec{p}_k(t - \Delta t))$$
where $\vec{p}_0(t)$ is cursor/scroll target coordinate.
Echo layer opacity:
$$\alpha_k = \alpha_0 \cdot (\text{opacityDecay})^k$$
Scale reduction:
$$s_k = 1 - k \cdot 0.03$$""",
        "interaction": "Continuously reacts to pointer movement across viewport or scroll deltas. Disables trailing on touch devices to conserve battery.",
        "implementation": """1. Ghost Array: Maintain buffer of past positions $[(x_1, y_1), \dots, (x_N, y_N)]$.
2. Layer Stack: Absolute positioning with pointer-events: none and mix-blend-mode: screen.
3. GPU Acceleration: Apply `transform: translate3d(x, y, 0) scale(s)`.
4. Loop: Single `requestAnimationFrame` updates all echo positions simultaneously.""",
        "modularity": "Decompose into `EchoText.tsx` (<130 LoC), `useEchoTrail.ts` (<100 LoC), and `echoStyles.ts` (<50 LoC)."
    },
    {
        "id": "split-text",
        "name": "Split Text",
        "category": "Text Animations",
        "overview": "Split Text parses strings into individual character, word, or line spans, enabling granular staggered entrance reveals, 3D rotations, and clipping mask unmasking.",
        "props": """interface SplitTextProps {
  /** Text to split and animate */
  text: string;
  /** Split granularity mode (default: 'chars') */
  splitBy?: 'chars' | 'words' | 'lines';
  /** Stagger delay between sequential elements in milliseconds (default: 30) */
  stagger?: number;
  /** Animation duration per element in milliseconds (default: 600) */
  duration?: number;
  /** Preset animation effect (default: 'slide-up') */
  animation?: 'slide-up' | 'slide-down' | 'fade' | 'rotate-x' | 'scale';
  /** Custom easing curve (default: 'cubic-bezier(0.16, 1, 0.3, 1)') */
  easing?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Individual tokens animate over $600\\text{ms}$ with staggered offsets $\\Delta t_i = i \\cdot 30\\text{ms}$. Total sequence time $T = T_{duration} + N \\cdot \\Delta t$.",
        "math": """For token index $i \\in [0, N-1]$, animation start time $t_{start, i} = t_0 + i \\cdot \\text{stagger}$:
$$\\tau_i(t) = \\text{clamp}\\left(\\frac{t - t_{start, i}}{T_{duration}}, 0, 1\\right)$$
$$y_i(\\tau_i) = y_{initial} \\cdot (1 - f(\\tau_i))$$
$$\\theta_{x, i}(\\tau_i) = \\theta_{initial} \\cdot (1 - f(\\tau_i))$$
where $f(\\tau) = 1 - (1 - \\tau)^4$ (quartic ease-out).""",
        "interaction": "Triggers on scroll view entry using IntersectionObserver. Preserves whitespace and line wraps flawlessly.",
        "implementation": """1. Tokenizer: Split string while respecting Unicode grapheme clusters and spaces (`&nbsp;`).
2. Wrapper Overflow: Wrap each character/word in `inline-block overflow-hidden` container.
3. CSS Variables: Inject `--delay: ${i * stagger}ms` into inline styles.
4. Screen Reader: Render hidden full text in `aria-hidden=\"false\"` span with split spans marked `aria-hidden=\"true\"`.""",
        "modularity": "Organized into `SplitText.tsx` (<120 LoC), `splitTokenizer.ts` (<80 LoC), and `splitVariants.ts` (<70 LoC)."
    },
    {
        "id": "blur-text",
        "name": "Blur Text",
        "category": "Text Animations",
        "overview": "Blur Text executes high-fidelity typographic entrance reveals by transitioning characters or words from a heavy Gaussian blur with vertical offset and zero opacity to sharp, crystal-clear text.",
        "props": """interface BlurTextProps {
  /** Text content */
  text: string;
  /** Granularity of blur stagger (default: 'words') */
  splitBy?: 'words' | 'chars';
  /** Initial blur radius in pixels (default: 12) */
  blurRadius?: number;
  /** Initial vertical translation offset in pixels (default: 20) */
  offsetY?: number;
  /** Animation duration per element in milliseconds (default: 700) */
  duration?: number;
  /** Stagger delay between tokens in milliseconds (default: 40) */
  stagger?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Each word/char transitions over $700\\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)` with $40\\text{ms}$ stagger interval.",
        "math": """For token index $i$, normalized time $\\tau_i$:
$$\\text{filter: blur}(B_i\\text{px}), \\quad B_i(\\tau_i) = B_{initial} \\cdot (1 - f(\\tau_i))$$
$$y_i(\\tau_i) = Y_{initial} \\cdot (1 - f(\\tau_i))$$
$$\\alpha_i(\\tau_i) = f(\\tau_i)$$
where $f(\\tau) = 1 - (1 - \\tau)^3$ (cubic ease-out).""",
        "interaction": "Scroll-activated via IntersectionObserver with threshold $0.2$. Reversible on viewport exit if desired.",
        "implementation": """1. Token Spans: Wrap each token with `inline-block will-change: filter, transform, opacity`.
2. WAAPI Keyframes: Animate `filter: blur(12px) translateY(20px) opacity(0)` to `blur(0px) translateY(0px) opacity(1)`.
3. Fallback: On low-power devices, degrade `filter: blur` to simple opacity fade.
4. Layout Safety: Maintain standard whitespace flow without breaking flex/grid layouts.""",
        "modularity": "Decompose into `BlurText.tsx` (<120 LoC), `useBlurTransition.ts` (<80 LoC), and `blurStyles.ts` (<50 LoC)."
    },
    {
        "id": "circular-text",
        "name": "Circular Text",
        "category": "Text Animations",
        "overview": "Circular Text bends typography along a complete $360^\\circ$ radial circle with uniform angular spacing, rotational alignment, and continuous spin or mouse-driven rotational drag physics.",
        "props": """interface CircularTextProps {
  /** Text string to distribute around circle */
  text: string;
  /** Radius of circular path in pixels (default: 100) */
  radius?: number;
  /** Continuous rotation speed in RPM or seconds per rotation (default: 15s) */
  spinDuration?: number;
  /** Direction of rotation (default: 'clockwise') */
  direction?: 'clockwise' | 'counter-clockwise';
  /** Rotate on pointer drag (default: true) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous rotation completes one full revolution ($2\\pi\\text{ rad}$) every $15\\text{s}$ linearly (`linear` easing, infinite loop). Inertial drag decays over $800\\text{ms}$.",
        "math": """For $N$ characters, the angular step between character $i \\in [0, N-1]$ is:
$$\\Delta \\theta = \\frac{2\\pi}{N}$$
$$\\theta_i(t) = \\theta_0(t) + i \\cdot \\Delta \\theta$$
Cartesian coordinates for character $i$:
$$x_i = R \\cdot \\cos(\\theta_i(t)), \\quad y_i = R \\cdot \\sin(\\theta_i(t))$$
Character rotation angle:
$$\\phi_i = \\theta_i(t) + \\frac{\\pi}{2}$$""",
        "interaction": "Pointer down + drag computes angular delta $\\Delta \\theta = \\arctan2(y_2, x_2) - \\arctan2(y_1, x_1)$, imparting rotational angular velocity $\\omega$.",
        "implementation": """1. SVG Path or CSS Transforms: Position characters using `transform: rotate(calc(var(--angle))) translateY(calc(-1 * var(--radius)))`.
2. Animation Loop: Rotate root container or increment base angle `--rot` in `requestAnimationFrame`.
3. Inertial Physics: Apply damping $\\omega(t + \\Delta t) = \\omega(t) \\cdot 0.95$ when pointer is released.
4. Center Anchor: Support optional centered icon or logo inside circular perimeter.""",
        "modularity": "Organized into `CircularText.tsx` (<130 LoC), `useAngularDrag.ts` (<100 LoC), and `circularMath.ts` (<60 LoC)."
    },
    {
        "id": "text-type",
        "name": "Text Type",
        "category": "Text Animations",
        "overview": "Text Type emulates realistic human typewriter mechanics with variable typing cadences, authentic pauses at punctuation marks, simulated backspace deletions, and blinking terminal cursor.",
        "props": """interface TextTypeProps {
  /** Array of phrases to type and erase sequentially */
  phrases: string[];
  /** Base typing speed in milliseconds per character (default: 60) */
  typingSpeed?: number;
  /** Base deleting speed in milliseconds per character (default: 30) */
  deletingSpeed?: number;
  /** Dwell pause after completing a phrase in milliseconds (default: 2000) */
  dwellTime?: number;
  /** Natural variance factor for human cadence [0..1] (default: 0.3) */
  variance?: number;
  /** Cursor symbol or blinking element (default: '|') */
  cursor?: string | React.ReactNode;
  /** Loop infinitely (default: true) */
  loop?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Typing cadence per character $i$: $\\Delta t_i = \\text{typingSpeed} \\cdot (1 + \\text{random}(-v, v))$. Punctuation marks (., !, ?) inject an extra $250\\text{ms}$ pause.",
        "math": """Dynamic character delay calculation:
$$\\Delta t = T_{base} \\cdot (1 + (2r - 1) \\cdot V) + T_{punct}$$
where $r \\sim U(0, 1)$, $V$ is variance factor, and:
$$T_{punct} = \\begin{cases} 250\\text{ms} & \\text{if char} \\in \\{\\text{'.', '!', '?', ','}\\} \\\\ 0 & \\text{otherwise} \\end{cases}$$
Cursor blink cycle:
$$B(t) = \\begin{cases} 1 & \\text{if } (t \\bmod 1000\\text{ms}) < 500\\text{ms} \\\\ 0 & \\text{otherwise} \\end{cases}$$""",
        "interaction": "Accessible live text container with `aria-live=\"polite\"`. Respects user pauses or external trigger events.",
        "implementation": """1. State Machine: States: `TYPING`, `DWELLING`, `DELETING`, `PAUSED`.
2. Recursive Timeout: Use `setTimeout` with calculated dynamic delay rather than static `setInterval`.
3. Substring Slice: Slices active string `currentPhrase.slice(0, charIndex)`.
4. Blinking Cursor: CSS animation with `steps(1)` opacity toggle to prevent sub-pixel blurring.""",
        "modularity": "Decompose into `TextType.tsx` (<120 LoC), `useTypewriter.ts` (<110 LoC), and `typewriterStyles.ts` (<50 LoC)."
    },
    {
        "id": "shuffle",
        "name": "Shuffle",
        "category": "Text Animations",
        "overview": "Shuffle generates dynamic random character permutation cascades where glyphs rapidly scramble through alphanumeric characters and symbols before sequentially locking into the final target string.",
        "props": """interface ShuffleProps {
  /** Target text to resolve to */
  text: string;
  /** Character set for scramble iterations (default: alphanumeric + symbols) */
  charset?: string;
  /** Total shuffle duration in milliseconds (default: 800) */
  duration?: number;
  /** Frame interval between glyph shuffles in milliseconds (default: 35) */
  interval?: number;
  /** Stagger delay across string length (default: true) */
  sequentialLock?: boolean;
  /** Trigger animation on hover (default: false) */
  triggerOnHover?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Total duration $T = 800\\text{ms}$. Scramble iterations update glyphs every $35\\text{ms}$. Character positions lock left-to-right from $t = 0.3T$ to $t = T$.",
        "math": """For character index $k \\in [0, N-1]$ in string of length $N$:
Lock timestamp:
$$t_{lock, k} = T_{start} + T_{total} \\cdot \\left(0.3 + 0.7 \\cdot \\frac{k}{N}\\right)$$
Displayed glyph $G_k(t)$:
$$G_k(t) = \\begin{cases} \\text{charset}[\\text{randInt}(|\\text{charset}|)] & \\text{if } t < t_{lock, k} \\\\ \\text{text}[k] & \\text{if } t \\ge t_{lock, k} \\end{cases}$$""",
        "interaction": "Re-shuffles on cursor hover or on programmatic prop updates. Screen readers receive the static final text immediately via `aria-label`.",
        "implementation": """1. Scramble Engine: Single interval or `requestAnimationFrame` loop maintaining random glyph buffer array.
2. Progressive Resolution: Iterate indices and lock resolved characters in-place.
3. Charset Presets: Support matrix, hexadecimal, alphabetic, and symbolic glyph sets.
4. Zero Layout Shift: Monospace font styling or fixed character widths (`ch` units).""",
        "modularity": "Organized into `Shuffle.tsx` (<120 LoC), `useShuffleScramble.ts` (<90 LoC), and `shuffleCharsets.ts` (<60 LoC)."
    },
    {
        "id": "shiny-text",
        "name": "Shiny Text",
        "category": "Text Animations",
        "overview": "Shiny Text sweeps a luminous metallic or holographic reflective light beam across typography using CSS background gradient masks, linear keyframe translation, and dynamic shine speed.",
        "props": """interface ShinyTextProps {
  /** Text content */
  text: string;
  /** Base text color */
  baseColor?: string;
  /** Highlight sheen color (default: '#ffffff') */
  shineColor?: string;
  /** Duration of shine sweep in seconds (default: 3s) */
  speed?: number;
  /** Width of the shine beam in percentage (default: 35%) */
  shineWidth?: number;
  /** Angle of shine beam in degrees (default: 120deg) */
  angle?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous shine beam traverses across text with period $T = 3.0\\text{s}$ using `linear` or `ease-in-out` timing curve.",
        "math": """CSS linear gradient definition:
$$\\text{background} = \\text{linear-gradient}(\\theta\\text{deg}, C_{base} \\ 0\\%, C_{base} \\ (p - W/2)\\%, C_{shine} \\ p\\%, C_{base} \\ (p + W/2)\\%, C_{base} \\ 100\\%)$$
where $p(t) = (t \\bmod T) / T \\cdot 200\\% - 50\\%$ and $W$ is sheen width.
CSS background-size:
$$\\text{background-size: } 250\\% \\ 100\\%$$
$$\\text{background-position: } x(t) = 100\\% \\to -100\\%$$""",
        "interaction": "Speed accelerates or triggers an instant sheen sweep on cursor hover.",
        "implementation": """1. Text Clipping: Apply `background-clip: text; -webkit-background-clip: text; color: transparent`.
2. Hardware Acceleration: CSS `@keyframes shine` modifying `background-position` with `transform: translateZ(0)`.
3. Color Interpolation: Build multi-stop linear gradient using Tailwind or inline CSS variables.
4. Fallback: Renders solid text color if `background-clip: text` is not supported.""",
        "modularity": "Decompose into `ShinyText.tsx` (<110 LoC) and `shinyStyles.ts` (<60 LoC)."
    },
    {
        "id": "text-pressure",
        "name": "Text Pressure",
        "category": "Text Animations",
        "overview": "Text Pressure dynamically alters variable font axes (weight `wght`, width `wdth`, optical size `opsz`, and slant `slnt`) based on cursor proximity, pointer velocity, or click compression.",
        "props": """interface TextPressureProps {
  /** Text content */
  text: string;
  /** Variable font family supporting wght/wdth axes */
  fontFamily?: string;
  /** Minimum and maximum font weight [min, max] (default: [100, 900]) */
  weightRange?: [number, number];
  /** Minimum and maximum font width [min, max] (default: [75, 125]) */
  widthRange?: [number, number];
  /** Cursor influence radius in pixels (default: 200) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Variable font axes interpolate per-frame at 60/120 FPS via critically damped spring ($16\\text{ms}$ update).",
        "math": """For character $i$ at position $(x_i, y_i)$ and cursor $(x_c, y_c)$:
Euclidean distance:
$$d_i = \\sqrt{(x_i - x_c)^2 + (y_i - y_c)^2}$$
Normalized proximity factor $P_i \\in [0, 1]$:
$$P_i = \\text{clamp}\\left(1 - \\frac{d_i}{R}, 0, 1\\right)$$
Variable font weight calculation:
$$\\text{wght}_i = W_{min} + P_i \\cdot (W_{max} - W_{min})$$
$$\\text{wdth}_i = Wd_{min} + P_i \\cdot (Wd_{max} - Wd_{min})$$
CSS property: `font-variation-settings: 'wght' wght_i, 'wdth' wdth_i;`""",
        "interaction": "Tracks cursor position over container. Compresses adjacent letters when mouse button is pressed.",
        "implementation": """1. Character Spans: Render each character in a separate `span` with cached bounding rectangle.
2. Font Variation Settings: Update `style.fontVariationSettings` per character inside RAF loop.
3. Variable Font Loader: Ensure variable font with `fvar` table is preloaded.
4. Performance: Batch DOM style updates to avoid layout reflows.""",
        "modularity": "Organized into `TextPressure.tsx` (<130 LoC), `useFontPressure.ts` (<100 LoC), and `fontVariationUtils.ts` (<60 LoC)."
    },
    {
        "id": "curved-loop",
        "name": "Curved Loop",
        "category": "Text Animations",
        "overview": "Curved Loop moves continuous text strings along complex sinusoidal curves, infinity symbols, or custom SVG spline paths in an endless flowing marquee ribbon.",
        "props": """interface CurvedLoopProps {
  /** Text string to repeat along curve */
  text: string;
  /** SVG path d string defining the curve */
  pathD?: string;
  /** Animation speed in pixels per second (default: 50) */
  speed?: number;
  /** Repeat count of text string along curve (default: 4) */
  repeatCount?: number;
  /** Invert motion direction (default: false) */
  reverse?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous marquee offset progresses infinitely. Speed $V = 50\\text{px/s}$ translates `startOffset` across SVG path length $L$.",
        "math": """For total path length $L = \\text{path.getTotalLength()}$:
Normalized path offset:
$$\\text{startOffset}(t) = (t \\cdot V) \\bmod L$$
Local coordinates $(x(s), y(s))$ and normal vector $\\vec{n}(s)$ at arc length $s$:
$$\\vec{t}(s) = \\frac{d\\vec{r}}{ds}, \\quad \\vec{n}(s) = (-t_y(s), t_x(s))$$""",
        "interaction": "Pause or accelerate loop speed on hover. Dragging scrubs offset forward or backward.",
        "implementation": """1. SVG textPath: Bind `<textPath href=\"#curved-path\" startOffset=\"...\">`.
2. Offset Loop: Update `startOffset` attribute in `requestAnimationFrame` loop.
3. String Concatenation: Repeat string with bullet separators to cover $2 \\times L$.
4. Path Cache: Pre-measure path length once on mount and window resize.""",
        "modularity": "Decompose into `CurvedLoop.tsx` (<120 LoC), `useCurvedPath.ts` (<80 LoC), and `curvePresets.ts` (<60 LoC)."
    },
    {
        "id": "fuzzy-text",
        "name": "Fuzzy Text",
        "category": "Text Animations",
        "overview": "Fuzzy Text simulates analog CRT static, fuzzy neon vibration, and chromatic dispersion using canvas noise displacement maps and particle jitter.",
        "props": """interface FuzzyTextProps {
  /** Text content */
  text: string;
  /** Noise jitter intensity in pixels (default: 3) */
  fuzziness?: number;
  /** Font size in pixels (default: 64) */
  fontSize?: number;
  /** Font family (default: 'sans-serif') */
  fontFamily?: string;
  /** Text color (default: '#ffffff') */
  color?: string;
  /** Enable chromatic RGB channel splitting (default: true) */
  chromaticAberration?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Noise field re-evaluates at 30/60 FPS with stochastic displacement $\\delta \\sim N(0, \\sigma^2)$.",
        "math": """Displacement vector for pixel coordinate $(x, y)$:
$$\\Delta x = \\text{fuzziness} \\cdot (2 \\cdot \\text{noise}(x, y, t) - 1)$$
$$\\Delta y = \\text{fuzziness} \\cdot (2 \\cdot \\text{noise}(x + 100, y + 100, t) - 1)$$
Chromatic dispersion:
$$R(x, y) = I(x + \\Delta x + \\delta_r, y + \\Delta y)$$
$$G(x, y) = I(x + \\Delta x, y + \\Delta y)$$
$$B(x, y) = I(x + \\Delta x - \\delta_b, y + \\Delta y)$$""",
        "interaction": "Fuzziness increases dramatically when pointer approaches or hovers over text.",
        "implementation": """1. Offscreen Canvas: Draw sharp text on offscreen 2D canvas buffer.
2. Pixel Manipulation: Iterate `ImageData.data` buffer and apply stochastic displacement to RGB channels.
3. Blit: Draw modified pixel buffer to main canvas using `ctx.putImageData()`.
4. Throttle: Limit render tick to 30 FPS for authentic retro CRT feel.""",
        "modularity": "Organized into `FuzzyText.tsx` (<120 LoC), `noiseEngine.ts` (<100 LoC), and `fuzzyCanvas.ts` (<80 LoC)."
    },
    {
        "id": "gradient-text",
        "name": "Gradient Text",
        "category": "Text Animations",
        "overview": "Gradient Text applies vibrant multi-stop linear or conic gradients to text glyphs, animating gradient angle rotation, color stop oscillation, and pulsing glow effects.",
        "props": """interface GradientTextProps {
  /** Text content */
  text: string;
  /** Array of CSS color stops (e.g. ['#ff007a', '#7928ca', '#4338ca']) */
  colors?: string[];
  /** Animation duration for full gradient rotation in seconds (default: 6s) */
  duration?: number;
  /** Gradient animation mode (default: 'linear-shift') */
  mode?: 'linear-shift' | 'conic-spin' | 'pulse';
  /** Optional drop-shadow glow behind text (default: false) */
  glow?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Gradient translation rotates infinitely over period $T = 6.0\\text{s}$ using smooth linear or sine keyframes.",
        "math": """For animated linear gradient angle $\\theta(t)$:
$$\\theta(t) = \\theta_0 + 360^\\circ \\cdot \\left(\\frac{t \\bmod T}{T}\\right)$$
Linear gradient color mapping:
$$\\text{background} = \\text{linear-gradient}(\\theta(t), c_1 \\ 0\\%, c_2 \\ 50\\%, c_3 \\ 100\\%)$$
Glow drop shadow:
$$\\text{filter: drop-shadow}(0\\text{px } 0\\text{px } 15\\text{px } c_{active})$$""",
        "interaction": "Pointers accelerate gradient rotation speed or shift color hue toward cursor angle.",
        "implementation": """1. CSS Background Clip: `background-clip: text; -webkit-background-clip: text; color: transparent`.
2. CSS Variable Animation: Animate `--gradient-angle` or `background-position` with `@property`.
3. Glow Layer: Duplicate text element with `blur(16px)` and reduced opacity for neon bloom.
4. Zero Dependency: Pure Tailwind CSS classes and CSS custom properties.""",
        "modularity": "Decompose into `GradientText.tsx` (<100 LoC) and `gradientPresets.ts` (<60 LoC)."
    },
    {
        "id": "falling-text",
        "name": "Falling Text",
        "category": "Text Animations",
        "overview": "Falling Text simulates rigid-body physics where individual characters detach from their baseline, accelerate downward under gravity, collide with ground/walls, and bounce with angular momentum.",
        "props": """interface FallingTextProps {
  /** Text string whose characters fall and collide */
  text: string;
  /** Gravity acceleration in pixels/sec^2 (default: 980) */
  gravity?: number;
  /** Coefficient of restitution / bounciness [0..1] (default: 0.6) */
  restitution?: number;
  /** Trigger mode (default: 'click') */
  trigger?: 'click' | 'hover' | 'mount' | 'scroll';
  /** Floor boundary height in pixels (default: container height) */
  floorY?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Physics simulation runs at 60 FPS until all character bodies reach rest kinetic energy ($E_k < \\epsilon$, $\\approx 1.8\\text{s}$).",
        "math": """For character $i$ with position $(x_i, y_i)$, velocity $(v_{x,i}, v_{y,i})$, and angle $\\theta_i$:
1. Gravity Acceleration:
   $$v_{y,i}(t + \\Delta t) = v_{y,i}(t) + g \\cdot \\Delta t$$
   $$y_i(t + \\Delta t) = y_i(t) + v_{y,i}(t + \\Delta t) \\cdot \\Delta t$$
2. Floor Collision ($y_i \\ge Y_{floor}$):
   $$y_i = Y_{floor}, \\quad v_{y,i} = -e \\cdot v_{y,i}$$
   $$v_{x,i} = v_{x,i} \\cdot \\mu_{friction}, \\quad \\omega_i = \\omega_i \\cdot 0.8$$
3. Rotational Orientation:
   $$\\theta_i(t + \\Delta t) = \\theta_i(t) + \\omega_i \\cdot \\Delta t$$""",
        "interaction": "Clicking or hovering triggers physics release. Users can drag individual fallen letters with pointer.",
        "implementation": """1. Character Extraction: Measure baseline positions of each character before detaching into absolute coordinates.
2. Physics Engine: Run 2D Verlet or Euler integration loop in `requestAnimationFrame`.
3. Transform Updates: Apply `transform: translate3d(x, y, 0) rotate(theta)` to individual character spans.
4. Rest State: Freeze RAF when all letters settle to avoid background battery drain.""",
        "modularity": "Organized into `FallingText.tsx` (<120 LoC), `PhysicsWorld.ts` (<150 LoC), and `bodyTypes.ts` (<50 LoC)."
    },
    {
        "id": "text-cursor",
        "name": "Text Cursor",
        "category": "Text Animations",
        "overview": "Text Cursor renders custom dynamic typography directly attached to the mouse pointer, displaying contextual labels, trailing status badges, or rotating text rings following pointer velocity.",
        "props": """interface TextCursorProps {
  /** Text string displayed inside floating cursor badge */
  text: string;
  /** Lag smoothing factor [0..1] (default: 0.18) */
  smoothing?: number;
  /** Cursor badge background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Hide native system cursor (default: true) */
  hideNativeCursor?: boolean;
  /** Scale factor on hoverable elements (default: 1.5) */
  hoverScale?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Pointer follower executes at 60/120 FPS with exponential lerp response lag $\\Delta t \\approx 16\\text{ms}$. Scale transition on interactive hover is $200\\text{ms}$ `ease-out`.",
        "math": """Cursor coordinates $(x_t, y_t)$ smoothed via lerp:
$$x(t) = x(t-1) + \\alpha \\cdot (x_{mouse} - x(t-1))$$
$$y(t) = y(t-1) + \\alpha \\cdot (y_{mouse} - y(t-1))$$
Velocity vector for tilt/squash distortion:
$$v_x = x(t) - x(t-1), \\quad v_y = y(t) - y(t-1)$$
$$\\text{tiltAngle} = \\arctan2(v_y, v_x)$$
$$\\text{scaleX} = 1 + \\min\\left(\\frac{\\|\\vec{v}\\|}{50}, 0.4\\right), \\quad \\text{scaleY} = 1 - \\min\\left(\\frac{\\|\\vec{v}\\|}{100}, 0.2\\right)$$""",
        "interaction": "Follows pointer globally. Automatically detects hovering over `<a>`, `<button>`, or `[data-cursor]` to swap text label or expand scale.",
        "implementation": """1. Global Event Listener: Attach `pointermove` to `window` and store coordinates in mutable refs.
2. Portal Overlay: Render fixed overlay with `pointer-events: none; z-index: 9999`.
3. WAAPI / Transforms: Update cursor badge `transform: translate3d(x, y, 0)` on composite thread.
4. Touch Device Guard: Automatically hide text cursor on touch/mobile devices via `@media (hover: hover)`.""",
        "modularity": "Decompose into `TextCursor.tsx` (<120 LoC), `usePointerVelocity.ts` (<90 LoC), and `cursorStyles.ts` (<50 LoC)."
    },
    {
        "id": "decrypted-text",
        "name": "Decrypted Text",
        "category": "Text Animations",
        "overview": "Decrypted Text simulates cyberpunk cryptographic decryption where characters rapidly scramble through randomized glyph sets, progressively revealing and locking into plaintext characters.",
        "props": """interface DecryptedTextProps {
  /** The plaintext string to decrypt and reveal */
  text: string;
  /** Speed of glyph change interval in milliseconds (default: 50) */
  speed?: number;
  /** Maximum number of scramble iterations per character (default: 10) */
  maxIterations?: number;
  /** Characters used during scrambling (default: '0123456789ABCDEF!@#$%^&*') */
  characters?: string;
  /** Decryption reveal direction (default: 'forward') */
  revealDirection?: 'forward' | 'backward' | 'center' | 'random';
  /** Trigger animation on hover or view entry (default: 'hover') */
  animateOn?: 'hover' | 'view';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Total decryption takes $600\\text{ms}$ to $1200\\text{ms}$. Scramble glyphs cycle at $50\\text{ms}$ intervals with sequential locking every $40\\text{ms}$.",
        "math": """For character index $k$ in string of length $L$:
Reveal index mapping for direction 'forward':
$$r_k = k$$
Lock iteration count:
$$N_{lock, k} = \\text{maxIterations} + k \\cdot 2$$
Current glyph $C_k(i)$ at iteration step $i$:
$$C_k(i) = \\begin{cases} \\text{charset}[\\text{randInt}(|\\text{charset}|)] & \\text{if } i < N_{lock, k} \\\\ \\text{text}[k] & \\text{if } i \\ge N_{lock, k} \\end{cases}$$""",
        "interaction": "Triggers decryption on hover or scroll view entry. Accessible text is preserved for screen readers via `aria-label`.",
        "implementation": """1. Scramble Loop: Driven by `setInterval` or `requestAnimationFrame` with timestamp delta.
2. Character Array: Store state array of active characters and their lock statuses.
3. Monospace Alignment: Use `font-mono` or tabular figures to eliminate horizontal jitter.
4. Cleanup: Clear active timer handles on unmount or re-trigger.""",
        "modularity": "Organized into `DecryptedText.tsx` (<120 LoC), `useDecryption.ts` (<100 LoC), and `decryptionCharsets.ts` (<50 LoC)."
    },
    {
        "id": "true-focus",
        "name": "True Focus",
        "category": "Text Animations",
        "overview": "True Focus creates a camera depth-of-field focus effect where active or hovered words/phrases remain sharp and brightly illuminated while surrounding text falls into a soft Gaussian blur.",
        "props": """interface TrueFocusProps {
  /** Array of words or sentence to display */
  sentence: string;
  /** Blur radius for out-of-focus words in pixels (default: 5) */
  blurAmount?: number;
  /** Border color of the animated focus frame (default: '#00df8f') */
  borderColor?: string;
  /** Glow color behind focused word (default: 'rgba(0, 223, 143, 0.3)') */
  glowColor?: string;
  /** Transition duration between focus targets in seconds (default: 0.5) */
  animationDuration?: number;
  /** Pause duration on each word in auto mode (default: 2000ms) */
  pauseBetweenAnimations?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Focus box transitions between target words over $500\\text{ms}$ with `cubic-bezier(0.25, 1, 0.5, 1)`. Non-focused words blur over $350\\text{ms}$.",
        "math": """Focus bounding box interpolation $(x(t), y(t), w(t), h(t))$:
$$x(t) = \\text{lerp}(x_0, x_1, f(\\tau)), \\quad w(t) = \\text{lerp}(w_0, w_1, f(\\tau))$$
where $f(\\tau) = 1 - (1 - \\tau)^3$.
Word blur and opacity functions:
$$\\text{filter: blur}(\\text{if focus then } 0\\text{px else } B\\text{px})$$
$$\\text{opacity: if focus then } 1.0\\text{ else } 0.45$$""",
        "interaction": "Hovering over any word snaps focus box directly to that word. Auto-cycles sequentially when idle.",
        "implementation": """1. Word Measurements: Measure DOM rects of each word span via `getBoundingClientRect()`.
2. Absolute Focus Box: Render floating border frame with SVG corners and `transition: transform, width, height`.
3. Filter Transitions: Apply `filter: blur(...)` to sibling word spans via CSS classes.
4. Auto Cycle: Interval switches `focusedIndex = (focusedIndex + 1) % words.length` when pointer is not hovering.""",
        "modularity": "Decompose into `TrueFocus.tsx` (<130 LoC), `FocusBox.tsx` (<80 LoC), and `useFocusTracker.ts` (<80 LoC)."
    },
    {
        "id": "scroll-float",
        "name": "Scroll Float",
        "category": "Text Animations",
        "overview": "Scroll Float animates text characters floating upwards into place with buoyant parallax, soft scaling, and inertia based on viewport scroll progress and velocity.",
        "props": """interface ScrollFloatProps {
  /** Text content */
  text: string;
  /** Float travel distance in pixels (default: 80) */
  distance?: number;
  /** Stagger delay between sequential characters in milliseconds (default: 25) */
  stagger?: number;
  /** Spring stiffness coefficient k (default: 120) */
  stiffness?: number;
  /** Damping coefficient c (default: 14) */
  damping?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Spring settling duration $\\approx 600\\text{ms}$ with critically damped response to scroll velocity changes.",
        "math": """Scroll progress $p \\in [0, 1]$ relative to viewport entry:
$$p = \\text{clamp}\\left(\\frac{Y_{scroll} + H_{view} - Y_{top}}{H_{view} + H_{elem}}, 0, 1\\right)$$
For character $i$:
$$y_i(p) = \\text{distance} \\cdot (1 - p)^{1.5} \\cdot \\left(1 + i \\cdot 0.05\\right)$$
$$\\alpha_i(p) = \\text{clamp}(p \\cdot 2 - i \\cdot 0.02, 0, 1)$$
$$\\text{rotate}_i(p) = (1 - p) \\cdot (-1)^i \\cdot 8^\\circ$$""",
        "interaction": "Binds to window scroll events via passive listener or `useScroll` hook. Reacts with extra bounce to high-velocity scrolling.",
        "implementation": """1. Character Mapping: Render character spans with `display: inline-block; will-change: transform, opacity`.
2. Scroll Listener: Compute scroll progress in `requestAnimationFrame` to avoid main thread jank.
3. Spring Physics: Smooth character transforms via spring accumulator.
4. Intersection Guard: Deactivate scroll calculation when element is outside viewport.""",
        "modularity": "Organized into `ScrollFloat.tsx` (<120 LoC), `useScrollProgress.ts` (<90 LoC), and `floatSprings.ts` (<60 LoC)."
    },
    {
        "id": "scroll-reveal",
        "name": "Scroll Reveal",
        "category": "Text Animations",
        "overview": "Scroll Reveal exposes paragraphs, sentences, or characters word-by-word synchronously tied to window scroll depth using opacity masking and wipe thresholds.",
        "props": """interface ScrollRevealProps {
  /** Text or React children to reveal on scroll */
  children: string;
  /** Reveal granularity (default: 'words') */
  mode?: 'words' | 'characters' | 'lines';
  /** Inactive base opacity (default: 0.15) */
  baseOpacity?: number;
  /** Active revealed opacity (default: 1.0) */
  activeOpacity?: number;
  /** Scroll trigger start offset from bottom of viewport (default: '80%') */
  startOffset?: string;
  /** Scroll trigger end offset (default: '20%') */
  endOffset?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Scroll-coupled continuous mapping. Progress smoothly updates per scroll pixel without fixed time duration.",
        "math": """For $N$ words and container scroll progress $P \\in [0, 1]$:
Word $k \\in [0, N-1]$ activation threshold:
$$t_k = \\frac{k}{N}, \\quad w_k = \\frac{1}{N}$$
Word reveal progress $p_k \\in [0, 1]$:
$$p_k = \\text{clamp}\\left(\\frac{P - t_k}{w_k}, 0, 1\\right)$$
Word opacity and color:
$$\\alpha_k = \\alpha_{base} + p_k \\cdot (\\alpha_{active} - \\alpha_{base})$$""",
        "interaction": "Directly linked to user scroll position. Scrolling up reverses reveal state predictably.",
        "implementation": """1. Word Span Wrapping: Split text into word spans with inline styles.
2. Scroll Tracking: Calculate element bounding client rect relative to window inner height.
3. CSS Custom Properties: Assign `--word-progress` to dynamically tint text.
4. Performance: Passive scroll event listener with `requestAnimationFrame` debounce.""",
        "modularity": "Decompose into `ScrollReveal.tsx` (<120 LoC), `useScrollReveal.ts` (<90 LoC), and `revealUtils.ts` (<50 LoC)."
    },
    {
        "id": "ascii-text",
        "name": "ASCII Text",
        "category": "Text Animations",
        "overview": "ASCII Text rasterizes text or vector shapes into an animated monospace ASCII character density matrix, mapping pixel luminance to character glyph palettes in real-time.",
        "props": """interface AsciiTextProps {
  /** Text to render in ASCII art */
  text: string;
  /** ASCII character density palette (default: ' .:-=+*#%@') */
  charset?: string;
  /** Font size in pixels (default: 12) */
  fontSize?: number;
  /** Monospace font family (default: 'monospace') */
  fontFamily?: string;
  /** Color of ASCII characters */
  color?: string;
  /** Animate wave or glitch distortions (default: true) */
  animated?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "ASCII frame updates at 30 FPS. Wave distortion phase progresses continuously with period $T = 2.0\\text{s}$.",
        "math": """For offscreen canvas pixel $(x, y)$ with luminance $Y$:
$$Y(x, y) = 0.299R + 0.587G + 0.114B$$
Wave perturbation:
$$Y'(x, y, t) = Y(x, y) \\cdot (1 + 0.3 \\cdot \\sin(0.1x + 0.1y + 2\\pi t / T))$$
ASCII character index:
$$idx = \\left\\lfloor \\frac{Y'(x, y, t)}{255} \\cdot (|\\text{charset}| - 1) \\right\\rfloor$$
$$\\text{glyph} = \\text{charset}[idx]$$""",
        "interaction": "Mouse cursor creates ripple distortions in ASCII luminance field.",
        "implementation": """1. Offscreen Render: Draw source text onto low-resolution offscreen canvas (e.g. $80 \\times 24$ pixels).
2. Luminance Scan: Read `ctx.getImageData()` pixels and map luminance values to ASCII characters.
3. Matrix Output: Format character lines into `<pre>` tag or render via monospace canvas text.
4. Animation Loop: Apply wave math to luminance values before character lookup.""",
        "modularity": "Organized into `AsciiText.tsx` (<130 LoC), `asciiConverter.ts` (<100 LoC), and `asciiCharsets.ts` (<50 LoC)."
    },
    {
        "id": "scrambled-text",
        "name": "Scrambled Text",
        "category": "Text Animations",
        "overview": "Scrambled Text creates an interactive hacker text decipher effect that scrambles character glyphs upon hover or click before restoring the original string with staggered resolve.",
        "props": """interface ScrambledTextProps {
  /** Original text string */
  text: string;
  /** Character pool used for scrambling */
  scrambleChars?: string;
  /** Delay before scrambling settles in milliseconds (default: 600) */
  duration?: number;
  /** Scramble change speed in milliseconds (default: 40) */
  speed?: number;
  /** Trigger mode (default: 'hover') */
  trigger?: 'hover' | 'click' | 'auto';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Scramble animation runs for $600\\text{ms}$ total with character substitutions every $40\\text{ms}$. Resolves progressively over final $300\\text{ms}$.",
        "math": """For index $i$ in string:
Resolution progress $\\tau(t) = \\frac{t - t_0}{T}$:
$$\\text{isResolved}(i, t) = \\tau(t) > \\left(\\frac{i}{N}\\right)^{1.2}$$
$$\\text{char}_i(t) = \\begin{cases} \\text{text}[i] & \\text{if isResolved}(i, t) \\\\ \\text{scrambleChars}[\\text{randInt}(M)] & \\text{otherwise} \\end{cases}$$""",
        "interaction": "Hovering triggers instant scramble burst. Supports keyboard focus trigger.",
        "implementation": """1. State Hook: Manage active text state string.
2. RAF Timer: Update scrambler state using timestamp delta logic.
3. Preserved Spacing: Keep whitespace and punctuation stable during scramble.
4. Accessibility: Maintain original text in hidden ARIA node for screen reader clarity.""",
        "modularity": "Decompose into `ScrambledText.tsx` (<110 LoC) and `useScrambleEffect.ts` (<90 LoC)."
    },
    {
        "id": "rotating-text",
        "name": "Rotating Text",
        "category": "Text Animations",
        "overview": "Rotating Text flips words along 3D cube axes or vertical cylindrical rolls, smoothly adapting wrapper width and height to prevent adjacent layout shifts.",
        "props": """interface RotatingTextProps {
  /** Array of rotating words or phrases */
  words: string[];
  /** Display duration per word in milliseconds (default: 2500) */
  interval?: number;
  /** Flip transition duration in milliseconds (default: 600) */
  transitionDuration?: number;
  /** 3D rotation axis (default: 'X') */
  rotationAxis?: 'X' | 'Y';
  /** 3D perspective in pixels (default: 800) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Each word flip executes over $600\\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)` with a $2500\\text{ms}$ stationary dwell.",
        "math": """Rotation angle $\\theta(\\tau)$ for normalized step $\\tau \\in [0, 1]$:
$$\\theta(\\tau) = 90^\\circ \\cdot (1 - f(\\tau))$$
where $f(\\tau) = 1 - (1 - \\tau)^3$.
Outgoing face:
$$\\text{transform: rotateX}(\\theta - 90^\\circ) \\text{ translateZ}(H/2)$$
Incoming face:
$$\\text{transform: rotateX}(\\theta) \\text{ translateZ}(H/2)$$""",
        "interaction": "Pauses on pointer hover. Supports manual next/prev cycling via arrow keys.",
        "implementation": """1. 3D Cube Container: Relative box with `perspective: 800px; transform-style: preserve-3d`.
2. Dynamic Width: Animate container width via `ResizeObserver` or measured word bounding boxes.
3. CSS 3D Transforms: Apply `rotateX` / `rotateY` with `translateZ` half-depth offset.
4. Motion Safety: Uses simple vertical slide if 3D transforms are reduced.""",
        "modularity": "Organized into `RotatingText.tsx` (<120 LoC), `useRotatingWords.ts` (<80 LoC), and `rotatingStyles.ts` (<50 LoC)."
    },
    {
        "id": "glitch-text",
        "name": "Glitch Text",
        "category": "Text Animations",
        "overview": "Glitch Text creates cyberpunk digital distortion with chromatic RGB channel separation, horizontal slice displacement keyframes (`clip-path: inset()`), and sporadic noise pulses.",
        "props": """interface GlitchTextProps {
  /** Text content */
  text: string;
  /** Glitch effect intensity scale (default: 1.0) */
  intensity?: number;
  /** Trigger mode (default: 'continuous') */
  mode?: 'continuous' | 'hover' | 'sporadic';
  /** Primary RGB split colors (default: ['#ff0055', '#00ffff']) */
  splitColors?: [string, string];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Glitch bursts occur sporadically every $2\\text{s}$ to $4\\text{s}$ for a duration of $200\\text{ms}$ to $400\\text{ms}$. Slice keyframes update at 20 FPS.",
        "math": """RGB channel displacement vectors:
$$\\vec{d}_{red} = (-2 \\cdot \\text{intensity}, 0)\\text{px}, \\quad \\vec{d}_{cyan} = (2 \\cdot \\text{intensity}, 0)\\text{px}$$
Random horizontal slice clip-path for slice $k$:
$$\\text{clip-path: inset}(y_k\\% \\ 0 \\ (100 - y_k - h_k)\\% \\ 0)$$
where $y_k = \\text{rand}(0, 100)$, $h_k = \\text{rand}(5, 25)$.
Jitter transform:
$$\\Delta x = \\text{rand}(-4, 4) \\cdot \\text{intensity}\\text{px}$$""",
        "interaction": "Triggers high-intensity glitch burst on mouse enter or click.",
        "implementation": """1. Triple Layer Stack: Render base text layer plus two pseudo-elements/spans with `mix-blend-mode: screen`.
2. Dynamic Clip Paths: Generate random slice clip paths in CSS `@keyframes glitch-anim`.
3. Sporadic Scheduler: Use randomized `setTimeout` to fire glitch bursts intermittently.
4. Accessible DOM: Screen readers read only single primary layer (`aria-hidden` on clones).""",
        "modularity": "Decompose into `GlitchText.tsx` (<120 LoC), `useGlitchLoop.ts` (<90 LoC), and `glitchStyles.ts` (<60 LoC)."
    },
    {
        "id": "scroll-velocity",
        "name": "Scroll Velocity",
        "category": "Text Animations",
        "overview": "Scroll Velocity powers high-speed bidirectional marquee ribbons whose horizontal translation velocity scales proportionally with window scrolling speed and direction.",
        "props": """interface ScrollVelocityProps {
  /** Text content repeated in marquee */
  text: string;
  /** Base translation velocity in pixels/second (default: 100) */
  baseVelocity?: number;
  /** Scroll acceleration multiplier (default: 5.0) */
  scrollMultiplier?: number;
  /** Number of text repetitions for seamless loop (default: 4) */
  numCopies?: number;
  /** Invert scroll direction influence (default: false) */
  reverse?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Velocity responds instantaneously to scroll events ($<16\\text{ms}$) and decays back to base velocity over $600\\text{ms}$ via exponential friction.",
        "math": """Horizontal translation velocity $V(t)$:
$$V(t) = V_{base} + M \\cdot V_{scroll}(t)$$
where $V_{scroll}(t) = \\frac{\\Delta Y_{scroll}}{\\Delta t}$.
Velocity smoothing via exponential decay:
$$V_{smooth}(t) = V_{smooth}(t-1) + \\alpha \\cdot (V(t) - V_{smooth}(t-1))$$
Marquee offset:
$$X(t) = (X(t-1) + V_{smooth}(t) \\cdot \\Delta t) \\bmod L_{content}$$""",
        "interaction": "Scrolling down accelerates marquee to the right/left; scrolling up reverses direction.",
        "implementation": """1. Dual Track Marquee: Render duplicated content ribbons inside `overflow-hidden` container.
2. Scroll Velocity Tracker: Measure scroll deltas using passive window scroll listener.
3. Transform Loop: Update `transform: translate3d(x, 0, 0)` in `requestAnimationFrame`.
4. Wrap-Around Math: Reset offset seamlessly when $X > L_{copy}$ to maintain infinite loop.""",
        "modularity": "Organized into `ScrollVelocity.tsx` (<130 LoC), `useScrollVelocity.ts` (<100 LoC), and `velocityMath.ts` (<50 LoC)."
    },
    {
        "id": "variable-proximity",
        "name": "Variable Proximity",
        "category": "Text Animations",
        "overview": "Variable Proximity dynamically modulates variable font weight, optical size, slant, and letter spacing based on Euclidean distance to the mouse pointer.",
        "props": """interface VariableProximityProps {
  /** Text content */
  text: string;
  /** Target variable font family */
  fontFamily?: string;
  /** Radius of pointer influence in pixels (default: 180) */
  radius?: number;
  /** Min and max font weight range (default: [200, 800]) */
  weightRange?: [number, number];
  /** Min and max slant range in degrees (default: [-10, 10]) */
  slantRange?: [number, number];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Variable font axes update smoothly at 60/120 FPS with zero noticeable frame lag.",
        "math": """For character $k$ at center $(x_k, y_k)$ and pointer $(x_c, y_c)$:
$$d_k = \\sqrt{(x_k - x_c)^2 + (y_k - y_c)^2}$$
Normalized proximity factor:
$$p_k = \\max\\left(0, 1 - \\frac{d_k}{R}\\right)$$
Gaussian falloff alternative:
$$p_k = \\exp\\left(-\\frac{d_k^2}{2\\sigma^2}\\right)$$
Font variation settings:
$$\\text{wght}_k = W_{min} + p_k \\cdot (W_{max} - W_{min})$$
$$\\text{slnt}_k = S_{min} + p_k \\cdot (S_{max} - S_{min})$$""",
        "interaction": "Mouse hover creates dynamic wave of typographic expansion and weight modulation.",
        "implementation": """1. Character Spans: Wrap each character in inline span and pre-calculate bounding boxes.
2. Pointer Coordinates: Track container mouse coordinates in RAF loop.
3. Font Variations: Write `font-variation-settings` directly to character style.
4. Debounce Resize: Re-measure character bounding boxes on window resize.""",
        "modularity": "Decompose into `VariableProximity.tsx` (<120 LoC), `useVariableProximity.ts` (<100 LoC), and `fontProximityMath.ts` (<60 LoC)."
    },
    {
        "id": "count-up",
        "name": "Count Up",
        "category": "Text Animations",
        "overview": "Count Up animates numeric values from start to target values using customizable easing curves, decimal precision, prefix/suffix labels, and localized number formatting.",
        "props": """interface CountUpProps {
  /** Target numeric end value */
  to: number;
  /** Starting numeric value (default: 0) */
  from?: number;
  /** Duration of counting animation in seconds (default: 2.0) */
  duration?: number;
  /** Number of decimal places to display (default: 0) */
  decimals?: number;
  /** Prefix string (e.g. '$', '+') */
  prefix?: string;
  /** Suffix string (e.g. '%', 'k', ' ATS') */
  suffix?: string;
  /** Easing function (default: 'easeOutExpo') */
  easing?: 'easeOutExpo' | 'easeOutQuad' | 'linear';
  /** Start counting automatically when visible in viewport (default: true) */
  startOnView?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback fired upon count completion */
  onComplete?: () => void;
}""",
        "timing": "Executes over duration $T = 2.0\\text{s}$ using exponential ease-out curve $f(\\tau) = 1 - 2^{-10\\tau}$.",
        "math": """For normalized time $\\tau = \\frac{t - t_0}{T} \\in [0, 1]$:
Exponential ease-out:
$$f(\\tau) = \\begin{cases} 1 & \\text{if } \\tau = 1 \\\\ 1 - 2^{-10\\tau} & \\text{otherwise} \\end{cases}$$
Current animated value:
$$V(\\tau) = \\text{from} + f(\\tau) \\cdot (\\text{to} - \\text{from})$$
Formatted output string:
$$S(\\tau) = \\text{prefix} + \\text{formatLocale}(V(\\tau), \\text{decimals}) + \\text{suffix}$$""",
        "interaction": "Scroll-triggered via IntersectionObserver. Re-animates smoothly when `to` prop changes.",
        "implementation": """1. Animation Driver: Driven by `requestAnimationFrame` with precise timestamp delta.
2. Number Formatting: Use `Intl.NumberFormat` for localized comma grouping and decimal separators.
3. Layout Stability: Apply `tabular-nums font-mono` to prevent width fluctuations during counting.
4. Reduced Motion: Jump directly to final number if `prefers-reduced-motion` is enabled.""",
        "modularity": "Organized into `CountUp.tsx` (<110 LoC), `useCountUp.ts` (<90 LoC), and `numberFormatters.ts` (<50 LoC)."
    }
]

def build_markdown(item):
    return f"""# {item['name']} ({item['category']})

## 1. Overview & Visual Behavior
{item['overview']}

## 2. Props & Configuration Interface
```typescript
{item['props']}
```

## 3. Animation Specifications & Timing
{item['timing']}

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
{item['math']}

## 5. Interaction Mechanics
{item['interaction']}

## 6. Implementation Guidance (Zero External Animation Bloat)
{item['implementation']}

## 7. Modularity & File Organization
{item['modularity']}
"""

for item in ITEMS:
    file_path = os.path.join(PROMPTS_DIR, f"{item['id']}.md")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(build_markdown(item))

print(f"Generated {len(ITEMS)} Text Animation prompts in {PROMPTS_DIR}")
