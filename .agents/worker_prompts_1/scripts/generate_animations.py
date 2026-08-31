import os

PROMPTS_DIR = r"c:\Projects\karma\prompts\animations"
os.makedirs(PROMPTS_DIR, exist_ok=True)

ITEMS = [
    {
        "id": "glow-cursor",
        "name": "Glow Cursor",
        "category": "Animations",
        "overview": "Glow Cursor renders an interactive radial luminance halo that smoothly trails the pointer, casting dynamic ambient lighting, backdrop blur, and specular highlights on hovered elements.",
        "props": r"""interface GlowCursorProps {
  /** Radius of glow circle in pixels (default: 300) */
  radius?: number;
  /** Primary glow color (default: 'rgba(99, 102, 241, 0.15)') */
  color?: string;
  /** Lag smoothing interpolation factor [0..1] (default: 0.15) */
  smoothing?: number;
  /** CSS mix-blend-mode (default: 'screen') */
  blendMode?: 'screen' | 'lighten' | 'overlay' | 'plus-lighter';
  /** Blur filter intensity in pixels (default: 40) */
  blur?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous pointer trailing with exponential low-pass filter ($\tau \approx 16\text{ms}$). Scale pulsing on click has $250\text{ms}$ elastic response.",
        "math": r"""Pointer coordinate smoothing via exponential lerp:
$$x(t) = x(t-1) + \alpha \cdot (x_{pointer} - x(t-1))$$
$$y(t) = y(t-1) + \alpha \cdot (y_{pointer} - y(t-1))$$
Radial luminance field:
$$I(r) = I_0 \cdot \exp\left(-\frac{r^2}{2\sigma^2}\right)$$
where $r = \sqrt{(x - x(t))^2 + (y - y(t))^2}$ and $\sigma = \text{radius} / 3$.""",
        "interaction": "Tracks pointer globally across window. Smoothly contracts radius on pointer down ($R \to 0.75 R$) and expands on element hover.",
        "implementation": r"""1. Fixed Overlay: Render fixed full-screen layer with `pointer-events: none; z-index: 50`.
2. Hardware Acceleration: Apply `transform: translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)`.
3. CSS Custom Properties: Direct update of `--x` and `--y` on RAF loop.
4. Mobile Disable: Automatically deactivates on touch screens via `@media (pointer: coarse)`.""",
        "modularity": "Organized into `GlowCursor.tsx` (<110 LoC), `usePointerLerp.ts` (<80 LoC), and `glowStyles.ts` (<50 LoC)."
    },
    {
        "id": "scroll-expand",
        "name": "Scroll Expand",
        "category": "Animations",
        "overview": "Scroll Expand animates card containers, image viewports, or video banners expanding from compact thumbnail pills to full-width expansive hero viewports as the user scrolls.",
        "props": r"""interface ScrollExpandProps {
  /** React children rendered inside expanding container */
  children: React.ReactNode;
  /** Initial width in pixels or percentage (default: '60%') */
  initialWidth?: string | number;
  /** Expanded target width (default: '100%') */
  targetWidth?: string | number;
  /** Initial border radius in pixels (default: 32) */
  initialBorderRadius?: number;
  /** Target expanded border radius (default: 0) */
  targetBorderRadius?: number;
  /** Scroll progress window [start, end] from 0 to 1 (default: [0.2, 0.8]) */
  scrollWindow?: [number, number];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous scroll-linked interpolation without fixed time durations. Spring smoothing parameter $\zeta = 0.9$ avoids jitter.",
        "math": r"""Container scroll progress $S \in [0, 1]$ mapped across window $[S_{start}, S_{end}]$:
$$p = \text{clamp}\left(\frac{S - S_{start}}{S_{end} - S_{start}}, 0, 1\right)$$
Curved expansion profile:
$$f(p) = 3p^2 - 2p^3 \quad (\text{smoothstep})$$
Dynamic properties:
$$W(p) = W_{init} + f(p) \cdot (W_{target} - W_{init})$$
$$R(p) = R_{init} + f(p) \cdot (R_{target} - R_{init})$$""",
        "interaction": "Directly proportional to page scroll depth. Maintains sticky pin positioning during expansion phase.",
        "implementation": r"""1. Sticky Container: Outer wrapper with `h-[200vh]` and inner `sticky top-0 h-screen flex items-center justify-center`.
2. Scroll Metrics: Measure container offset via `element.getBoundingClientRect().top`.
3. Transform & Clip: Adjust width, scale, and border-radius using CSS variables.
4. Layout Isolation: Content inside uses fixed aspect ratios to prevent reflows.""",
        "modularity": "Decompose into `ScrollExpand.tsx` (<120 LoC), `useScrollWindow.ts` (<90 LoC), and `expandStyles.ts` (<50 LoC)."
    },
    {
        "id": "ripple-distortion",
        "name": "Ripple Distortion",
        "category": "Animations",
        "overview": "Ripple Distortion applies interactive 2D water wave ripples and refractive distortion to underlying images or UI panels using Canvas 2D displacement maps or WebGL normal shaders.",
        "props": r"""interface RippleDistortionProps {
  /** Background image URL to apply ripple distortion to */
  imageSrc: string;
  /** Ripple propagation speed (default: 1.2) */
  speed?: number;
  /** Wave damping / decay factor (default: 0.96) */
  damping?: number;
  /** Refraction displacement intensity (default: 24) */
  refractionIntensity?: number;
  /** Trigger mode (default: 'pointer-move') */
  trigger?: 'pointer-move' | 'click' | 'interval';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Ripples propagate outward at $v = 150\text{px/s}$ and attenuate exponentially over $1200\text{ms}$.",
        "math": r"""2D discrete wave wave equation on grid $(x, y)$:
$$h(x, y, t + 1) = \left(\frac{h(x-1, y, t) + h(x+1, y, t) + h(x, y-1, t) + h(x, y+1, t)}{2} - h(x, y, t-1)\right) \cdot d$$
where $d \in [0.95, 0.99]$ is damping.
Refraction normal vectors:
$$N_x(x, y) = h(x+1, y) - h(x-1, y)$$
$$N_y(x, y) = h(x, y+1) - h(x, y-1)$$
Displaced texture lookup:
$$(u', v') = \left(u + N_x \cdot \frac{I}{W}, \ v + N_y \cdot \frac{I}{H}\right)$$""",
        "interaction": "Mouse movements and clicks inject energy impulses $h(x_{click}, y_{click}) = E_0$ into the height field.",
        "implementation": r"""1. Dual Buffer Grid: Maintain two `Int16Array` or `Float32Array` buffers for current and previous heightmaps.
2. Fast Kernel: Process wave propagation step in Web Worker or WebGL fragment shader.
3. Canvas Render: Sample source texture displaced by normal gradient.
4. Auto Sleep: Stop simulation loop when total energy $\sum |h| < \epsilon$.""",
        "modularity": "Organized into `RippleDistortion.tsx` (<120 LoC), `WaveGrid.ts` (<150 LoC), and `rippleShader.ts` (<70 LoC)."
    },
    {
        "id": "elastic-mesh",
        "name": "Elastic Mesh",
        "category": "Animations",
        "overview": "Elastic Mesh renders an interactive grid mesh of interconnected nodes and spring constraints that deform elastically under pointer drag and rebound with authentic harmonic oscillation.",
        "props": r"""interface ElasticMeshProps {
  /** Grid column count (default: 16) */
  columns?: number;
  /** Grid row count (default: 10) */
  rows?: number;
  /** Spring stiffness coefficient k (default: 0.12) */
  stiffness?: number;
  /** Velocity damping coefficient c (default: 0.90) */
  damping?: number;
  /** Pointer deformation radius in pixels (default: 140) */
  influenceRadius?: number;
  /** Mesh line stroke color */
  strokeColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Physics simulation runs at 60 FPS. Elastic deformations settle within $800\text{ms}$ upon pointer release.",
        "math": r"""For mesh vertex $(i, j)$ with position $\vec{p}_{i,j}$ and rest position $\vec{p}_{0,i,j}$:
1. Anchor Spring Force:
   $$\vec{F}_{anchor} = -k_{anchor} \cdot (\vec{p}_{i,j} - \vec{p}_{0,i,j})$$
2. Neighbor Constraint Springs (Hooke's law for $N \in \text{neighbors}$):
   $$\vec{F}_{neighbor} = \sum_{N} -k_{struct} \cdot \left(\|\vec{p}_{i,j} - \vec{p}_N\| - L_0\right) \frac{\vec{p}_{i,j} - \vec{p}_N}{\|\vec{p}_{i,j} - \vec{p}_N\|}$$
3. Symplectic Verlet Integration:
   $$\vec{p}(t + \Delta t) = \vec{p}(t) + (\vec{p}(t) - \vec{p}(t - \Delta t)) \cdot c + \frac{\vec{F}_{total}}{m} \Delta t^2$$""",
        "interaction": "Dragging pointer across mesh creates rubbery elastic indentation. Releasing pointer generates propagating tension waves.",
        "implementation": r"""1. Mesh Topology: Generate 2D array of vertices and structural spring edges.
2. Physics Loop: Solve spring constraints using Verlet integration inside `requestAnimationFrame`.
3. Canvas Rendering: Draw deformed grid quad lines with `ctx.beginPath()`, `ctx.moveTo()`, and `ctx.lineTo()`.
4. Boundary Pinning: Pin outer edge vertices $(\vec{p} = \vec{p}_0)$ to maintain stable borders.""",
        "modularity": "Decompose into `ElasticMesh.tsx` (<120 LoC), `MeshPhysics.ts` (<150 LoC), and `meshTypes.ts` (<50 LoC)."
    },
    {
        "id": "swarm-cursor",
        "name": "Swarm Cursor",
        "category": "Animations",
        "overview": "Swarm Cursor generates a dynamic flock of autonomous boid particles that swirl, flock, and swarm around the mouse pointer following Craig Reynolds' Boids flocking rules.",
        "props": r"""interface SwarmCursorProps {
  /** Total count of swarm boids (default: 40) */
  count?: number;
  /** Maximum boid velocity in pixels/second (default: 300) */
  maxSpeed?: number;
  /** Maximum steering force (default: 0.15) */
  maxForce?: number;
  /** Swarm particle color or color array */
  color?: string | string[];
  /** Flocking attraction radius to cursor in pixels (default: 250) */
  cursorAttractRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous autonomous flocking at 60 FPS with organic emergent behavior and dynamic formation shifts.",
        "math": r"""Reynolds Flocking Rules for boid $i$:
1. Separation (avoid crowding neighbors):
   $$\vec{F}_{sep} = \sum_{j \ne i, r_{ij} < d_{sep}} \frac{\vec{p}_i - \vec{p}_j}{r_{ij}^2}$$
2. Alignment (steer towards average heading):
   $$\vec{F}_{ali} = \frac{1}{K} \sum_{j \in N} \vec{v}_j - \vec{v}_i$$
3. Cohesion (steer towards center of mass):
   $$\vec{F}_{coh} = \frac{1}{K} \sum_{j \in N} \vec{p}_j - \vec{p}_i$$
4. Cursor Target Attraction:
   $$\vec{F}_{target} = \text{steer}(\vec{p}_i, \vec{p}_{cursor})$$
$$\vec{F}_{total} = w_s \vec{F}_{sep} + w_a \vec{F}_{ali} + w_c \vec{F}_{coh} + w_t \vec{F}_{target}$$""",
        "interaction": "Boids flock closely around cursor when still, and stretch into aerodynamic trailing streams during rapid pointer motion.",
        "implementation": r"""1. Particle Array: Store position, velocity, acceleration in flat `Float32Array`.
2. Spatial Partitioning: Use simple 2D spatial grid for $O(N)$ neighbor queries.
3. Canvas 2D Drawing: Draw oriented triangles pointing along velocity vectors $\theta = \arctan2(v_y, v_x)$.
4. Frame Throttling: Pause simulation when pointer is outside window or tab is hidden.""",
        "modularity": "Organized into `SwarmCursor.tsx` (<110 LoC), `BoidFlock.ts` (<150 LoC), and `boidMath.ts` (<70 LoC)."
    },
    {
        "id": "halftone-reveal",
        "name": "Halftone Reveal",
        "category": "Animations",
        "overview": "Halftone Reveal transitions images or UI panels using a dynamic CMYK/monochrome halftone dot raster screen where dot radii expand according to underlying luminance and cursor proximity.",
        "props": r"""interface HalftoneRevealProps {
  /** Target image or element to reveal */
  imageSrc: string;
  /** Halftone dot grid spacing in pixels (default: 8) */
  dotSize?: number;
  /** Dot pattern rotation angle in degrees (default: 45) */
  angle?: number;
  /** Reveal progress [0..1] (default: 0) */
  progress?: number;
  /** Halftone color mode (default: 'monochrome') */
  mode?: 'monochrome' | 'cmyk' | 'duotone';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Reveal transition executes over $800\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Dot radii scale smoothly from $0$ to $\sqrt{2} \cdot \text{dotSize}$.",
        "math": r"""For grid coordinate $(u, v)$ rotated by angle $\theta$:
$$x' = x \cos\theta - y \sin\theta, \quad y' = x \sin\theta + y \cos\theta$$
Sampled pixel luminance $L(x, y) \in [0, 1]$:
$$L(x, y) = 0.299R + 0.587G + 0.114B$$
Maximum dot radius $R_{max} = \frac{\text{dotSize}}{\sqrt{2}}$.
Effective dot radius at reveal progress $P \in [0, 1]$:
$$R_{dot}(x, y) = R_{max} \cdot \text{clamp}(L(x, y) \cdot P \cdot 1.5, 0, 1)$$""",
        "interaction": "Pointer position creates localized magnification of halftone dots. Hover reveals full underlying image.",
        "implementation": """1. Offscreen Canvas Sampling: Sample image luminance grid into Uint8ClampedArray.
2. SVG/Canvas Dot Array: Render circle grid with radii linked to computed $R_{dot}$.
3. WebGL Fragment Shader: Shader implementation computes dot SDF for 60 FPS performance.
4. CSS Fallback: CSS `mask-image` with repeating radial gradient pattern.""",
        "modularity": "Decompose into `HalftoneReveal.tsx` (<120 LoC), `HalftoneShader.ts` (<110 LoC), and `halftoneMath.ts` (<60 LoC)."
    },
    {
        "id": "pixel-swap",
        "name": "Pixel Swap",
        "category": "Animations",
        "overview": "Pixel Swap executes a retro 8-bit image transition where square pixel blocks dissolve, shuffle, and re-crystallize to morph between two distinct images or UI states.",
        "props": r"""interface PixelSwapProps {
  /** Initial image source */
  fromSrc: string;
  /** Target image source */
  toSrc: string;
  /** Pixel block size in pixels (default: 16) */
  blockSize?: number;
  /** Transition duration in milliseconds (default: 800) */
  duration?: number;
  /** Shuffle randomness intensity [0..1] (default: 0.5) */
  chaos?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Transitions over $800\text{ms}$ with staggered pixel activation. Each individual block undergoes a $200\text{ms}$ scale/flip animation.",
        "math": r"""For pixel block at grid index $(i, j)$:
Stagger start time:
$$t_{start}(i, j) = T_{total} \cdot \left((1 - c) \frac{i + j}{M + N} + c \cdot \text{hash}(i, j)\right)$$
Block flip scale $S_{i,j}(\tau)$:
$$S_{i,j}(\tau) = |\cos(\pi \cdot \tau)|$$
Active image selection:
$$\text{image}(\tau) = \begin{cases} \text{fromSrc} & \text{if } \tau < 0.5 \\ \text{toSrc} & \text{if } \tau \ge 0.5 \end{cases}$$""",
        "interaction": "Triggered on button click, route navigation, or hover toggle.",
        "implementation": r"""1. Canvas Slicing: Divide image into $N \times M$ tile grid.
2. Flip Animation: Animate tile matrices using Canvas 2D `ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh)`.
3. Offscreen Texture Cache: Preload both images to prevent rendering stutters.
4. Memory Management: Clean up canvas contexts on component unmount.""",
        "modularity": "Organized into `PixelSwap.tsx` (<130 LoC), `PixelGrid.ts` (<120 LoC), and `pixelMath.ts` (<50 LoC)."
    },
    {
        "id": "cursor-grid",
        "name": "Cursor Grid",
        "category": "Animations",
        "overview": "Cursor Grid renders an interactive matrix of grid cells, crosshairs, or dot nodes that illuminate, orient, and scale dynamically as the cursor sweeps across the viewport.",
        "props": r"""interface CursorGridProps {
  /** Grid cell spacing in pixels (default: 40) */
  cellSize?: number;
  /** Cursor influence radius in pixels (default: 160) */
  radius?: number;
  /** Cell highlight color */
  highlightColor?: string;
  /** Base grid border/dot color */
  baseColor?: string;
  /** Indicator type (default: 'crosshair') */
  variant?: 'crosshair' | 'dot' | 'square' | 'line';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Cell illumination rises instantly ($<16\text{ms}$) and decays exponentially over $500\text{ms}$ after pointer passes.",
        "math": r"""For cell $(i, j)$ at center $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Distance:
$$d_{i,j} = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$$
Normalized brightness:
$$B_{i,j}(t) = \max\left(B_{i,j}(t-1) \cdot \lambda, \ \text{clamp}\left(1 - \frac{d_{i,j}}{R}, 0, 1\right)\right)$$
where $\lambda = 0.92$ is decay coefficient per frame.
Orientation angle towards cursor:
$$\theta_{i,j} = \arctan2(y_c - y_{i,j}, \ x_c - x_{i,j})$$""",
        "interaction": "Real-time mouse tracking over viewport. Clicking fires a bright shockwave propagating across grid cells.",
        "implementation": r"""1. Canvas / SVG Grid: Single `<canvas>` layer spanning container width and height.
2. Fast Distance Loop: Iterate only cells within cursor bounding square $(x_c \pm R, y_c \pm R)$.
3. Device Pixel Ratio: Scale canvas by `window.devicePixelRatio` for razor-sharp crosshairs.
4. Auto Idle: Pause RAF loop when brightness values across all cells decay to zero.""",
        "modularity": "Decompose into `CursorGrid.tsx` (<120 LoC), `GridRenderer.ts` (<110 LoC), and `gridTypes.ts` (<40 LoC)."
    },
    {
        "id": "animated-content",
        "name": "Animated Content",
        "category": "Animations",
        "overview": "Animated Content provides a smooth container wrapper that animates content mount/unmount and dynamically animates container height/width transitions during child swaps without layout pop.",
        "props": r"""interface AnimatedContentProps {
  /** Child content to animate */
  children: React.ReactNode;
  /** Unique key identifying active child state */
  contentKey: string | number;
  /** Transition duration in milliseconds (default: 300) */
  duration?: number;
  /** Transition animation preset (default: 'fade-slide') */
  variant?: 'fade' | 'fade-slide' | 'scale' | 'flip';
  /** Animate wrapper container height on child dimension changes (default: true) */
  animateHeight?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Transitions execute over $300\text{ms}$ with `cubic-bezier(0.2, 0, 0, 1)`. Height adjustment transitions in parallel over $350\text{ms}$.",
        "math": r"""Normalized transition time $\tau = \frac{t - t_0}{T}$:
$$f(\tau) = 1 - (1 - \tau)^3 \quad (\text{cubic ease-out})$$
Outgoing content:
$$\alpha_{out}(\tau) = 1 - \tau, \quad y_{out}(\tau) = -20 \cdot \tau \text{ px}$$
Incoming content:
$$\alpha_{in}(\tau) = \tau, \quad y_{in}(\tau) = 20 \cdot (1 - \tau) \text{ px}$$
Container height interpolation:
$$H(t) = H_{prev} + f(\tau) \cdot (H_{next} - H_{prev})$$""",
        "interaction": "Maintains seamless layout continuity during dynamic tab switching, accordions, or multi-step wizard forms.",
        "implementation": r"""1. ResizeObserver: Measure `scrollHeight` of active content container.
2. WAAPI / CSS Transitions: Animate `height` and child `transform` simultaneously.
3. Overflow Management: Set `overflow: hidden` on wrapper during transition phase.
4. Accessible Transitions: Maintain focus state across content swaps.""",
        "modularity": "Organized into `AnimatedContent.tsx` (<120 LoC), `useAutoHeight.ts` (<80 LoC), and `transitionVariants.ts` (<60 LoC)."
    },
    {
        "id": "fade-content",
        "name": "Fade Content",
        "category": "Animations",
        "overview": "Fade Content provides threshold-based gradient edge fades, scroll masks, and viewport scroll reveals that smoothly transition content into visibility with directional alpha gradients.",
        "props": r"""interface FadeContentProps {
  /** Content to wrap with fade masks */
  children: React.ReactNode;
  /** Fade mask edges to apply (default: ['top', 'bottom']) */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /** Blur or gradient mask size in pixels (default: 40) */
  fadeSize?: number;
  /** Trigger element fade on scroll view entry (default: false) */
  viewportReveal?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Viewport reveals transition over $500\text{ms}$ with `ease-out`. Scroll fade masks update per-pixel in real-time.",
        "math": r"""CSS mask-image linear gradient construction for vertical edges:
$$\text{mask-image} = \text{linear-gradient}(\text{to bottom}, \text{transparent } 0, \text{black } H_{fade}\text{px}, \text{black } (H - H_{fade})\text{px}, \text{transparent } 100\%)$$
Scroll edge threshold logic:
$$\text{topFadeActive} = Y_{scroll} > 10\text{px}$$
$$\text{bottomFadeActive} = (Y_{max} - Y_{scroll}) > 10\text{px}$$""",
        "interaction": "Gradient edge masks dynamically appear/disappear based on scroll position (hides top fade when at top of list).",
        "implementation": r"""1. CSS Mask Layers: Apply `-webkit-mask-image` and `mask-image` with linear gradient stops.
2. Scroll Event Tracking: Update active fade edges on scroll events via CSS classes.
3. IntersectionObserver: Trigger entrance fade when content enters viewport.
4. Tailwind Integration: Pure Tailwind utility classes with arbitrary values.""",
        "modularity": "Decompose into `FadeContent.tsx` (<110 LoC) and `useScrollEdges.ts` (<70 LoC)."
    },
    {
        "id": "electric-border",
        "name": "Electric Border",
        "category": "Animations",
        "overview": "Electric Border renders a high-voltage electrical plasma discharge traveling around the perimeter of UI cards with jagged lightning arcs, neon glow bloom, and dynamic sparks.",
        "props": r"""interface ElectricBorderProps {
  /** React children rendered inside glowing border */
  children: React.ReactNode;
  /** Electric arc color (default: '#00f0ff') */
  color?: string;
  /** Secondary discharge color (default: '#bf00ff') */
  secondaryColor?: string;
  /** Border thickness in pixels (default: 2) */
  borderWidth?: number;
  /** Border corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Speed of electrical current circulation in seconds (default: 3s) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous electric loop cycles every $3.0\text{s}$. Micro-sparks jitter at 30 FPS.",
        "math": r"""Perimeter path length $P = 2(W + H) - (8 - 2\pi)R$.
Normalized arc position $s(t) = \left(\frac{t}{T}\right) \bmod 1.0$.
Jagged electrical noise offset for point $s$:
$$\vec{r}_{electric}(s) = \vec{r}_0(s) + \vec{n}(s) \cdot \sum_{k=1}^3 \frac{A}{k} \sin(2\pi f_k s + \phi_k(t))$$
Neon glow multi-layer drop shadow:
$$\text{filter: drop-shadow}(0\ 0\ 4\text{px } C_1) \text{ drop-shadow}(0\ 0\ 12\text{px } C_2)$$""",
        "interaction": "Electrical discharge intensity and spark frequency flare up on card hover.",
        "implementation": r"""1. SVG Perimeter Path: Render `<rect rx=\"R\">` stroke path matching container dimensions.
2. Animated Dash: Animate `stroke-dasharray` and `stroke-dashoffset` in CSS/WAAPI.
3. SVG Turbulence Filter: Apply `<feTurbulence>` and `<feDisplacementMap>` for jagged electric distortion.
4. Canvas Spark Overlay: Optional mini spark particle emitter at leading edge of arc.""",
        "modularity": "Organized into `ElectricBorder.tsx` (<120 LoC), `ElectricSvg.tsx` (<100 LoC), and `electricStyles.ts` (<50 LoC)."
    },
    {
        "id": "orbit-images",
        "name": "Orbit Images",
        "category": "Animations",
        "overview": "Orbit Images arranges image badges, avatar chips, or technology logos in elliptical 3D orbits around a central focal node, featuring realistic depth scaling, z-index layering, and interactive pause.",
        "props": r"""interface OrbitImagesProps {
  /** Array of image URLs or nodes to orbit */
  items: (string | { src: string; alt?: string; label?: string })[];
  /** Central focal element or avatar */
  centerContent?: React.ReactNode;
  /** Horizontal orbital radius in pixels (default: 180) */
  radiusX?: number;
  /** Vertical orbital radius in pixels (default: 80) */
  radiusY?: number;
  /** Orbit revolution duration in seconds (default: 12s) */
  duration?: number;
  /** 3D tilt angle in degrees (default: 15) */
  tiltAngle?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous orbital revolution over period $T = 12\text{s}$ with smooth linear angular velocity $\omega = \frac{2\pi}{T}$.",
        "math": r"""For item $i \in [0, N-1]$:
$$\theta_i(t) = \left(\omega t + \frac{2\pi i}{N}\right) \bmod 2\pi$$
Planar coordinates before tilt:
$$x_i = R_x \cdot \cos\theta_i(t), \quad y_i = R_y \cdot \sin\theta_i(t)$$
Depth scale and z-index based on vertical position:
$$\text{scale}_i = 1 + 0.35 \cdot \sin\theta_i(t)$$
$$\text{opacity}_i = 0.5 + 0.5 \cdot \left(\frac{\sin\theta_i(t) + 1}{2}\right)$$
$$\text{z-index}_i = \lfloor 100 \cdot (1 + \sin\theta_i(t)) \rfloor$$""",
        "interaction": "Pointer hover pauses orbit. Dragging rotates the orbital system with spring inertia.",
        "implementation": r"""1. Orbital Container: Relative flex center container.
2. Item Positioning: Absolute positioning with `transform: translate3d(x, y, 0) scale(s)`.
3. Z-Index Management: Dynamically sort items so foreground items render above center node.
4. Mobile Scaling: Proportionally scale radii $R_x, R_y$ on smaller screens.""",
        "modularity": "Decompose into `OrbitImages.tsx` (<130 LoC), `useOrbitPhysics.ts` (<100 LoC), and `orbitMath.ts` (<60 LoC)."
    },
    {
        "id": "pixel-transition",
        "name": "Pixel Transition",
        "category": "Animations",
        "overview": "Pixel Transition morphs cards, images, or modal dialogs through an animated pixelated mosaic grid where blocks scale and stagger to reveal new content.",
        "props": r"""interface PixelTransitionProps {
  /** Front primary content */
  firstContent: React.ReactNode;
  /** Secondary content revealed on transition */
  secondContent: React.ReactNode;
  /** Pixel grid resolution (e.g. 10 for 10x10 grid, default: 8) */
  gridSize?: number;
  /** Transition animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Stagger delay across grid in milliseconds (default: 20) */
  stagger?: number;
  /** Pixel block color */
  pixelColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Total transition takes $600\text{ms}$. Pixel blocks scale up to $1.0$ then back down over two $200\text{ms}$ sub-phases.",
        "math": r"""For pixel at grid cell $(r, c)$ in $R \times C$ grid:
Distance from activation origin $(r_0, c_0)$:
$$d = \sqrt{(r - r_0)^2 + (c - c_0)^2}$$
Start delay:
$$t_{start}(r, c) = d \cdot \text{stagger}$$
Pixel block scale $S(\tau) \in [0, 1]$:
$$S(\tau) = \sin(\pi \cdot \tau) \quad \text{for } \tau = \text{clamp}\left(\frac{t - t_{start}}{T_{block}}, 0, 1\right)$$""",
        "interaction": "Triggers on mouse hover, card click, or state change.",
        "implementation": r"""1. Overlay Grid: Absolute overlay containing $N \times M$ `<div>` block elements.
2. Staggered WAAPI: Animate `scale` and `opacity` of each tile with computed delays.
3. Content Swap: Switch visible DOM child at peak grid opacity ($S = 1$).
4. Clean DOM: Discard grid DOM nodes when idle to preserve memory.""",
        "modularity": "Organized into `PixelTransition.tsx` (<120 LoC), `PixelGridOverlay.tsx` (<100 LoC), and `pixelStagger.ts` (<60 LoC)."
    },
    {
        "id": "glare-hover",
        "name": "Glare Hover",
        "category": "Animations",
        "overview": "Glare Hover simulates a holographic trading card specular reflection that reacts in real-time to pointer position with 3D tilt, dynamic glare streaks, and iridescent shimmer.",
        "props": r"""interface GlareHoverProps {
  /** Child content wrapped in glare card */
  children: React.ReactNode;
  /** Maximum 3D tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Glare reflection opacity [0..1] (default: 0.35) */
  glareOpacity?: number;
  /** Glare light color (default: 'rgba(255, 255, 255, 0.8)') */
  glareColor?: string;
  /** Perspective depth in pixels (default: 1000) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Tilt and glare respond at 60/120 FPS via exponential lerp ($\alpha = 0.12$). Rebounds to flat rest position over $400\text{ms}$ upon mouse leave.",
        "math": r"""Pointer position $(x_c, y_c)$ mapped to normalized range $[-1, 1]$ relative to card center:
$$u = \frac{2(x_c - X_0)}{W} - 1, \quad v = \frac{2(y_c - Y_0)}{H} - 1$$
3D rotation angles:
$$\text{rotateY} = u \cdot \theta_{max}, \quad \text{rotateX} = -v \cdot \theta_{max}$$
Glare highlight angle and position:
$$\text{glareAngle} = \arctan2(v, u) \cdot \frac{180^\circ}{\pi}$$
$$\text{glareOpacity} = \sqrt{u^2 + v^2} \cdot O_{max}$$""",
        "interaction": "Smoothly tracks mouse over card area. Smooth return to neutral $(0^\circ, 0^\circ)$ on mouse leave.",
        "implementation": r"""1. 3D Container: `transform-style: preserve-3d; perspective: 1000px`.
2. Glare Overlay: Absolute child with `pointer-events: none; mix-blend-mode: overlay`.
3. CSS Variables: Direct injection of `--rx`, `--ry`, `--glare-x`, `--glare-y`.
4. Touch Disable: Automatically deactivates 3D tilt on mobile devices.""",
        "modularity": "Decompose into `GlareHover.tsx` (<120 LoC), `useCardTilt.ts` (<90 LoC), and `glareStyles.ts` (<50 LoC)."
    },
    {
        "id": "antigravity",
        "name": "Antigravity",
        "category": "Animations",
        "overview": "Antigravity creates an interactive physics playground where floating UI chips, icon spheres, or cards float with zero gravity, bouncing off walls and repelling each other with spring collisions.",
        "props": r"""interface AntigravityProps {
  /** Array of items/icons to float in antigravity */
  items: React.ReactNode[];
  /** Friction damping factor (default: 0.98) */
  friction?: number;
  /** Maximum floating velocity in pixels/sec (default: 60) */
  maxSpeed?: number;
  /** Particle repulsion distance in pixels (default: 80) */
  collisionRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous Newtonian physics simulation at 60 FPS. Collisions resolve elastically in a single frame tick.",
        "math": r"""For particle $i$ with position $\vec{p}_i$, velocity $\vec{v}_i$, and mass $m_i$:
1. Continuous Brownian Drift:
   $$\vec{v}_i(t + \Delta t) = \vec{v}_i(t) \cdot \mu + \vec{\eta}(t)$$
   where $\vec{\eta} \sim N(0, \sigma^2)$.
2. Elastic Wall Bounce ($x_i \le R$ or $x_i \ge W - R$):
   $$v_{x,i} = -e \cdot v_{x,i}$$
3. Inter-Particle Collision Resolution ($d_{ij} < 2R$):
   $$\vec{v}_i' = \vec{v}_i - \frac{2m_j}{m_i + m_j} \frac{\langle \vec{v}_i - \vec{v}_j, \vec{p}_i - \vec{p}_j \rangle}{\|\vec{p}_i - \vec{p}_j\|^2} (\vec{p}_i - \vec{p}_j)$$""",
        "interaction": "Users can grab, throw, and flick floating elements with pointer drag inertia.",
        "implementation": r"""1. Physics Engine: Pure TypeScript 2D physics solver running in `requestAnimationFrame`.
2. Pointer Drag: Spring anchor attaches to grabbed particle during drag events.
3. DOM Render: Position child items with `transform: translate3d(x, y, 0)`.
4. Boundary Clamping: Prevent items from escaping container bounds.""",
        "modularity": "Organized into `Antigravity.tsx` (<120 LoC), `AntigravityEngine.ts` (<150 LoC), and `physicsTypes.ts` (<50 LoC)."
    },
    {
        "id": "logo-loop",
        "name": "Logo Loop",
        "category": "Animations",
        "overview": "Logo Loop renders an infinite, seamless horizontal marquee ticker for partner logos, tech stack icons, or sponsor badges with pause-on-hover and dynamic speed modulation.",
        "props": r"""interface LogoLoopProps {
  /** Array of logo image URLs or React components */
  logos: (string | React.ReactNode)[];
  /** Marquee translation speed in pixels/second (default: 60) */
  speed?: number;
  /** Direction of marquee movement (default: 'left') */
  direction?: 'left' | 'right';
  /** Pause animation when pointer hovers over track (default: true) */
  pauseOnHover?: boolean;
  /** Gap spacing between logos in pixels (default: 48) */
  gap?: number;
  /** Apply gradient fade masks to left/right container edges (default: true) */
  fadeEdges?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Infinite continuous loop with constant linear velocity $V = 60\text{px/s}$. Smooth deceleration on hover over $300\text{ms}$.",
        "math": r"""For track content width $W_{track}$ and speed $V$:
Offset position:
$$X(t) = (X_0 \pm V \cdot t) \bmod W_{track}$$
Edge opacity gradient mask:
$$\text{mask-image} = \text{linear-gradient}(\text{to right}, \text{transparent } 0, \text{black } 60\text{px}, \text{black } (W - 60)\text{px}, \text{transparent } 100\%)$$""",
        "interaction": "Smoothly decelerates to a stop on pointer hover. Dragging allows manual scrubbing.",
        "implementation": r"""1. Dual Track Duplication: Render two identical logo sequences side-by-side.
2. CSS Animation: `@keyframes logo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`.
3. Hover State: `animation-play-state: paused` on hover.
4. Edge Fade: CSS `mask-image` or absolute gradient overlay divs.""",
        "modularity": "Decompose into `LogoLoop.tsx` (<120 LoC) and `logoLoopStyles.ts` (<60 LoC)."
    },
    {
        "id": "target-cursor",
        "name": "Target Cursor",
        "category": "Animations",
        "overview": "Target Cursor transforms the mouse cursor into a tactical sci-fi HUD targeting reticle with expanding crosshair brackets, locking on interactive elements with spring snapping.",
        "props": r"""interface TargetCursorProps {
  /** Reticle size in pixels (default: 32) */
  size?: number;
  /** Target lock-on expansion scale (default: 1.6) */
  lockScale?: number;
  /** Reticle stroke color (default: '#00f0ff') */
  color?: string;
  /** Reticle spin speed on lock in seconds (default: 4s) */
  spinSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Snaps to target element bounds within $180\text{ms}$ using `cubic-bezier(0.2, 0.9, 0.3, 1)`. Reticle spins continuously when locked.",
        "math": r"""Reticle coordinates $(x_r, y_r)$ interpolate to mouse or target center:
$$(x_r(t), y_r(t)) = \text{lerp}((x_r(t-1), y_r(t-1)), (x_{target}, y_{target}), 0.25)$$
Reticle corner bracket offsets for size $S$:
$$TL = (-S/2, -S/2), \quad TR = (S/2, -S/2), \quad BL = (-S/2, S/2), \quad BR = (S/2, S/2)$$
Lock scale expansion:
$$S(t) = S_0 \cdot (1 + 0.6 \cdot \text{isLocked})$$""",
        "interaction": "Detects `[data-target]` or `<a>`, `<button>` elements, locking HUD reticle onto element center with bounding box brackets.",
        "implementation": r"""1. Fixed Portal: Render fixed reticle layer at top z-index with pointer-events: none.
2. Mutation/Hover Observer: Check hovered element tag on `pointermove`.
3. SVG Reticle: 4 SVG bracket corners with center crosshair dot.
4. Touch Guard: Hide automatically on mobile devices.""",
        "modularity": "Organized into `TargetCursor.tsx` (<120 LoC), `useTargetLock.ts` (<90 LoC), and `reticleSvg.ts` (<60 LoC)."
    },
    {
        "id": "magic-rings",
        "name": "Magic Rings",
        "category": "Animations",
        "overview": "Magic Rings renders concentric neon energy rings radiating outward with rotating phase angles, chromatic color cycling, and interactive sound/pointer resonance.",
        "props": r"""interface MagicRingsProps {
  /** Number of concentric rings (default: 6) */
  ringCount?: number;
  /** Base ring diameter in pixels (default: 200) */
  baseRadius?: number;
  /** Primary neon color */
  color?: string;
  /** Rotation period in seconds (default: 8s) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Concentric rings rotate at staggered harmonic frequencies $\omega_k = \frac{\omega_0}{k}$. Radial pulse period $T = 3.0\text{s}$.",
        "math": r"""For ring $k \in [1, N]$:
Radius at time $t$:
$$R_k(t) = R_{base} \cdot k + A \cdot \sin(\omega t - k \cdot \phi)$$
Rotation angle:
$$\theta_k(t) = (-1)^k \cdot \frac{2\pi t}{T \cdot k}$$
Stroke opacity:
$$\alpha_k = 1 - \frac{k}{N + 1}$$""",
        "interaction": "Pointer hover distorts ring concentricity, pulling ring centers toward cursor.",
        "implementation": """1. SVG Concentric Groups: Render `<circle>` or elliptical `<path>` elements with dashed strokes.
2. CSS Keyframe Rotation: Staggered `rotate` transforms applied to individual SVG groups.
3. Glow Filter: Apply SVG `<feGaussianBlur>` or CSS `drop-shadow`.
4. Responsive Scaling: SVG viewBox auto-scales across screen resolutions.""",
        "modularity": "Decompose into `MagicRings.tsx` (<120 LoC) and `ringStyles.ts` (<60 LoC)."
    },
    {
        "id": "laser-flow",
        "name": "Laser Flow",
        "category": "Animations",
        "overview": "Laser Flow renders high-speed glowing laser energy beams coursing through circuit board traces, wireframe borders, or connection lines with intense neon bloom.",
        "props": r"""interface LaserFlowProps {
  /** SVG path d string defining the laser circuit */
  pathD: string;
  /** Laser beam color (default: '#00ffff') */
  laserColor?: string;
  /** Beam length in pixels (default: 80) */
  beamLength?: number;
  /** Travel speed in pixels/second (default: 400) */
  speed?: number;
  /** Glow intensity blur in pixels (default: 8) */
  glowBlur?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Laser packet travels continuously along path with high linear velocity $V = 400\text{px/s}$.",
        "math": r"""For path length $L$:
Laser head position:
$$s_{head}(t) = (V \cdot t) \bmod L$$
Stroke dasharray definition:
$$\text{stroke-dasharray} = [L_{beam}, L]$$
$$\text{stroke-dashoffset} = -s_{head}(t)$$
Glow intensity falloff:
$$I(d) = I_0 \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$""",
        "interaction": "Laser speed accelerates and sparks when hovering over connected circuit nodes.",
        "implementation": r"""1. Dual SVG Paths: Base muted trace path plus layered glowing laser overlay path.
2. Dashoffset Animation: Update `stroke-dashoffset` in `requestAnimationFrame` or CSS keyframe.
3. Multi-Layer Glow: 3 stroke layers with increasing width and decreasing opacity.
4. Path Cache: Pre-calculate path length via `SVGPathElement.getTotalLength()`.""",
        "modularity": "Organized into `LaserFlow.tsx` (<120 LoC), `LaserPath.tsx` (<90 LoC), and `laserUtils.ts` (<50 LoC)."
    },
    {
        "id": "magnet-lines",
        "name": "Magnet Lines",
        "category": "Animations",
        "overview": "Magnet Lines displays an array of directional tick marks or vector lines that rotate synchronously to point directly at the mouse cursor like iron filings in a magnetic field.",
        "props": r"""interface MagnetLinesProps {
  /** Grid columns count (default: 20) */
  columns?: number;
  /** Grid rows count (default: 12) */
  rows?: number;
  /** Line segment length in pixels (default: 24) */
  lineLength?: number;
  /** Line color (default: 'rgba(255, 255, 255, 0.4)') */
  color?: string;
  /** Line thickness in pixels (default: 2) */
  lineWidth?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Vector angles update in real-time at 60/120 FPS. Lines smoothly return to default horizontal orientation when pointer leaves.",
        "math": r"""For line at grid position $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Target magnetic orientation angle:
$$\theta_{target}(i, j) = \arctan2(y_c - y_{i,j}, \ x_c - x_{i,j})$$
Angle smoothing via angular lerp:
$$\theta(t) = \theta(t-1) + \alpha \cdot \text{shortestAngleDiff}(\theta_{target}, \theta(t-1))$$
Color brightness boost based on proximity:
$$I_{i,j} = \text{clamp}\left(1 - \frac{d_{i,j}}{R_{max}}, 0.2, 1.0\right)$$""",
        "interaction": "Lines follow pointer orientation across entire screen, creating realistic electromagnetic field visualization.",
        "implementation": r"""1. Canvas 2D Rendering: Single canvas layer rendering all line segments in batch.
2. Fast Matrix Transforms: Use `ctx.setTransform()` or direct trigonometry `x1, y1 -> x2, y2`.
3. Auto Idle: Stop rendering loop when mouse is stationary and angles have settled.
4. Responsive Resizing: Recompute grid cell coordinates on viewport resize.""",
        "modularity": "Decompose into `MagnetLines.tsx` (<120 LoC), `MagnetCanvas.ts` (<110 LoC), and `vectorMath.ts` (<60 LoC)."
    },
    {
        "id": "ghost-cursor",
        "name": "Ghost Cursor",
        "category": "Animations",
        "overview": "Ghost Cursor leaves a fading ethereal trail of translucent cursor clones that capture historical pointer coordinates with smooth spline interpolation and alpha decay.",
        "props": r"""interface GhostCursorProps {
  /** Number of ghost trail points in buffer (default: 20) */
  trailLength?: number;
  /** Ghost cursor fill color */
  color?: string;
  /** Ghost cursor radius in pixels (default: 16) */
  radius?: number;
  /** Blur filter intensity in pixels (default: 8) */
  blur?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Trail updates continuously at 60 FPS. Individual ghost points fade out over $500\text{ms}$ ($100\% \to 0\%$ alpha).",
        "math": r"""Buffer of history points $[P_0, P_1, \dots, P_N]$ sampled at $t_k$:
Point opacity decay:
$$\alpha_k = \left(1 - \frac{k}{N}\right)^{1.5}$$
Point scale shrinkage:
$$S_k = 1 - \frac{k}{N} \cdot 0.6$$
Catmull-Rom spline interpolation between points:
$$P(s) = 0.5 \cdot \left((2P_1) + (-P_0 + P_2)s + (2P_0 - 5P_1 + 4P_2 - P_3)s^2 + (-P_0 + 3P_1 - 3P_2 + P_3)s^3\right)$$""",
        "interaction": "Generates fluid smoke-like trail behind fast mouse movements.",
        "implementation": r"""1. Circular History Buffer: Fixed-size ring buffer storing `(x, y, timestamp)`.
2. Canvas / SVG Path: Draw ribbon or connected ghost circles with decreasing opacity.
3. Time-Based Pruning: Remove old points when age exceeds trail duration.
4. Composite Optimization: Pointer events none, composite layer.""",
        "modularity": "Organized into `GhostCursor.tsx` (<120 LoC), `useHistoryBuffer.ts` (<80 LoC), and `splineInterpolation.ts` (<60 LoC)."
    },
    {
        "id": "gradual-blur",
        "name": "Gradual Blur",
        "category": "Animations",
        "overview": "Gradual Blur generates progressive layered depth-of-field blur gradients across container edges or hero backdrops using multi-layered backdrop filter slices.",
        "props": r"""interface GradualBlurProps {
  /** Content behind blur gradient */
  children?: React.ReactNode;
  /** Direction of blur progression (default: 'bottom') */
  direction?: 'top' | 'bottom' | 'left' | 'right';
  /** Total gradient height/width in pixels (default: 120) */
  size?: number;
  /** Maximum blur radius in pixels (default: 16) */
  maxBlur?: number;
  /** Number of discrete blur slices (default: 8) */
  slices?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Static GPU-accelerated backdrop blur layer. Zero runtime CPU overhead during scrolling.",
        "math": r"""For slice $k \in [1, N]$:
Blur radius:
$$B_k = \text{maxBlur} \cdot \left(\frac{k}{N}\right)^2$$
Slice mask geometry:
$$\text{mask-image} = \text{linear-gradient}(\text{to direction}, \text{transparent } \frac{k-1}{N} \cdot 100\%, \text{black } \frac{k}{N} \cdot 100\%)$$
Slice backdrop filter:
$$\text{backdrop-filter: blur}(B_k\text{px})$$""",
        "interaction": "Silky-smooth glass blur underlay as page contents scroll beneath navigation bars or footers.",
        "implementation": r"""1. Layered DOM Slices: Render $N$ absolutely positioned overlay strips.
2. Backdrop Filter: Apply progressive `backdrop-filter: blur(Xpx)` and `mask-image` to each strip.
3. GPU Acceleration: Use `transform: translateZ(0)` on each slice.
4. Fallback: Solid linear gradient overlay for browsers lacking backdrop-filter support.""",
        "modularity": "Decompose into `GradualBlur.tsx` (<110 LoC) and `blurSliceMath.ts` (<50 LoC)."
    },
    {
        "id": "click-spark",
        "name": "Click Spark",
        "category": "Animations",
        "overview": "Click Spark produces an explosive burst of dynamic glowing sparks, star particles, or geometric embers radiating outward from pointer click coordinates with physics velocity and decay.",
        "props": r"""interface ClickSparkProps {
  /** Spark particle count per click (default: 12) */
  sparkCount?: number;
  /** Spark particle color or array of colors */
  sparkColor?: string | string[];
  /** Spark radius / size in pixels (default: 4) */
  sparkSize?: number;
  /** Spark burst radius in pixels (default: 60) */
  sparkDistance?: number;
  /** Animation duration in milliseconds (default: 500) */
  duration?: number;
  /** Children wrapped in spark trigger area */
  children: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Sparks burst outwards over $500\text{ms}$ with rapid initial acceleration and cubic-bezier deceleration `(0.1, 0.9, 0.2, 1)`.",
        "math": r"""For spark $k \in [0, N-1]$ at click origin $(x_0, y_0)$:
Emission angle:
$$\theta_k = \frac{2\pi k}{N} + \text{rand}(-\Delta\theta, \Delta\theta)$$
Initial velocity $V_k = V_0 \cdot \text{rand}(0.8, 1.2)$.
Spark position over normalized progress $\tau \in [0, 1]$:
$$x_k(\tau) = x_0 + V_k \cdot \tau \cdot (2 - \tau) \cdot \cos\theta_k$$
$$y_k(\tau) = y_0 + V_k \cdot \tau \cdot (2 - \tau) \cdot \sin\theta_k + \frac{1}{2} g \tau^2$$
Spark size & opacity:
$$S_k(\tau) = S_0 \cdot (1 - \tau), \quad \alpha_k(\tau) = 1 - \tau^2$$""",
        "interaction": "Triggers spark burst on every pointer down event.",
        "implementation": r"""1. Canvas / SVG Particle Pool: Reusable particle pool of 64 spark objects to avoid GC.
2. RAF Render Loop: Render active sparks on overlay canvas.
3. Symplectic Integration: Update spark positions and opacity until all sparks expire.
4. Auto Sleeping: Canvas sleeps when active spark count is 0.""",
        "modularity": "Organized into `ClickSpark.tsx` (<120 LoC), `SparkPool.ts` (<100 LoC), and `sparkMath.ts` (<50 LoC)."
    },
    {
        "id": "magnet",
        "name": "Magnet",
        "category": "Animations",
        "overview": "Magnet attaches physical magnetic attraction to interactive buttons, badges, or icons, pulling the element smoothly toward the cursor when within magnetic proximity.",
        "props": r"""interface MagnetProps {
  /** Interactive element to magnetize */
  children: React.ReactNode;
  /** Maximum magnetic translation displacement in pixels (default: 30) */
  magnetStrength?: number;
  /** Magnetic trigger radius in pixels (default: 120) */
  activeRadius?: number;
  /** Spring return stiffness (default: 0.15) */
  springTension?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Pointer tracking updates at 60/120 FPS. Rebound spring settles within $350\text{ms}$ upon pointer leave.",
        "math": r"""For element center $(x_0, y_0)$ and cursor $(x_c, y_c)$:
Displacement vector:
$$\vec{d} = (x_c - x_0, \ y_c - y_0), \quad r = \|\vec{d}\|$$
Magnetic pull displacement $\vec{\Delta}$:
$$\vec{\Delta} = \begin{cases} \frac{\vec{d}}{r} \cdot \text{magnetStrength} \cdot \left(1 - \frac{r}{R}\right)^{0.8} & \text{if } r < R \\ \vec{0} & \text{otherwise} \end{cases}$$
Smooth spring update:
$$\vec{p}(t) = \vec{p}(t-1) + \alpha \cdot (\vec{\Delta} - \vec{p}(t-1))$$""",
        "interaction": "Attracts element towards cursor when mouse enters influence radius $R$. Snaps back to $(0,0)$ when mouse exits.",
        "implementation": r"""1. Bounding Box Cache: Measure element center on mount and scroll.
2. Pointer Listener: Global or container-level `pointermove` listener.
3. Transform Update: Apply `transform: translate3d(x, y, 0)` via CSS variables.
4. Spring Return: Run smooth spring physics animation loop upon mouse leave.""",
        "modularity": "Decompose into `Magnet.tsx` (<110 LoC) and `useMagnetPhysics.ts` (<90 LoC)."
    },
    {
        "id": "strands",
        "name": "Strands",
        "category": "Animations",
        "overview": "Strands renders dynamic flowing fibrous spline strands or neon silk ribbons that undulate with trigonometric waves and sway in response to pointer drag.",
        "props": r"""interface StrandsProps {
  /** Number of flowing strands (default: 18) */
  strandCount?: number;
  /** Strand stroke color or gradient palette */
  colors?: string[];
  /** Wave amplitude in pixels (default: 40) */
  amplitude?: number;
  /** Flow animation speed (default: 1.0) */
  speed?: number;
  /** Strand thickness in pixels (default: 1.5) */
  lineWidth?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous sinusoidal ribbon flow with period $T = 4.0\text{s}$. Pointer displacement has $400\text{ms}$ elastic settling time.",
        "math": r"""For strand $k \in [1, N]$ with base vertical anchor $y_k$:
Wave profile along horizontal coordinate $x \in [0, W]$:
$$y_k(x, t) = y_k + \sum_{m=1}^3 \frac{A}{m} \sin\left(\frac{2\pi m x}{\lambda} + \omega t + k \cdot \phi\right) + \vec{F}_{mouse}(x)$$
Pointer influence:
$$\vec{F}_{mouse}(x) = A_{drag} \cdot \exp\left(-\frac{(x - x_c)^2}{2\sigma^2}\right) \cdot (y_c - y_k)$$""",
        "interaction": "Mouse hover creates localized elastic waves propagating along strand fibers.",
        "implementation": r"""1. Canvas 2D Splines: Draw smooth Bezier curves using `ctx.bezierCurveTo()`.
2. Multi-Color Blending: Render overlapping strands with `globalCompositeOperation: 'screen'`.
3. Auto Resize: Canvas scales dynamically with container width and height.
4. Zero Dependencies: Pure native Canvas 2D API implementation.""",
        "modularity": "Organized into `Strands.tsx` (<120 LoC), `StrandEngine.ts` (<130 LoC), and `strandMath.ts` (<60 LoC)."
    },
    {
        "id": "sticker-peel",
        "name": "Sticker Peel",
        "category": "Animations",
        "overview": "Sticker Peel creates an interactive skeuomorphic peel-back animation where UI badges or stickers peel away from corners with realistic 3D curl, back-face graphics, and cast drop-shadows.",
        "props": r"""interface StickerPeelProps {
  /** Front sticker graphic / content */
  children: React.ReactNode;
  /** Back-face graphic / peel color */
  backfaceContent?: React.ReactNode;
  /** Peel corner origin (default: 'bottom-right') */
  peelCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Maximum peel depth [0..1] (default: 0.7) */
  maxPeel?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Peel transitions over $400\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)` on hover or drag.",
        "math": r"""For peel fold line with angle $\theta$ and distance $d$:
Front face clip-path:
$$\text{clip-path: polygon}(... \text{vertices on unpeeled side of fold line})$$
Back face rotation matrix:
$$\text{transform: translate}(x_{fold}, y_{fold}) \text{ rotate}(2\theta) \text{ scaleX}(-1)$$
Shadow under peeled curl:
$$\text{box-shadow}: d \cos(\theta)\text{px } d \sin(\theta)\text{px } 12\text{px rgba}(0, 0, 0, 0.4)$$""",
        "interaction": "Dragging or hovering over corner peels sticker smoothly with pointer tracking.",
        "implementation": r"""1. Dual Face Layers: Front graphic layer and mirrored back-face layer.
2. Dynamic Clip Paths: SVG or CSS `polygon()` clip path aligned to fold axis.
3. Drop Shadow Filter: Dynamic gradient shadow rendered along peel fold line.
4. Motion Safety: Disables peel curl on touch if requested.""",
        "modularity": "Decompose into `StickerPeel.tsx` (<130 LoC), `usePeelPhysics.ts` (<90 LoC), and `peelGeometry.ts` (<60 LoC)."
    },
    {
        "id": "pixel-trail",
        "name": "Pixel Trail",
        "category": "Animations",
        "overview": "Pixel Trail leaves a retro 8-bit grid trail of illuminated square pixels behind the cursor that decay with glowing colors, opacity fading, and random dispersion.",
        "props": r"""interface PixelTrailProps {
  /** Size of each square pixel in pixels (default: 20) */
  pixelSize?: number;
  /** Decay duration of illuminated pixels in milliseconds (default: 600) */
  fadeDuration?: number;
  /** Pixel color or array of colors */
  color?: string | string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Pixels illuminate on pointer contact ($<16\text{ms}$) and fade out exponentially over $600\text{ms}$.",
        "math": r"""For pixel grid cell $(i, j)$ at time $t$ since illumination $t_{hit}$:
$$\Delta t = t - t_{hit}$$
Opacity decay:
$$\alpha_{i,j}(t) = \text{clamp}\left(1 - \frac{\Delta t}{T_{fade}}, 0, 1\right)^2$$
Pixel scale shrinkage:
$$S_{i,j}(t) = \text{clamp}\left(1 - \frac{\Delta t}{T_{fade}} \cdot 0.3, 0, 1\right)$$""",
        "interaction": "Sweeping cursor over canvas illuminates pixel grid cells along pointer path.",
        "implementation": r"""1. Canvas 2D Grid: Single canvas tracking active illuminated cell coordinates and timestamps.
2. Efficient Map: Store active cells in `Map<string, number>` keying `\"${i},${j}\" -> timestamp`.
3. Batch Drawing: Draw active square paths with `ctx.fillRect()`.
4. Sleeping Engine: Pause animation loop when `activeCells.size === 0`.""",
        "modularity": "Organized into `PixelTrail.tsx` (<120 LoC), `PixelTrailEngine.ts` (<110 LoC), and `trailTypes.ts` (<40 LoC)."
    },
    {
        "id": "cubes",
        "name": "Cubes",
        "category": "Animations",
        "overview": "Cubes renders an isometric 3D grid of floating cubes that elevate, rotate, and illuminate dynamically based on cursor distance and procedural wave functions.",
        "props": r"""interface CubesProps {
  /** Number of cubes along X axis (default: 8) */
  gridX?: number;
  /** Number of cubes along Y axis (default: 8) */
  gridY?: number;
  /** Cube dimension in pixels (default: 40) */
  cubeSize?: number;
  /** Elevation amplitude on hover in pixels (default: 50) */
  elevation?: number;
  /** Cube face base color */
  baseColor?: string;
  /** Cube face highlight color */
  highlightColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Elevation transitions operate at 60 FPS with spring settling time $\approx 350\text{ms}$ ($\zeta = 0.82$).",
        "math": r"""For cube at isometric coordinates $(i, j)$ and cursor $(x_c, y_c)$:
Isometric projection:
$$x_{iso} = (i - j) \cdot W_{half}, \quad y_{iso} = (i + j) \cdot H_{half} - Z_{elev}$$
Elevation calculation:
$$Z_{elev}(i, j) = Z_{max} \cdot \exp\left(-\frac{d_{i,j}^2}{2\sigma^2}\right) + A \cdot \sin(0.5i + 0.5j + \omega t)$$
Cube face shading (Lambertian reflectance):
$$I_{top} = I_0 \cdot 1.0, \quad I_{left} = I_0 \cdot 0.7, \quad I_{right} = I_0 \cdot 0.5$$""",
        "interaction": "Cursor acts as an elevation attractor, lifting adjacent 3D isometric cubes into ripples.",
        "implementation": r"""1. Isometric SVG / Canvas: Render isometric top, left, and right polygon faces for each cube.
2. Depth Sorting: Render cubes in back-to-front painter's algorithm order ($(i + j)$ ascending).
3. Dynamic Shading: Compute face color stops dynamically based on elevation $Z$.
4. Responsive Fit: Center isometric grid within container boundaries.""",
        "modularity": "Decompose into `Cubes.tsx` (<120 LoC), `IsometricGrid.ts` (<130 LoC), and `isoMath.ts` (<60 LoC)."
    },
    {
        "id": "metallic-paint",
        "name": "Metallic Paint",
        "category": "Animations",
        "overview": "Metallic Paint renders fluid, reflective liquid metal strokes that ripple with specular chrome reflections, dynamic fresnel highlights, and mouse-directed lighting.",
        "props": r"""interface MetallicPaintProps {
  /** Background image or metallic texture URL */
  textureSrc?: string;
  /** Chrome reflectivity index [0..1] (default: 0.85) */
  reflectivity?: number;
  /** Fluid viscosity factor (default: 0.92) */
  viscosity?: number;
  /** Specular light color (default: '#ffffff') */
  lightColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Real-time WebGL/Canvas fluid simulation running at 60 FPS with smooth specular highlight response.",
        "math": r"""Blinn-Phong Specular Reflection for normal $\vec{N}$ and light vector $\vec{L}$:
$$\vec{H} = \frac{\vec{L} + \vec{V}}{\|\vec{L} + \vec{V}\|}$$
$$I_{spec} = k_s \cdot (\vec{N} \cdot \vec{H})^\alpha$$
Fresnel approximation (Schlick's):
$$F(R) = F_0 + (1 - F_0)(1 - \vec{V} \cdot \vec{N})^5$$
Fluid Navier-Stokes advection step:
$$\vec{u}(t + \Delta t) = \vec{u}(t) - (\vec{u} \cdot \nabla)\vec{u} \Delta t + \nu \nabla^2 \vec{u} \Delta t$$""",
        "interaction": "Pointer drags fluid metallic ripples across surface. Tilting device shifts environment map reflection.",
        "implementation": r"""1. WebGL 2.0 Shader: Fragment shader implementing Blinn-Phong + environment cubemap reflection.
2. Fluid Simulation Texture: Ping-pong FBOs simulating velocity and pressure fields.
3. Canvas Fallback: CSS SVG filter `<feSpecularLighting>` with `<fePointLight>` tracking cursor.
4. Auto Resolution: Renders at $0.5\times$ resolution with bilinear upscaling for high performance.""",
        "modularity": "Organized into `MetallicPaint.tsx` (<120 LoC), `FluidShader.ts` (<150 LoC), and `glUtils.ts` (<70 LoC)."
    },
    {
        "id": "noise",
        "name": "Noise",
        "category": "Animations",
        "overview": "Noise renders an animated film grain static texture overlay using procedural Simplex/Perlin noise algorithms or optimized canvas noise buffers with blend modes.",
        "props": r"""interface NoiseProps {
  /** Noise opacity [0..1] (default: 0.08) */
  opacity?: number;
  /** Film grain particle scale in pixels (default: 1) */
  scale?: number;
  /** Noise frame rate FPS (default: 24) */
  fps?: number;
  /** CSS mix-blend-mode (default: 'overlay') */
  blendMode?: 'overlay' | 'screen' | 'multiply' | 'soft-light';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Regenerates grain patterns at $24\text{ FPS}$ (cinematic film grain rate) for authentic texture.",
        "math": r"""Monochrome white noise generation for pixel $(x, y)$:
$$N(x, y) = \text{randInt}(0, 255)$$
Perlin noise value:
$$P(x, y, t) = \sum_{k=0}^{O-1} \frac{1}{2^k} \text{simplex}(2^k x, 2^k y, \omega t)$$
Blending equation:
$$C_{out} = \text{blend}(C_{base}, N, \alpha)$$""",
        "interaction": "Static or animated backdrop overlay with `pointer-events: none`.",
        "implementation": r"""1. Canvas Buffer: Generate $128 \times 128$ pixel noise buffer into `ImageData`.
2. CSS Background Tile: Export small canvas as repeating pattern or tile directly.
3. Animation Loop: Randomize canvas translation offsets `transform: translate(rand, rand)` at 24 FPS.
4. Low Overhead: Consumes $<1\%$ CPU by avoiding per-pixel generation on full viewport.""",
        "modularity": "Decompose into `Noise.tsx` (<100 LoC) and `noiseGenerator.ts` (<70 LoC)."
    },
    {
        "id": "shape-blur",
        "name": "Shape Blur",
        "category": "Animations",
        "overview": "Shape Blur animates geometric SVG polygons and circles morphing, orbiting, and blurring into dreamy ambient background light blobs and color gradients.",
        "props": r"""interface ShapeBlurProps {
  /** Array of blur shape configurations (color, radius, speed) */
  shapes?: { color: string; radius: number; speed: number; x: number; y: number }[];
  /** Global blur radius in pixels (default: 60) */
  blurRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous orbital oscillation with periods $T_i \in [6\text{s}, 14\text{s}]$.",
        "math": r"""For shape $k$ with orbital center $(x_{0,k}, y_{0,k})$:
$$x_k(t) = x_{0,k} + R_{orb} \cdot \cos(\omega_k t + \phi_k)$$
$$y_k(t) = y_{0,k} + R_{orb} \cdot \sin(\omega_k t + \phi_k)$$
Gaussian blur convolution:
$$G(x, y) = \frac{1}{2\pi\sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$$""",
        "interaction": "Shapes gently repel from mouse cursor coordinates.",
        "implementation": r"""1. SVG / HTML Blob Elements: Render `div` circles with dynamic inline background gradients.
2. Container Blur: Outer wrapper with `filter: blur(60px); overflow: hidden`.
3. GPU Transforms: Animate `translate3d` with CSS keyframes to prevent CPU rasterization.
4. Composite Layer: `will-change: transform` on all animated shape nodes.""",
        "modularity": "Organized into `ShapeBlur.tsx` (<110 LoC) and `shapeStyles.ts` (<60 LoC)."
    },
    {
        "id": "crosshair",
        "name": "Crosshair",
        "category": "Animations",
        "overview": "Crosshair renders full-screen horizontal and vertical laser alignment lines following mouse pointer coordinates with coordinate readouts and magnetic grid alignment.",
        "props": r"""interface CrosshairProps {
  /** Crosshair line color (default: 'rgba(255, 255, 255, 0.3)') */
  color?: string;
  /** Line thickness in pixels (default: 1) */
  lineWidth?: number;
  /** Show live coordinate text badge (default: true) */
  showCoordinates?: boolean;
  /** Container ref to restrict crosshair boundaries */
  containerRef?: React.RefObject<HTMLElement>;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Zero-latency pointer tracking updated directly via pointer events at 60/120 FPS.",
        "math": r"""Pointer coordinate state $(x_p, y_p)$:
Horizontal line geometry:
$$y = y_p, \quad x \in [0, W]$$
Vertical line geometry:
$$x = x_p, \quad y \in [0, H]$$
Coordinate readout formatting:
$$\text{text} = \text{\"X: \"} + \lfloor x_p \rfloor + \text{\" | Y: \"} + \lfloor y_p \rfloor$$""",
        "interaction": "Follows pointer seamlessly. Snaps to grid lines or interactive element centers when nearby.",
        "implementation": r"""1. Fixed Overlay: Overlay container with `pointer-events: none`.
2. Direct CSS Variable Updates: Update `--cx` and `--cy` directly on pointer move.
3. GPU Lines: Absolute divs positioned with `transform: translate3d(0, var(--cy), 0)`.
4. Snapping Logic: Check nearby DOM bounds and clamp crosshair coordinates.""",
        "modularity": "Decompose into `Crosshair.tsx` (<110 LoC) and `useCrosshairSnap.ts` (<80 LoC)."
    },
    {
        "id": "image-trail",
        "name": "Image Trail",
        "category": "Animations",
        "overview": "Image Trail spawns an interactive sequence of layered photographs or artwork cards trailing behind cursor motion with randomized rotations, elevation shadows, and fade decays.",
        "props": r"""interface ImageTrailProps {
  /** Array of image URLs to cycle through trail */
  images: string[];
  /** Pointer movement distance in pixels required to spawn next image (default: 60) */
  distanceThreshold?: number;
  /** Maximum number of simultaneous active trail images (default: 6) */
  maxImages?: number;
  /** Image display lifetime before fade out in milliseconds (default: 800) */
  lifetime?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Each spawned image card mounts with scale spring ($150\text{ms}$) and fades out after $800\text{ms}$.",
        "math": r"""Spawn condition when pointer moves from $\vec{p}_{last}$ to $\vec{p}_{now}$:
$$\|\vec{p}_{now} - \vec{p}_{last}\| \ge D_{threshold}$$
Spawned image card $k$:
$$\text{position} = \vec{p}_{now}, \quad \theta_k = \text{rand}(-12^\circ, 12^\circ)$$
Opacity decay over time $t$:
$$\alpha_k(t) = \text{clamp}\left(1 - \frac{t - t_{spawn, k}}{T_{life}}, 0, 1\right)$$""",
        "interaction": "Rapid mouse movement paints a vivid cascade of stacked imagery across the screen.",
        "implementation": r"""1. Image Pool Buffer: Fixed-size ring array of DOM image elements.
2. Distance Tracker: Track Euclidean distance between successive pointer events.
3. WAAPI Animations: Scale from $0.8 \to 1.0$ on spawn, fade to opacity $0$ before recycling.
4. Memory Management: Image objects reused in-place without DOM insertions/deletions.""",
        "modularity": "Organized into `ImageTrail.tsx` (<120 LoC), `useImageSpawner.ts` (<100 LoC), and `trailMath.ts` (<50 LoC)."
    },
    {
        "id": "ribbons",
        "name": "Ribbons",
        "category": "Animations",
        "overview": "Ribbons generates 3D undulating polygon ribbons that twist, fold, and flow through space using parametric Bézier splines and WebGL/Canvas shading.",
        "props": r"""interface RibbonsProps {
  /** Number of ribbon streams (default: 5) */
  ribbonCount?: number;
  /** Ribbon width in pixels (default: 30) */
  ribbonWidth?: number;
  /** Flow velocity speed (default: 1.0) */
  speed?: number;
  /** Color palette array */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous 3D flow with ribbon traveling speed $V = 100\text{px/s}$.",
        "math": r"""Ribbon centerline curve $\vec{C}(s, t)$ for arc length $s \in [0, 1]$:
$$\vec{C}(s, t) = \left(s \cdot W, \ \frac{H}{2} + A \sin(k s + \omega t), \ B \cos(k s + \omega t)\right)$$
Ribbon edge vertices using normal $\vec{N}(s)$ and binormal $\vec{B}(s)$:
$$\vec{V}_{left}(s) = \vec{C}(s) - \frac{w}{2} \vec{B}(s), \quad \vec{V}_{right}(s) = \vec{C}(s) + \frac{w}{2} \vec{B}(s)$$""",
        "interaction": "Mouse drag rotates ribbon view angle in 3D space.",
        "implementation": """1. Canvas 2D / WebGL: Draw triangle strip mesh along parameterized spine curve.
2. Dynamic Lighting: Shade triangle faces based on surface normal dot light vector.
3. Curve Interpolation: Evaluate Catmull-Rom or cubic spline across control points.
4. Auto Resize: Automatically adjust viewport buffers on window resize.""",
        "modularity": "Decompose into `Ribbons.tsx` (<120 LoC), `RibbonEngine.ts` (<140 LoC), and `ribbonMath.ts` (<60 LoC)."
    },
    {
        "id": "splash-cursor",
        "name": "Splash Cursor",
        "category": "Animations",
        "overview": "Splash Cursor simulates high-resolution GPU fluid dynamics where pointer drag injects colorful swirling dye plumes that diffuse, advect, and dissipate across the viewport.",
        "props": r"""interface SplashCursorProps {
  /** Fluid simulation grid resolution (default: 128) */
  simResolution?: number;
  /** Fluid dye dissipation rate (default: 0.98) */
  dyeDensityDecay?: number;
  /** Fluid velocity dissipation (default: 0.98) */
  velocityDecay?: number;
  /** Fluid pressure iterations (default: 20) */
  pressureIterations?: number;
  /** Splat radius on click in pixels (default: 0.25) */
  splatRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Runs continuously at 60/120 FPS on WebGL shader pipeline. Dye plumes diffuse over $1500\text{ms}$.",
        "math": r"""Incompressible Navier-Stokes Equations:
$$\frac{\partial \vec{u}}{\partial t} = -(\vec{u} \cdot \nabla)\vec{u} - \frac{1}{\rho}\nabla p + \nu \nabla^2 \vec{u} + \vec{F}$$
$$\nabla \cdot \vec{u} = 0$$
Jacobi Pressure Solve Iteration:
$$p_{i,j}^{(k+1)} = \frac{p_{i-1,j}^{(k)} + p_{i+1,j}^{(k)} + p_{i,j-1}^{(k)} + p_{i,j+1}^{(k)} - (\nabla \cdot \vec{u})_{i,j} \cdot \Delta x^2}{4}$$""",
        "interaction": "Pointer motion imparts velocity vectors $\vec{F} = \vec{v}_{mouse}$ and injects RGB color dye plumes.",
        "implementation": r"""1. WebGL 2 Framebuffers: Ping-pong textures for velocity, pressure, divergence, and dye density.
2. Shader Passes: Advection -> Splat Injection -> Divergence -> Pressure Jacobi Solve -> Gradient Subtraction -> Dye Render.
3. Mobile Scaling: Downgrades simulation resolution to $64 \times 64$ on lower-power GPUs.
4. Zero External Libs: Pure native WebGL GLSL shader pipeline.""",
        "modularity": "Organized into `SplashCursor.tsx` (<120 LoC), `FluidSolver.ts` (<160 LoC), `fluidShaders.ts` (<140 LoC), and `glHelper.ts` (<80 LoC)."
    },
    {
        "id": "meta-balls",
        "name": "Meta Balls",
        "category": "Animations",
        "overview": "Meta Balls renders organic, liquid droplets that merge, stretch, and fuse together smoothly using 2D/3D scalar distance field thresholding or SVG gooey contrast filters.",
        "props": r"""interface MetaBallsProps {
  /** Number of bouncing metaball droplets (default: 6) */
  ballCount?: number;
  /** Ball radius range [min, max] in pixels (default: [30, 70]) */
  radiusRange?: [number, number];
  /** Ball color */
  color?: string;
  /** Metaball fusion threshold factor (default: 1.0) */
  threshold?: number;
  /** Enable mouse attraction (default: true) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous droplet physics at 60 FPS. Droplets stretch and fuse smoothly without polygon popping.",
        "math": r"""2D Scalar Field $F(x, y)$ for $N$ metaballs at centers $(x_i, y_i)$ with radii $R_i$:
$$F(x, y) = \sum_{i=1}^N \frac{R_i^2}{(x - x_i)^2 + (y - y_i)^2}$$
Metaball boundary condition:
$$\{(x, y) \mid F(x, y) \ge T_{threshold}\}$$
SVG Color Matrix Gooey Filter:
$$\begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 19 & -9 \end{pmatrix}$$""",
        "interaction": "A dedicated metaball droplet is pinned to pointer position, fusing with autonomous bouncing droplets.",
        "implementation": r"""1. SVG Filter Pipeline: Apply `<feGaussianBlur stdDeviation=\"10\">` followed by `<feColorMatrix type=\"matrix\">`.
2. Bouncing Droplet Physics: Update droplet positions with 2D velocity vectors and wall bounces.
3. Canvas Alternative: Compute scalar potential grid and draw marching squares isolines.
4. Performance: Keep blur radius reasonable to maintain 60 FPS.""",
        "modularity": "Decompose into `MetaBalls.tsx` (<120 LoC), `DropletPhysics.ts` (<110 LoC), and `gooeyFilterSvg.ts` (<50 LoC)."
    },
    {
        "id": "blob-cursor",
        "name": "Blob Cursor",
        "category": "Animations",
        "overview": "Blob Cursor renders an organic deformable jelly blob that follows the pointer, stretching along its velocity vector and bouncing back with elastic gelatin spring physics.",
        "props": r"""interface BlobCursorProps {
  /** Base blob radius in pixels (default: 25) */
  radius?: number;
  /** Blob fill color */
  fillColor?: string;
  /** Spring tension constant k (default: 0.15) */
  tension?: number;
  /** Velocity damping (default: 0.85) */
  damping?: number;
  /** Max stretch distortion scale (default: 1.8) */
  maxStretch?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Physics simulation runs at 60/120 FPS. Jelly deformation oscillation period $T \approx 200\text{ms}$.",
        "math": r"""Velocity vector $\vec{v} = (v_x, v_y) = (x(t) - x(t-1), \ y(t) - y(t-1))$.
Motion angle:
$$\theta = \arctan2(v_y, v_x)$$
Stretch and squash scales (volume preservation $S_x \cdot S_y \approx 1$):
$$S_x = 1 + \min\left(\frac{\|\vec{v}\|}{40}, \text{maxStretch} - 1\right)$$
$$S_y = \frac{1}{S_x}$$
Transform matrix:
$$\text{transform: translate3d}(x, y, 0) \text{ rotate}(\theta) \text{ scale}(S_x, S_y)$$""",
        "interaction": "Blob stretches into aerodynamic teardrop during motion and wobbles like gelatin when stopping.",
        "implementation": r"""1. Spring Follower Hook: Spring integration updates position $(x, y)$ and velocity $\vec{v}$.
2. GPU Transform: Apply `rotate` and `scale` on single composite element.
3. Gooey SVG Filter: Optional subtle SVG filter for organic liquid blob edges.
4. Auto Sleep: Pause animation loop when velocity $\|\vec{v}\| < 0.01$.""",
        "modularity": "Organized into `BlobCursor.tsx` (<110 LoC), `useBlobSpring.ts` (<90 LoC), and `blobStyles.ts` (<50 LoC)."
    },
    {
        "id": "star-border",
        "name": "Star Border",
        "category": "Animations",
        "overview": "Star Border animates a glowing constellation star or luminous light packet orbiting the rounded border perimeter of buttons or feature cards with a radiant particle tail.",
        "props": r"""interface StarBorderProps {
  /** React children wrapped in star border */
  children: React.ReactNode;
  /** Border stroke color */
  color?: string;
  /** Speed of star revolution in seconds (default: 4s) */
  speed?: number;
  /** Star glow bloom size in pixels (default: 12) */
  glowSize?: number;
  /** Border thickness in pixels (default: 2) */
  thickness?: number;
  /** Corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": "Continuous perimeter revolution over period $T = 4.0\text{s}$ using linear constant velocity.",
        "math": r"""For rounded rectangle perimeter $P = 2(W - 2R) + 2(H - 2R) + 2\pi R$:
Arc length position:
$$s(t) = \left(\frac{t}{T}\right) \cdot P$$
CSS conic-gradient approximation:
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg at } 50\%\ 50\%, \text{transparent } 0^\circ, C_{glow} \ 30^\circ, \text{transparent } 60^\circ)$$
$$\text{mask} = \text{border-box subtract content-box}$$""",
        "interaction": "Star orbit accelerates or reverses direction on card hover.",
        "implementation": r"""1. Conic Gradient Mask: Apply animated `conic-gradient` mask on pseudo-element.
2. SVG Path Alternative: Animate `<circle>` along SVG `<rect rx=\"R\">` using CSS `offset-path`.
3. Drop Shadow Bloom: Multi-stage CSS `drop-shadow` for neon starlight radiance.
4. Tailwind Integration: Custom CSS variable `--star-angle` driven by CSS `@keyframes`.""",
        "modularity": "Decompose into `StarBorder.tsx` (<120 LoC) and `starBorderStyles.ts` (<60 LoC)."
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

print(f"Generated {len(ITEMS)} Animation prompts in {PROMPTS_DIR}")
