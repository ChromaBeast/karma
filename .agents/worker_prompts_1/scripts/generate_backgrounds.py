import os

PROMPTS_DIR = r"c:\Projects\karma\prompts\backgrounds"
os.makedirs(PROMPTS_DIR, exist_ok=True)

ITEMS = [
    {
        "id": "aero-shards",
        "name": "Aero Shards",
        "category": "Backgrounds",
        "overview": "Aero Shards renders geometric crystalline glass shards drifting, rotating, and refracting background gradients in a 3D isometric atmosphere with mouse parallax.",
        "props": r"""interface AeroShardsProps {
  /** Shard count (default: 20) */
  shardCount?: number;
  /** Shard base color palette */
  colors?: string[];
  /** Drift velocity speed (default: 1.0) */
  speed?: number;
  /** Glass blur intensity in pixels (default: 12) */
  blur?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous drifting animation at 60 FPS. Mouse parallax responds via exponential lerp ($\tau = 16\text{ms}$).",
        "math": r"""For shard $k$ with 3D coordinates $(x_k, y_k, z_k)$:
$$x_k(t) = x_{0,k} + V_x t + \Delta x_{mouse} \cdot \frac{z_k}{Z_{max}}$$
$$y_k(t) = y_{0,k} + V_y t + \Delta y_{mouse} \cdot \frac{z_k}{Z_{max}}$$
$$\theta_k(t) = \theta_{0,k} + \omega_k t$$
Facet polygon vertices in 2D projection:
$$P_j = (x_k + r_j \cos(\theta_k + \phi_j), \ y_k + r_j \sin(\theta_k + \phi_j))$$""",
        "interaction": "Mouse coordinates steer the 3D parallax drift angle of crystalline shards.",
        "implementation": r"""1. Canvas 2D / WebGL: Draw translucent convex polygon paths with dynamic linear gradients.
2. Depth Sorting: Render shards ordered by Z depth with variable blur.
3. Blend Modes: `globalCompositeOperation: 'screen'` or `'lighter'`.
4. Auto Resize: Seamlessly handles viewport dimension changes.""",
        "modularity": "Organized into `AeroShards.tsx` (<120 LoC), `ShardEngine.ts` (<130 LoC), and `shardMath.ts` (<50 LoC)."
    },
    {
        "id": "ghost-fibers",
        "name": "Ghost Fibers",
        "category": "Backgrounds",
        "overview": "Ghost Fibers renders flowing translucent optical fibers that wave rhythmically like underwater bioluminescent sea anemones or silk filaments.",
        "props": r"""interface GhostFibersProps {
  /** Number of fiber strands (default: 30) */
  fiberCount?: number;
  /** Primary glow color */
  color?: string;
  /** Wave oscillation speed (default: 0.8) */
  speed?: number;
  /** Fiber length in pixels (default: 300) */
  length?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous wave undulation with fundamental period $T = 5.0\text{s}$.",
        "math": r"""For fiber $k$ with anchor $(x_{0,k}, y_{0,k})$:
Parametric spine curve $\vec{P}(s, t)$ for arc length $s \in [0, L]$:
$$x(s, t) = x_{0,k} + \sum_{m=1}^3 A_m \left(\frac{s}{L}\right)^{1.5} \sin(\omega_m t + k \phi_m)$$
$$y(s, t) = y_{0,k} + s$$
Tip opacity glow:
$$\alpha(s) = \left(\frac{s}{L}\right)^2$$""",
        "interaction": "Mouse movement repels adjacent fiber tips with spring elasticity.",
        "implementation": r"""1. Canvas 2D Splines: Render smooth cubic Bézier curves through spine control points.
2. Gradient Strokes: Apply linear stroke gradients fading from dark root to luminous tip.
3. Symplectic Integration: Update fiber tip positions with spring return forces.
4. Low CPU: Limits path rendering to single RAF pass.""",
        "modularity": "Decompose into `GhostFibers.tsx` (<120 LoC), `FiberEngine.ts` (<130 LoC), and `fiberMath.ts` (<50 LoC)."
    },
    {
        "id": "crt-warp",
        "name": "CRT Warp",
        "category": "Backgrounds",
        "overview": "CRT Warp applies retro cathode-ray tube barrel distortion, flickering phosphorescent scanlines, RGB sub-pixel chromatic aberration, and vignette curves.",
        "props": r"""interface CrtWarpProps {
  /** Barrel distortion curvature intensity (default: 0.15) */
  curvature?: number;
  /** Scanline count or spacing in pixels (default: 4) */
  scanlineSpacing?: number;
  /** CRT flicker noise intensity (default: 0.04) */
  flicker?: number;
  /** Vignette edge darkness (default: 0.4) */
  vignette?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Scanlines animate at 60 FPS. Micro-flicker updates at 30 FPS.",
        "math": r"""Barrel Distortion in normalized UV space $(u, v) \in [-1, 1]$:
$$r = \sqrt{u^2 + v^2}$$
$$(u', v') = (u, v) \cdot (1 + k \cdot r^2)$$
CRT Scanline Function:
$$S(y, t) = 0.5 + 0.5 \cdot \sin\left(\frac{2\pi y}{H_{scan}} + \omega t\right)$$
Vignette Darkening:
$$V(u, v) = (1 - u^2)(1 - v^2)$$""",
        "interaction": "Static or reactive full-screen backdrop filter overlay.",
        "implementation": r"""1. WebGL Fragment Shader: Single full-screen quad applying barrel distortion and scanline modulation.
2. SVG/CSS Fallback: Radial gradient vignette + repeating scanline background overlay.
3. Zero Main-Thread Overhead: Executed entirely on GPU fragment stage.
4. Preserves Content: Underlying DOM content remains fully interactive.""",
        "modularity": "Organized into `CrtWarp.tsx` (<110 LoC), `CrtShader.ts` (<120 LoC), and `crtStyles.ts` (<40 LoC)."
    },
    {
        "id": "molten-metal",
        "name": "Molten Metal",
        "category": "Backgrounds",
        "overview": "Molten Metal renders glowing liquid gold, liquid mercury, or molten lava flows with volumetric specular highlights, heat distortion, and fluid eddies.",
        "props": r"""interface MoltenMetalProps {
  /** Metal type preset (default: 'gold') */
  preset?: 'gold' | 'chrome' | 'copper' | 'lava';
  /** Fluid flow speed (default: 1.0) */
  flowSpeed?: number;
  /** Surface bump map intensity (default: 0.8) */
  bumpIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Fluid Navier-Stokes simulation running continuously at 60 FPS.",
        "math": r"""Fractal Brownian Motion (fBm) Heightmap $H(x, y, t)$:
$$H(x, y, t) = \sum_{k=0}^{O-1} \frac{1}{2^k} \text{simplex}(2^k x + \vec{u} t, \ 2^k y + \vec{v} t)$$
Surface Normal Gradient:
$$\vec{N} = \text{normalize}\left(-\frac{\partial H}{\partial x}, \ -\frac{\partial H}{\partial y}, \ 1\right)$$
Blinn-Phong Specular Luminance:
$$I = k_d (\vec{N} \cdot \vec{L}) + k_s (\vec{N} \cdot \vec{H})^\alpha$$""",
        "interaction": "Mouse drag stirs dynamic vortices into the molten liquid metal field.",
        "implementation": r"""1. WebGL 2.0 Fragment Shader: Calculates fBm noise and Blinn-Phong lighting per pixel.
2. Color Palettes: Metallic gradients mapped via custom 1D lookup textures.
3. Low-Res Buffer: $0.5\times$ resolution framebuffer with bilinear filtering.
4. Auto Sleep: Pauses when offscreen.""",
        "modularity": "Decompose into `MoltenMetal.tsx` (<120 LoC), `MoltenShader.ts` (<140 LoC), and `metalPalettes.ts` (<50 LoC)."
    },
    {
        "id": "gradient-waves",
        "name": "Gradient Waves",
        "category": "Backgrounds",
        "overview": "Gradient Waves renders layered sinusoidal ribbons of shifting color gradients that ebb, flow, and overlap with translucent wave crests and mouse reactivity.",
        "props": r"""interface GradientWavesProps {
  /** Number of wave layers (default: 4) */
  layers?: number;
  /** Wave color palette stops */
  colors?: string[];
  /** Wave oscillation speed (default: 1.0) */
  speed?: number;
  /** Wave height amplitude in pixels (default: 60) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous wave undulation with harmonically related periods $T_k = \frac{T_0}{k}$.",
        "math": r"""For wave layer $k \in [1, N]$ at horizontal coordinate $x \in [0, W]$:
$$y_k(x, t) = Y_{base, k} + A_k \sin\left(\frac{2\pi x}{\lambda_k} + \omega_k t + \phi_k\right) + \frac{A_k}{2} \cos\left(\frac{4\pi x}{\lambda_k} - 0.5 \omega_k t\right)$$
Area fill polygon:
$$\text{path} = [(0, H), (0, y_k(0, t)), \dots, (W, y_k(W, t)), (W, H)]$$""",
        "interaction": "Pointer height modulates wave amplitude $A_k$ in real-time.",
        "implementation": r"""1. Canvas 2D Area Fills: Render bezier curves across sampled wave peaks.
2. Gradient Linear Fills: Apply vertical `createLinearGradient()` on each layer.
3. Layer Blend: Overlapping translucent layers with `globalAlpha = 0.6`.
4. Dynamic Resizing: Auto-measures canvas bounding rect.""",
        "modularity": "Organized into `GradientWaves.tsx` (<120 LoC), `WaveLayer.ts` (<110 LoC), and `waveMath.ts` (<50 LoC)."
    },
    {
        "id": "web-threads",
        "name": "Web Threads",
        "category": "Backgrounds",
        "overview": "Web Threads renders a complex network of constellation nodes and interconnected thread lines that form, break, and stretch with proximity distance thresholds.",
        "props": r"""interface WebThreadsProps {
  /** Particle node count (default: 60) */
  nodeCount?: number;
  /** Maximum connection distance in pixels (default: 130) */
  maxDistance?: number;
  /** Line stroke color (default: 'rgba(255, 255, 255, 0.2)') */
  lineColor?: string;
  /** Node particle color */
  nodeColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Autonomous 2D Brownian node drift at 60 FPS. Thread opacity updates instantaneously with node distance.",
        "math": r"""For node pair $(i, j)$ at positions $\vec{p}_i, \vec{p}_j$:
Distance $d_{ij} = \|\vec{p}_i - \vec{p}_j\|$.
Connection line opacity:
$$\alpha_{ij} = \begin{cases} \alpha_0 \cdot \left(1 - \frac{d_{ij}}{D_{max}}\right) & \text{if } d_{ij} < D_{max} \\ 0 & \text{otherwise} \end{cases}$$
Node velocity update:
$$\vec{p}_i(t + \Delta t) = \vec{p}_i(t) + \vec{v}_i \Delta t$$""",
        "interaction": "A special invisible node is attached to mouse cursor, spinning connection threads to adjacent nodes.",
        "implementation": r"""1. Particle Buffer: Flat `Float32Array` holding `[x, y, vx, vy]` per node.
2. Pairwise Distance Check: Optimized spatial partitioning for $O(N)$ connection queries.
3. Canvas Batch Lines: Single `ctx.beginPath()` rendering all active thread segments.
4. Boundary Bounce: Reverses node velocity when colliding with canvas edges.""",
        "modularity": "Decompose into `WebThreads.tsx` (<120 LoC), `ThreadEngine.ts` (<130 LoC), and `threadMath.ts` (<50 LoC)."
    },
    {
        "id": "topography",
        "name": "Topography",
        "category": "Backgrounds",
        "overview": "Topography renders animated isometric contour maps, elevation isolines, and terrain maps using 2D Perlin noise scalar fields and Marching Squares.",
        "props": r"""interface TopographyProps {
  /** Number of elevation contour levels (default: 12) */
  contourLevels?: number;
  /** Noise scale frequency (default: 0.003) */
  noiseScale?: number;
  /** Contour line stroke color */
  lineColor?: string;
  /** Animation speed (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Terrain noise field evolves smoothly at 60 FPS with constant phase velocity $\omega = 0.1\text{ rad/s}$.",
        "math": r"""2D Scalar Elevation Field $E(x, y, t)$:
$$E(x, y, t) = \sum_{k=0}^2 \frac{1}{2^k} \text{simplex}(2^k \cdot f \cdot x, \ 2^k \cdot f \cdot y, \ \omega t)$$
Contour Isoline Condition for elevation level $h_k$:
$$\{(x, y) \mid E(x, y, t) = h_k\}$$
Marching Squares linear interpolation between grid vertices $(A, B)$ with values $(v_A, v_B)$:
$$\vec{P}_{iso} = \vec{A} + \frac{h_k - v_A}{v_B - v_A} (\vec{B} - \vec{A})$$""",
        "interaction": "Mouse cursor acts as a topographic elevation peak or depression in the terrain.",
        "implementation": r"""1. Marching Squares Kernel: Fast lookup table evaluating $16$ cell edge configurations.
2. Canvas 2D Vector Strokes: Draw continuous contour paths across cells.
3. WebGL Alternative: Fragment shader computing `fract(elevation * N)` for 60 FPS performance.
4. Auto Resolution: Dynamic grid spacing based on viewport width.""",
        "modularity": "Organized into `Topography.tsx` (<120 LoC), `MarchingSquares.ts` (<140 LoC), and `simplexNoise.ts` (<120 LoC)."
    },
    {
        "id": "light-tunnel",
        "name": "Light Tunnel",
        "category": "Backgrounds",
        "overview": "Light Tunnel generates an endless 3D hyperspace warp tunnel with accelerating neon rings, speed particle streaks, and mouse steering.",
        "props": r"""interface LightTunnelProps {
  /** Ring count inside tunnel (default: 16) */
  ringCount?: number;
  /** Travel speed through tunnel (default: 300) */
  speed?: number;
  /** Neon color palette */
  colors?: string[];
  /** Tunnel curvature amplitude (default: 40) */
  curvature?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Infinite warp speed translation along Z axis at $V = 300\text{px/s}$.",
        "math": r"""For tunnel ring $k \in [0, N-1]$ with Z depth $z_k(t)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{max}$$
Perspective ring radius:
$$R_k(t) = \frac{R_0 \cdot d_{cam}}{z_k(t) + d_{cam}}$$
Centerline tunnel curve with mouse steering $(X_m, Y_m)$:
$$x_{center}(z) = X_m \cdot \left(\frac{z}{Z_{max}}\right)^2, \quad y_{center}(z) = Y_m \cdot \left(\frac{z}{Z_{max}}\right)^2$$""",
        "interaction": "Moving mouse steers camera trajectory through the bending 3D neon tunnel.",
        "implementation": r"""1. Canvas 2D / WebGL: Draw concentric distorted ellipses along tunnel spine.
2. Speed Streaks: Add radial particle lines extending from vanishing center point.
3. Neon Glow: Apply high-intensity canvas shadows or additive blend modes.
4. Frame Rate Throttling: Automatically reduces ring count on mobile.""",
        "modularity": "Decompose into `LightTunnel.tsx` (<120 LoC), `TunnelEngine.ts` (<130 LoC), and `tunnelMath.ts` (<50 LoC)."
    },
    {
        "id": "sliced-waves",
        "name": "Sliced Waves",
        "category": "Backgrounds",
        "overview": "Sliced Waves renders horizontal or vertical sliced geometric bands that shift, phase, and undulate with offset sine wave rhythms and gradient textures.",
        "props": r"""interface SlicedWavesProps {
  /** Number of sliced strips (default: 12) */
  sliceCount?: number;
  /** Phase offset between adjacent slices (default: 0.3) */
  phaseOffset?: number;
  /** Color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous wave phasing at 60 FPS with harmonic oscillation.",
        "math": r"""For slice strip $k \in [0, N-1]$:
Horizontal translation offset:
$$X_k(t) = A \cdot \sin(\omega t + k \cdot \Delta\phi)$$
Slice height and vertical positioning:
$$H_{slice} = \frac{H_{container}}{N}, \quad Y_k = k \cdot H_{slice}$$""",
        "interaction": "Hovering mouse over specific slices triggers localized harmonic wave ripples.",
        "implementation": r"""1. DOM Slice Strips: Container with $N$ flex/absolute slices.
2. GPU Transforms: Animate `transform: translate3d(X, 0, 0)` with CSS custom properties.
3. Background Parallax: Shift background gradient coordinates inside each slice.
4. Tailwind Integration: Pure Tailwind CSS classes.""",
        "modularity": "Organized into `SlicedWaves.tsx` (<120 LoC) and `sliceStyles.ts` (<50 LoC)."
    },
    {
        "id": "acid-squares",
        "name": "Acid Squares",
        "category": "Backgrounds",
        "overview": "Acid Squares generates dynamic psychedelic concentric squares that pulse, rotate, and cycle through vibrant 90s acid-house neon color palettes.",
        "props": r"""interface AcidSquaresProps {
  /** Number of concentric square layers (default: 14) */
  layers?: number;
  /** Rotation speed (default: 1.0) */
  speed?: number;
  /** Zoom pulse scale amplitude (default: 0.2) */
  pulseScale?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous rotation and zoom pulse cycle with period $T = 4.0\text{s}$.",
        "math": r"""For concentric square layer $k \in [0, N-1]$:
Scale factor:
$$S_k(t) = \left(1 - \frac{k}{N}\right) \cdot (1 + A \sin(\omega t - k \phi))$$
Rotation angle:
$$\theta_k(t) = (-1)^k \cdot \omega_{rot} t + k \cdot 15^\circ$$
Neon Hue cycling:
$$\text{Hue}_k(t) = (\omega_{color} t + k \cdot 25^\circ) \bmod 360^\circ$$""",
        "interaction": "Pointer position modulates rotation direction and zoom pulse frequency.",
        "implementation": r"""1. Canvas 2D / SVG: Render nested rotated rectangles centered at $(W/2, H/2)$.
2. Additive Color Blending: `mix-blend-mode: screen` or `globalCompositeOperation: 'screen'`.
3. Neon Glow: Layered stroke drawing with decreasing alpha.
4. Auto Resize: Centers geometry automatically on container resize.""",
        "modularity": "Decompose into `AcidSquares.tsx` (<120 LoC) and `acidSquareMath.ts` (<60 LoC)."
    },
    {
        "id": "scanner",
        "name": "Scanner",
        "category": "Backgrounds",
        "overview": "Scanner simulates a high-tech sci-fi holographic laser scanning grid that sweeps across the viewport with radar sweep sweeps, illuminated nodes, and HUD overlays.",
        "props": r"""interface ScannerProps {
  /** Laser line color (default: '#00ffcc') */
  laserColor?: string;
  /** Sweep duration across screen in seconds (default: 3.5s) */
  duration?: number;
  /** Grid cell spacing in pixels (default: 32) */
  gridSize?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous laser sweep cycles across viewport every $3.5\text{s}$ linearly.",
        "math": r"""Vertical laser position $Y_{laser}(t)$:
$$Y_{laser}(t) = (V \cdot t) \bmod H_{view}$$
Grid intersection node activation for grid point $(x_i, y_j)$:
$$\alpha_{i,j}(t) = \exp\left(-\frac{(y_j - Y_{laser}(t))^2}{2\sigma^2}\right)$$
Laser beam trailing gradient:
$$\text{gradient} = \text{linear-gradient}(\text{to top}, C_{laser} \ 0\%, \text{transparent } 80\text{px})$$""",
        "interaction": "Clicking screen leaves a radar ping marker that radiates expanding pulse rings.",
        "implementation": r"""1. Dual Canvas Layers: Background grid canvas + animated laser sweep beam.
2. Particle Pings: Dynamic ring pulse emitter on user pointer clicks.
3. GPU Acceleration: Sweep beam positioned via `transform: translate3d(0, y, 0)`.
4. Low CPU Overhead: Grid rendered once into static bitmap cache.""",
        "modularity": "Organized into `Scanner.tsx` (<120 LoC), `ScannerEngine.ts` (<130 LoC), and `scannerMath.ts` (<50 LoC)."
    },
    {
        "id": "ferrofluid",
        "name": "Ferrofluid",
        "category": "Backgrounds",
        "overview": "Ferrofluid simulates magnetic liquid spike physics where black magnetic fluid bristles with sharp organic spikes, conforms to magnetic field lines, and coalesces.",
        "props": r"""interface FerrofluidProps {
  /** Fluid blob radius in pixels (default: 120) */
  radius?: number;
  /** Magnetic spike count (default: 18) */
  spikeCount?: number;
  /** Spike height amplitude in pixels (default: 50) */
  spikeHeight?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Magnetic spike deformation updates at 60 FPS with spring settling response ($300\text{ms}$).",
        "math": r"""Ferrofluid boundary contour in polar coordinates $(r(\theta), \theta)$:
$$r(\theta) = R_0 + \sum_{k=1}^{N_{spikes}} A_k \cdot \exp\left(-\frac{(\theta - \theta_k)^2}{2\sigma^2}\right) \cdot \frac{1}{1 + d_{mouse, k} / R_{mag}}$$
Spike alignment toward external magnetic cursor vector $\vec{B} = (x_c - X_0, \ y_c - Y_0)$:
$$\theta_{spike} \leftarrow \theta_{spike} + \alpha \cdot (\theta_{\vec{B}} - \theta_{spike})$$""",
        "interaction": "Cursor acts as a powerful neodymium magnet, attracting and pulling ferrofluid spikes toward the pointer.",
        "implementation": r"""1. Canvas 2D Splines: Draw smooth closed contour passing through deformed spike tips.
2. Metallic Gloss Shading: Deep obsidian black radial gradient fill with bright specular highlight.
3. Physics Hook: Spring integration solves spike height oscillation.
4. WebGL Alternative: Raymarched metaballs with magnetic directional deformation.""",
        "modularity": "Decompose into `Ferrofluid.tsx` (<130 LoC), `MagneticSolver.ts` (<140 LoC), and `ferroMath.ts` (<50 LoC)."
    },
    {
        "id": "lightfall",
        "name": "Lightfall",
        "category": "Backgrounds",
        "overview": "Lightfall generates a vertical cascade of luminous light meteors, glowing fiber rain, and trailing neon particles falling gently down the viewport.",
        "props": r"""interface LightfallProps {
  /** Drop particle count (default: 50) */
  count?: number;
  /** Fall speed in pixels/sec (default: 150) */
  speed?: number;
  /** Light trail length in pixels (default: 120) */
  trailLength?: number;
  /** Light color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous particle fall at 60 FPS with randomized speed variations.",
        "math": r"""For falling light streak $k$:
Position:
$$y_k(t) = (y_{0,k} + V_k \cdot t) \bmod (H + L_{trail})$$
$$x_k(t) = x_{0,k} + A \sin(\omega t + \phi_k)$$
Trail stroke linear gradient:
$$\text{gradient} = [(x_k, y_k - L_{trail}) \to (x_k, y_k)], \quad \alpha(s) = \left(\frac{s}{L_{trail}}\right)^2$$""",
        "interaction": "Moving mouse creates air turbulence, deflecting falling light streams horizontally.",
        "implementation": r"""1. Canvas 2D Rain: Batch draw vertical line gradients with `ctx.createLinearGradient()`.
2. Particle Pool: Fixed array of 100 particle objects avoiding allocations.
3. Wind Turbulence: Add horizontal mouse velocity vector to particle positions.
4. Auto Sleep: Pauses when browser tab is inactive.""",
        "modularity": "Organized into `Lightfall.tsx` (<120 LoC), `RainEngine.ts` (<120 LoC), and `rainTypes.ts` (<40 LoC)."
    },
    {
        "id": "liquid-ether",
        "name": "Liquid Ether",
        "category": "Backgrounds",
        "overview": "Liquid Ether renders a dreamy, volumetric Navier-Stokes fluid background where glowing ethereal gas clouds swirl, diffuse, and react to pointer drag.",
        "props": r"""interface LiquidEtherProps {
  /** Color palette (default: pastel neon) */
  colors?: string[];
  /** Fluid viscosity (default: 0.95) */
  viscosity?: number;
  /** Fluid velocity dissipation (default: 0.98) */
  dissipation?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Real-time WebGL fluid simulation running at 60 FPS.",
        "math": r"""Incompressible Navier-Stokes Fluid Advection:
$$\frac{\partial \vec{u}}{\partial t} = -(\vec{u} \cdot \nabla)\vec{u} - \frac{1}{\rho}\nabla p + \nu \nabla^2 \vec{u} + \vec{F}_{pointer}$$
Vorticity Confinement to prevent numerical diffusion:
$$\vec{f}_{vort} = \epsilon (\nabla |\vec{\omega}| \times \vec{\omega}) \Delta x$$""",
        "interaction": "Dragging pointer injects swirling dye plumes and turbulent fluid velocity.",
        "implementation": r"""1. WebGL 2.0 Shader Pipeline: Advection, Divergence, Jacobi Pressure Solve, Gradient Subtraction.
2. Low-Resolution Grid: $128 \times 128$ fluid grid with bilinear hardware upscaling.
3. High Performance: Single WebGL context with ping-pong FBOs.
4. Fallback: Smooth CSS radial gradient drift on unsupported browsers.""",
        "modularity": "Decompose into `LiquidEther.tsx` (<120 LoC), `EtherSolver.ts` (<150 LoC), and `etherShaders.ts` (<140 LoC)."
    },
    {
        "id": "prism",
        "name": "Prism",
        "category": "Backgrounds",
        "overview": "Prism refracts incoming light into a brilliant rainbow dispersion spectrum with caustic reflections, angular dispersion, and dynamic glass facet geometry.",
        "props": r"""interface PrismProps {
  /** Dispersion strength (default: 0.8) */
  dispersion?: number;
  /** Prism facet rotation speed (default: 0.5) */
  rotationSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Prism facets rotate continuously over period $T = 12\text{s}$. Rainbow caustics update at 60 FPS.",
        "math": r"""Cauchy's Dispersion Formula for wavelength $\lambda$:
$$n(\lambda) = A + \frac{B}{\lambda^2}$$
Refraction angle for color channel $\lambda$:
$$\theta_{refr}(\lambda) = \arcsin\left(\frac{\sin\theta_{inc}}{n(\lambda)}\right)$$
Caustic intensity mapping:
$$I(x, y) = I_0 \cdot \det\left(\frac{\partial \vec{x}_{screen}}{\partial \vec{u}_{prism}}\right)^{-1}$$""",
        "interaction": "Mouse angle shifts the incident light vector, rotating the refracted rainbow spectrum.",
        "implementation": r"""1. WebGL / Canvas Caustics: Render multi-layer refractive rainbow gradients.
2. Chromatic Split: Render separate R, G, B passes with varying refraction indices.
3. Blend Mode: Additive screen blending for luminous caustics.
4. Zero Dependency: Pure mathematical shader implementation.""",
        "modularity": "Organized into `Prism.tsx` (<120 LoC), `PrismEngine.ts` (<130 LoC), and `prismMath.ts` (<60 LoC)."
    },
    {
        "id": "dark-veil",
        "name": "Dark Veil",
        "category": "Backgrounds",
        "overview": "Dark Veil renders a mysterious, deep obsidian black atmosphere with subtle smoky silk folds drifting and glowing edge highlights.",
        "props": r"""interface DarkVeilProps {
  /** Smoke veil density (default: 0.7) */
  density?: number;
  /** Veil edge highlight color (default: 'rgba(99, 102, 241, 0.2)') */
  glowColor?: string;
  /** Drift velocity (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous organic veil drifting at 60 FPS with subtle wave periods ($T \approx 8\text{s}$).",
        "math": r"""Fractal Simplex Noise Density $D(x, y, t)$:
$$D(x, y, t) = \text{simplex}(f \cdot x + \text{simplex}(f \cdot y, t), \ f \cdot y, \ \omega t)$$
Luminance tone mapping:
$$I(x, y) = \text{smoothstep}(0.3, 0.8, D(x, y, t)) \cdot C_{glow}$$""",
        "interaction": "Pointer gently parts and disperses the dark veil smoke clouds.",
        "implementation": r"""1. WebGL / Canvas Noise: Low-frequency simplex noise shader.
2. Deep Tone Gradient: Deep black base with subtle indigo/violet ambient bloom.
3. Composite Layer: Rendered on GPU composite texture.
4. Low CPU: Throttles to 30 FPS on battery saver mode.""",
        "modularity": "Decompose into `DarkVeil.tsx` (<110 LoC), `VeilShader.ts` (<120 LoC), and `veilStyles.ts` (<40 LoC)."
    },
    {
        "id": "light-pillar",
        "name": "Light Pillar",
        "category": "Backgrounds",
        "overview": "Light Pillar renders towering vertical columns of volumetric neon light and god rays piercing through a dark atmospheric haze.",
        "props": r"""interface LightPillarProps {
  /** Pillar count (default: 5) */
  pillarCount?: number;
  /** Pillar base color */
  color?: string;
  /** Ray beam width in pixels (default: 80) */
  beamWidth?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Pillars oscillate and breathe slowly with harmonic periods ($T \in [4\text{s}, 9\text{s}]$).",
        "math": r"""For light pillar $k$ at horizontal position $x_k$:
Volumetric beam intensity $I(x, y, t)$:
$$I(x, y, t) = I_0 \cdot \exp\left(-\frac{(x - x_k(t))^2}{2\sigma^2}\right) \cdot \left(1 - \frac{y}{H}\right)^{0.5} \cdot (1 + 0.2 \sin(\omega_k t))$$""",
        "interaction": "Mouse hover attracts the nearest light pillar and boosts its luminous intensity.",
        "implementation": r"""1. CSS Linear Gradients / Canvas: Multi-stop vertical gradients with radial horizontal falloff.
2. Additive Blend: `mix-blend-mode: screen` for light accumulation.
3. Ambient Dust Particles: Optional floating dust particles inside pillar beams.
4. Tailwind Integration: Pure Tailwind CSS classes with CSS custom properties.""",
        "modularity": "Organized into `LightPillar.tsx` (<120 LoC) and `pillarStyles.ts` (<50 LoC)."
    },
    {
        "id": "silk",
        "name": "Silk",
        "category": "Backgrounds",
        "overview": "Silk renders luxurious satin or silk cloth waving, folding, and draping with authentic specular sheen and soft fluid physics.",
        "props": r"""interface SilkProps {
  /** Silk tint color */
  color?: string;
  /** Cloth wave amplitude (default: 40) */
  amplitude?: number;
  /** Flow animation speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous cloth wave motion at 60 FPS with harmonic oscillation.",
        "math": r"""Silk Cloth Heightfield $Z(x, y, t)$:
$$Z(x, y, t) = A_1 \sin(k_1 x + \omega_1 t) \cos(k_2 y + \omega_2 t) + A_2 \sin(k_3(x + y) - \omega_3 t)$$
Anisotropic Specular Highlight (Ward model):
$$I_{spec} = \frac{1}{\sqrt{\cos\theta_i \cos\theta_r}} \exp\left(-\frac{\tan^2\theta_h}{\alpha_x^2}\right)$$""",
        "interaction": "Pointer dragging creates ripples and folds across the silk fabric surface.",
        "implementation": r"""1. WebGL / Canvas Mesh: 2D vertex grid deformed by trigonometric wave functions.
2. Anisotropic Shading: Computes satin/silk specular sheen across cloth normals.
3. Responsive Grid: Auto-scales mesh resolution to screen size.
4. CSS Fallback: Animated multi-layer gradient blend.""",
        "modularity": "Decompose into `Silk.tsx` (<120 LoC), `SilkShader.ts` (<130 LoC), and `silkMath.ts` (<50 LoC)."
    },
    {
        "id": "floating-lines",
        "name": "Floating Lines",
        "category": "Backgrounds",
        "overview": "Floating Lines renders geometric wireframe spline lines drifting in 3D space with depth fading and gentle parallax rotation.",
        "props": r"""interface FloatingLinesProps {
  /** Line count (default: 12) */
  lineCount?: number;
  /** Line color */
  color?: string;
  /** Drift velocity (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous 3D line floating at 60 FPS.",
        "math": r"""For 3D spline line $k$ with control points $[\vec{P}_0, \vec{P}_1, \vec{P}_2, \vec{P}_3]$:
$$\vec{P}_j(t) = \vec{P}_{0,j} + \vec{A}_j \sin(\vec{\omega}_j t + \vec{\phi}_j)$$
Perspective projection to 2D screen coordinates:
$$x_s = \frac{x \cdot d}{z + d}, \quad y_s = \frac{y \cdot d}{z + d}$$""",
        "interaction": "Mouse movement rotates the 3D viewing angle of the floating lines.",
        "implementation": r"""1. Canvas 2D Splines: Draw smooth cubic Bézier curves through projected points.
2. Depth Fading: Line alpha scales proportionally with Z depth.
3. Clean Loop: Single RAF loop updating control points.
4. Lightweight: $<1\%$ CPU utilization.""",
        "modularity": "Organized into `FloatingLines.tsx` (<110 LoC) and `lineMath.ts` (<60 LoC)."
    },
    {
        "id": "side-rays",
        "name": "Side Rays",
        "category": "Backgrounds",
        "overview": "Side Rays casts dramatic diagonal volumetric god rays and sunbeams streaming in from the corner or side edge of the viewport.",
        "props": r"""interface SideRaysProps {
  /** Ray origin corner (default: 'top-left') */
  origin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Ray color (default: 'rgba(255, 255, 255, 0.15)') */
  color?: string;
  /** Number of discrete rays (default: 8) */
  rayCount?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Volumetric ray angles rotate and breathe gently over period $T = 8.0\text{s}$.",
        "math": r"""For ray $k \in [0, N-1]$ originating from $(X_0, Y_0)$:
Ray angle $\theta_k(t)$:
$$\theta_k(t) = \theta_0 + k \cdot \Delta\theta + A \sin(\omega t + k \phi)$$
Ray cone polygon:
$$\text{polygon} = [(X_0, Y_0), \ (X_0 + R \cos(\theta_k - w/2), Y_0 + R \sin(\theta_k - w/2)), \ (X_0 + R \cos(\theta_k + w/2), Y_0 + R \sin(\theta_k + w/2))]$$""",
        "interaction": "Pointer coordinates attract and aim the primary spotlight sunbeam.",
        "implementation": r"""1. SVG / Canvas Cones: Render radial fan of translucent linear-gradient polygons.
2. Blend Mode: `mix-blend-mode: screen` for realistic volumetric light stacking.
3. Soft Edge Blur: Container with `filter: blur(16px)`.
4. Tailwind Integration: Pure utility classes with CSS variables.""",
        "modularity": "Decompose into `SideRays.tsx` (<110 LoC) and `sideRayStyles.ts` (<50 LoC)."
    },
    {
        "id": "light-rays",
        "name": "Light Rays",
        "category": "Backgrounds",
        "overview": "Light Rays renders animated 3D volumetric god rays radiating outward from a central focal sun/portal with dust motes and atmospheric haze.",
        "props": r"""interface LightRaysProps {
  /** Ray count (default: 16) */
  rayCount?: number;
  /** Ray color */
  color?: string;
  /** Rotation speed (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous rotational sweep over period $T = 20\text{s}$.",
        "math": r"""Ray angle $\theta_k(t) = \left(\frac{2\pi k}{N} + \omega t\right) \bmod 2\pi$.
Conic Gradient Approximation:
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg}, \text{repeating stops of } C_{ray} \text{ and transparent})$$""",
        "interaction": "Mouse movement shifts the central ray origin point with parallax.",
        "implementation": r"""1. Conic Gradient Disk: CSS `conic-gradient` with radial fade mask.
2. GPU Keyframe Spin: Animate transform `rotate(360deg)` via CSS keyframes.
3. Blur Bloom: Outer wrapper with `backdrop-filter` or `filter: blur(24px)`.
4. Zero JavaScript Overhead: Driven entirely by pure CSS animations.""",
        "modularity": "Organized into `LightRays.tsx` (<100 LoC) and `rayStyles.ts` (<40 LoC)."
    },
    {
        "id": "pixel-blast",
        "name": "Pixel Blast",
        "category": "Backgrounds",
        "overview": "Pixel Blast renders a retro pixel art starburst explosion background where pixel clusters detonate and disperse radially across the screen.",
        "props": r"""interface PixelBlastProps {
  /** Particle pixel count (default: 120) */
  particleCount?: number;
  /** Pixel block size in pixels (default: 6) */
  pixelSize?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Burst cycles every $4.0\text{s}$ with explosive initial velocity and quadratic deceleration.",
        "math": r"""For pixel $k \in [0, N-1]$ at time $\tau \in [0, 1]$:
$$r_k(\tau) = R_{max} \cdot (1 - (1 - \tau)^3) \cdot v_k$$
$$x_k(\tau) = X_0 + r_k(\tau) \cos\theta_k, \quad y_k(\tau) = Y_0 + r_k(\tau) \sin\theta_k$$
$$\alpha_k(\tau) = 1 - \tau^2$$""",
        "interaction": "Clicking anywhere on screen detonates a new pixel blast from the click coordinates.",
        "implementation": r"""1. Canvas 2D Pixel Buffer: Batch draw square pixels with `ctx.fillRect()`.
2. Particle Emitter Pool: Reusable array of pixel objects.
3. Retro Color Cycling: 8-bit palette cycling.
4. Auto Sleeping: Pauses loop when particles fade.""",
        "modularity": "Decompose into `PixelBlast.tsx` (<120 LoC) and `BlastEngine.ts` (<110 LoC)."
    },
    {
        "id": "color-bends",
        "name": "Color Bends",
        "category": "Backgrounds",
        "overview": "Color Bends renders chromatic ribbon waves that bend and warp through space with holographic prismatic colors and smooth bezier paths.",
        "props": r"""interface ColorBendsProps {
  /** Ribbon band count (default: 8) */
  bands?: number;
  /** Animation speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous chromatic wave phasing at 60 FPS.",
        "math": r"""Ribbon spine curve $y(x, t) = \sum_{m=1}^3 A_m \sin(k_m x + \omega_m t)$.
Color stop gradient:
$$\text{Color}(k) = \text{hsl}\left(\frac{k}{N} \cdot 360^\circ + \omega t, \ 80\%, \ 60\%\right)$$""",
        "interaction": "Mouse drag bends ribbon paths dynamically.",
        "implementation": r"""1. Canvas 2D / SVG: Multi-layer spline ribbons.
2. Prismatic Blending: `globalCompositeOperation: 'screen'`.
3. Auto Resize: Dynamically matches viewport width.
4. High Performance: Low-poly spline evaluation.""",
        "modularity": "Organized into `ColorBends.tsx` (<110 LoC) and `bendMath.ts` (<50 LoC)."
    },
    {
        "id": "evil-eye",
        "name": "Evil Eye",
        "category": "Backgrounds",
        "overview": "Evil Eye renders a mystical talismanic eye background with pupil dilation, iris ripples, and protective concentric aura rings tracking the cursor.",
        "props": r"""interface EvilEyeProps {
  /** Eye radius in pixels (default: 140) */
  eyeRadius?: number;
  /** Iris color */
  irisColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Pupil tracking responds at 60/120 FPS via lerp. Eyelid blink triggers sporadically every $4\text{s}$ ($200\text{ms}$).",
        "math": r"""Pupil offset vector $(\Delta x_p, \Delta y_p)$ tracking cursor $(x_c, y_c)$:
$$\vec{d} = (x_c - X_0, \ y_c - Y_0), \quad r = \|\vec{d}\|$$
$$(\Delta x_p, \Delta y_p) = \frac{\vec{d}}{r} \cdot \min(r \cdot 0.2, \ R_{iris} - R_{pupil})$$
Eyelid clip path on blink:
$$\text{clip-path: ellipse}(W/2 \ (H/2 \cdot (1 - \text{blinkProgress}))\text{ at } 50\%\ 50\%)$$""",
        "interaction": "Eye pupil follows pointer movement across the entire screen.",
        "implementation": r"""1. SVG Eye Hierarchy: Outer sclera + iris ring + pupil + eyelid clip path.
2. Pupil Lerp: Smooth position interpolation in RAF loop.
3. Blink Scheduler: Randomized `setTimeout` triggering CSS keyframe blink.
4. Ambient Aura: Concentric pulsating SVG rings.""",
        "modularity": "Decompose into `EvilEye.tsx` (<120 LoC) and `eyeStyles.ts` (<50 LoC)."
    },
    {
        "id": "line-waves",
        "name": "Line Waves",
        "category": "Backgrounds",
        "overview": "Line Waves renders a sleek array of horizontal vector lines that ripple with traveling sine wave crests and mouse displacement.",
        "props": r"""interface LineWavesProps {
  /** Line count (default: 24) */
  lineCount?: number;
  /** Line stroke color */
  lineColor?: string;
  /** Wave amplitude in pixels (default: 30) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous wave propagation at 60 FPS.",
        "math": r"""For line $k \in [0, N-1]$ at vertical base $y_k$:
$$y_k(x, t) = y_k + A \sin\left(\frac{2\pi x}{\lambda} + \omega t + k \phi\right) + \Delta y_{mouse}(x)$$""",
        "interaction": "Mouse cursor acts as a wave ripple generator across adjacent lines.",
        "implementation": r"""1. Canvas 2D Splines: Batch draw path segments with `ctx.lineTo()`.
2. Responsive Lines: Scales line spacing based on container height.
3. GPU Composite: Single RAF render pass.
4. Zero Memory Churn: Reuses coordinate arrays.""",
        "modularity": "Organized into `LineWaves.tsx` (<110 LoC) and `waveLineMath.ts` (<50 LoC)."
    },
    {
        "id": "radar",
        "name": "Radar",
        "category": "Backgrounds",
        "overview": "Radar renders a circular tactical radar sweep with concentric range rings, rotating sweep line, fading blips, and HUD grid readouts.",
        "props": r"""interface RadarProps {
  /** Radar diameter in pixels (default: 400) */
  size?: number;
  /** Sweep rotation period in seconds (default: 4s) */
  speed?: number;
  /** Radar green / cyan stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous $360^\circ$ radar sweep over period $T = 4.0\text{s}$. Blips fade over $2.0\text{s}$.",
        "math": r"""Sweep Angle:
$$\theta_{sweep}(t) = \left(\frac{2\pi t}{T}\right) \bmod 2\pi$$
Blip Detection Condition for target at angle $\theta_{blip}$:
$$\Delta\theta = (\theta_{sweep}(t) - \theta_{blip}) \bmod 2\pi$$
$$\alpha_{blip}(t) = \exp\left(-\frac{\Delta\theta}{\tau_{decay}}\right)$$""",
        "interaction": "Clicking radar spawns interactive blips that illuminate on subsequent sweeps.",
        "implementation": r"""1. Canvas 2D / SVG: Concentric range rings + crosshairs + sweep line.
2. Conic Sweep Sector: Conic gradient sector fading from $100\%$ to $0\%$ opacity behind sweep line.
3. Blip Array: Store active target coordinates and activation timestamps.
4. Pure Native Canvas: Zero external libraries.""",
        "modularity": "Decompose into `Radar.tsx` (<120 LoC) and `RadarEngine.ts` (<120 LoC)."
    },
    {
        "id": "soft-aurora",
        "name": "Soft Aurora",
        "category": "Backgrounds",
        "overview": "Soft Aurora renders gentle, pastel Northern Lights curtains that drift and glow with ambient Gaussian blur and gradient hues.",
        "props": r"""interface SoftAuroraProps {
  /** Aurora color stops (e.g. emerald, violet, cyan) */
  colors?: string[];
  /** Drift velocity speed (default: 0.8) */
  speed?: number;
  /** Blur intensity in pixels (default: 80) */
  blurRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous ambient color drift with slow harmonic periods ($T \in [8\text{s}, 16\text{s}]$).",
        "math": r"""Aurora Curtain Heightfield $Y(x, t)$:
$$Y(x, t) = Y_0 + \sum_{k=1}^3 A_k \sin(f_k x + \omega_k t)$$
Multi-stop gradient blending:
$$C(x, y, t) = \text{lerp}(C_1, C_2, 0.5 + 0.5 \sin(\omega t))$$""",
        "interaction": "Mouse cursor shifts ambient aurora color temperature.",
        "implementation": r"""1. SVG Blob Mesh: Render organic gradient polygons with `filter: blur(80px)`.
2. GPU Transforms: Animate `translate3d` and `scale` with CSS keyframes.
3. Background Blend: `mix-blend-mode: hard-light` or `screen`.
4. High Performance: Zero repaint cost on composite layer.""",
        "modularity": "Organized into `SoftAurora.tsx` (<110 LoC) and `auroraStyles.ts` (<50 LoC)."
    },
    {
        "id": "aurora",
        "name": "Aurora",
        "category": "Backgrounds",
        "overview": "Aurora renders vibrant, high-intensity Northern Lights with dynamic ray curtains, solar wind ripples, and shimmering polar sky colors.",
        "props": r"""interface AuroraProps {
  /** Primary aurora colors (default: ['#00ff87', '#60efff', '#ff007f']) */
  colors?: string[];
  /** Aurora wave amplitude (default: 80) */
  amplitude?: number;
  /** Speed of solar wind (default: 1.2) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Solar wind wave cycle runs continuously at 60 FPS.",
        "math": r"""Aurora Ray Intensity $I(x, y, t)$:
$$I(x, y, t) = \sum_{k=0}^2 \frac{1}{2^k} \text{simplex}(2^k x \cdot f + \omega t, \ 2^k y \cdot f) \cdot \exp\left(-\frac{(y - Y_{aurora}(x))^2}{2\sigma^2}\right)$$""",
        "interaction": "Mouse interaction creates electromagnetic flares in aurora curtains.",
        "implementation": r"""1. WebGL Fragment Shader: Raymarched aurora curtain density with atmospheric scattering.
2. Canvas 2D Fallback: Multi-layer sine ribbons with heavy vertical blur.
3. Color Lookup Texture: Seamless palette cycling.
4. Auto Sleep: Pauses when hidden.""",
        "modularity": "Decompose into `Aurora.tsx` (<120 LoC), `AuroraShader.ts` (<130 LoC), and `auroraMath.ts` (<50 LoC)."
    },
    {
        "id": "plasma",
        "name": "Plasma",
        "category": "Backgrounds",
        "overview": "Plasma renders a classic demoscene procedural plasma effect with swirling trigonometric color fields, RGB cycling, and interference patterns.",
        "props": r"""interface PlasmaProps {
  /** Color cycle speed (default: 1.0) */
  speed?: number;
  /** Plasma wave frequency scale (default: 0.02) */
  scale?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous plasma color cycling at 60 FPS.",
        "math": r"""Classic Demoscene Plasma Equation $P(x, y, t)$:
$$v_1 = \sin\left(\frac{x}{16} + t\right), \quad v_2 = \sin\left(\frac{y}{8} + t\right)$$
$$v_3 = \sin\left(\frac{x + y}{16} + t\right), \quad v_4 = \sin\left(\sqrt{x^2 + y^2} \cdot 0.05 + 1.5 t\right)$$
$$P(x, y, t) = \frac{v_1 + v_2 + v_3 + v_4}{4}$$
Color mapping:
$$R = \sin(P \pi), \quad G = \sin(P \pi + 2\pi/3), \quad B = \sin(P \pi + 4\pi/3)$$""",
        "interaction": "Mouse pointer creates an additional circular distortion ripple.",
        "implementation": r"""1. WebGL Fragment Shader / Canvas 2D: Calculates plasma equation per pixel.
2. Low-Resolution Render Target: Renders at $160 \times 100$ and upscales with bilinear filtering.
3. Fast Trig Lookups: Precomputed sine lookup tables on CPU if using Canvas 2D.
4. Low CPU: $<2\%$ utilization on modern hardware.""",
        "modularity": "Organized into `Plasma.tsx` (<110 LoC), `PlasmaShader.ts` (<120 LoC), and `plasmaMath.ts` (<50 LoC)."
    },
    {
        "id": "plasma-wave",
        "name": "Plasma Wave",
        "category": "Backgrounds",
        "overview": "Plasma Wave combines trigonometric plasma formulas with directional traveling wave packets and iridescent metallic sheen.",
        "props": r"""interface PlasmaWaveProps {
  /** Wave packet speed (default: 1.0) */
  speed?: number;
  /** Wave amplitude (default: 50) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Traveling wave packets cycle continuously at 60 FPS.",
        "math": r"""2D Traveling Wave Equation:
$$\Psi(x, y, t) = A_1 \sin(k_x x + k_y y - \omega t) \cdot \cos(k_x x - k_y y + 0.5 \omega t)$$""",
        "interaction": "Mouse coordinates modulate wave propagation direction.",
        "implementation": r"""1. WebGL / Canvas 2D: Fragment shader computing wave superposition.
2. Iridescent Palette: Multi-stop color LUT.
3. Auto Scaled Viewport: Full container coverage.
4. Clean Disposal: WebGL context teardown on unmount.""",
        "modularity": "Decompose into `PlasmaWave.tsx` (<110 LoC) and `plasmaWaveShaders.ts` (<110 LoC)."
    },
    {
        "id": "particles",
        "name": "Particles",
        "category": "Backgrounds",
        "overview": "Particles renders an ambient field of floating stardust particles with Brownian motion, cursor repulsion, and connection links.",
        "props": r"""interface ParticlesProps {
  /** Particle count (default: 80) */
  count?: number;
  /** Particle color (default: '#ffffff') */
  color?: string;
  /** Max speed (default: 0.8) */
  maxSpeed?: number;
  /** Enable mouse repulsion (default: true) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Autonomous particle physics at 60 FPS.",
        "math": r"""For particle $i$ with position $\vec{p}_i$ and cursor $\vec{p}_c$:
$$\vec{p}_i(t + \Delta t) = \vec{p}_i(t) + \vec{v}_i \Delta t + \vec{F}_{rep}$$
$$\vec{F}_{rep} = \begin{cases} \frac{\vec{p}_i - \vec{p}_c}{\|\vec{p}_i - \vec{p}_c\|^2} \cdot G & \text{if } \|\vec{p}_i - \vec{p}_c\| < R \\ \vec{0} & \text{otherwise} \end{cases}$$""",
        "interaction": "Mouse repels nearby particles; clicking shoots an explosive radial shockwave.",
        "implementation": r"""1. Canvas 2D Rendering: Single canvas layer with flat coordinate arrays.
2. Particle Pool: Reusable particle buffer.
3. Device Pixel Ratio: Auto-scaled to device resolution.
4. Auto Sleep: Pauses RAF loop when tab is hidden.""",
        "modularity": "Organized into `Particles.tsx` (<120 LoC), `ParticleEngine.ts` (<120 LoC), and `particleTypes.ts` (<40 LoC)."
    },
    {
        "id": "gradient-blinds",
        "name": "Gradient Blinds",
        "category": "Backgrounds",
        "overview": "Gradient Blinds renders vertical or horizontal Venetian blinds with staggered gradient fills that rotate and flip to reveal new color states.",
        "props": r"""interface GradientBlindsProps {
  /** Number of blind slats (default: 16) */
  slatCount?: number;
  /** Slat rotation angle in degrees (default: 45) */
  angle?: number;
  /** Color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Slats rotate in $600\text{ms}$ with staggered offsets ($30\text{ms}$).",
        "math": r"""For blind slat $k \in [0, N-1]$:
Rotation angle:
$$\theta_k(t) = \theta_0 + \theta_{max} \cdot f(\tau_k)$$
where $\tau_k = \text{clamp}\left(\frac{t - k \cdot \text{stagger}}{T}, 0, 1\right)$.""",
        "interaction": "Mouse movement across blinds rotates individual slats dynamically.",
        "implementation": r"""1. DOM Slat Strips: Flex container with $N$ slats with `transform-style: preserve-3d`.
2. CSS 3D Transforms: `rotateX` / `rotateY` with perspective.
3. Gradient Backgrounds: Multi-stop linear gradients on front and back faces.
4. Tailwind Integration: Pure Tailwind CSS classes.""",
        "modularity": "Decompose into `GradientBlinds.tsx` (<110 LoC) and `blindStyles.ts` (<50 LoC)."
    },
    {
        "id": "grainient",
        "name": "Grainient",
        "category": "Backgrounds",
        "overview": "Grainient blends high-grain textured film static into vibrant fluid multi-color ambient mesh gradients.",
        "props": r"""interface GrainientProps {
  /** Array of mesh gradient colors */
  colors?: string[];
  /** Grain noise intensity [0..1] (default: 0.12) */
  grainIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Mesh gradients drift over period $T = 10\text{s}$. Grain static jitters at 24 FPS.",
        "math": r"""Mesh gradient color interpolation:
$$C(x, y) = \sum_{k=1}^4 w_k(x, y) \cdot C_k, \quad w_k(x, y) = \exp\left(-\frac{\|\vec{p} - \vec{P}_k\|^2}{2\sigma^2}\right)$$
Grain modulation:
$$C_{final}(x, y) = C(x, y) \cdot (1 + \text{noise}(x, y) \cdot I_{grain})$$""",
        "interaction": "Pointer position pulls the center anchor of the color mesh.",
        "implementation": r"""1. CSS Radial Mesh: Multiple overlapping absolute radial gradient blobs.
2. SVG Grain Overlay: Inline SVG `<filter id=\"grain\"><feTurbulence\">` with `mix-blend-mode: overlay`.
3. GPU Acceleration: Blob motion driven by CSS keyframe transforms.
4. Zero JavaScript Overhead: 100% CSS and SVG implementation.""",
        "modularity": "Organized into `Grainient.tsx` (<100 LoC) and `grainientStyles.ts` (<50 LoC)."
    },
    {
        "id": "grid-scan",
        "name": "Grid Scan",
        "category": "Backgrounds",
        "overview": "Grid Scan renders an isometric or 2D tactical HUD grid with pulsing laser scan waves, coordinate crosshairs, and data packets.",
        "props": r"""interface GridScanProps {
  /** Grid cell spacing in pixels (default: 40) */
  gridSize?: number;
  /** Scan line sweep speed (default: 1.0) */
  speed?: number;
  /** Grid stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous grid scan sweep at 60 FPS.",
        "math": r"""Grid Scan Wavefront:
$$W(x, y, t) = \exp\left(-\frac{(x + y - V t)^2}{2\sigma^2}\right)$$
Grid line illumination:
$$I_{line}(x, y, t) = I_{base} + I_{pulse} \cdot W(x, y, t)$$""",
        "interaction": "Hovering illuminates specific grid coordinates and crosshair lines.",
        "implementation": r"""1. Canvas 2D / SVG Grid: Single canvas drawing grid paths.
2. Wave Gradient: Dynamic linear gradient sweep along diagonal.
3. Coordinate Tooltip: Live mouse grid coordinate readout.
4. Low CPU: Static grid cached into offscreen canvas.""",
        "modularity": "Decompose into `GridScan.tsx` (<120 LoC) and `gridScanMath.ts` (<50 LoC)."
    },
    {
        "id": "beams",
        "name": "Beams",
        "category": "Backgrounds",
        "overview": "Beams renders intersecting diagonal laser light beams that sweep across a dark grid with glowing particle sparks at intersection points.",
        "props": r"""interface BeamsProps {
  /** Beam count (default: 8) */
  beamCount?: number;
  /** Beam color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous beam circulation over period $T = 6.0\text{s}$.",
        "math": r"""For beam $k$ with trajectory line $\vec{L}_k(t)$:
Beam position:
$$\vec{p}_k(t) = \vec{P}_{0,k} + \vec{v}_k t$$
Intersection spark condition for beams $(i, j)$:
$$\vec{P}_{int} = \vec{L}_i \cap \vec{L}_j$$""",
        "interaction": "Mouse cursor acts as an optical beam splitter, refracting beams into new angles.",
        "implementation": r"""1. Canvas 2D / SVG Paths: Render linear laser beam strokes with glow drop-shadow.
2. Spark Emitters: Spawn particle sparks when beams cross.
3. Additive Blending: `globalCompositeOperation: 'lighter'`.
4. High Performance: Low particle count with strict memory pooling.""",
        "modularity": "Organized into `Beams.tsx` (<120 LoC), `BeamEngine.ts` (<120 LoC), and `beamMath.ts` (<50 LoC)."
    },
    {
        "id": "pixel-snow",
        "name": "Pixel Snow",
        "category": "Backgrounds",
        "overview": "Pixel Snow renders a peaceful retro 8-bit snowfall with square pixel snowflakes drifting, fluttering with wind turbulence, and accumulating on boundaries.",
        "props": r"""interface PixelSnowProps {
  /** Snowflake count (default: 100) */
  flakeCount?: number;
  /** Snowflake size in pixels (default: 4) */
  flakeSize?: number;
  /** Fall speed (default: 60) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous snowfall at 60 FPS with harmonic wind fluttering.",
        "math": r"""For snowflake $k$:
$$y_k(t) = (y_{0,k} + V_y \cdot t) \bmod H$$
$$x_k(t) = x_{0,k} + A \sin(\omega t + \phi_k) + V_{wind}(t)$$""",
        "interaction": "Mouse movement generates localized wind gusts, blowing snow particles.",
        "implementation": r"""1. Canvas 2D Rendering: Batch draw square pixels with `ctx.fillRect()`.
2. Particle Array: Flat `Float32Array` holding snowflake states.
3. Wind Turbulence: Global wind vector modulated by mouse velocity.
4. Auto Resize: Adapts particle count to screen dimensions.""",
        "modularity": "Decompose into `PixelSnow.tsx` (<110 LoC) and `SnowEngine.ts` (<110 LoC)."
    },
    {
        "id": "lightning",
        "name": "Lightning",
        "category": "Backgrounds",
        "overview": "Lightning renders procedural branching electric lightning bolts that strike and flash across a dark storm background with intense neon luminance.",
        "props": r"""interface LightningProps {
  /** Bolt color (default: '#00f0ff') */
  boltColor?: string;
  /** Strike frequency interval in seconds (default: 3s) */
  strikeInterval?: number;
  /** Branching recursion depth (default: 4) */
  branchDepth?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Lightning flash lasts $150\text{ms}$ to $300\text{ms}$ with micro-flickers. Strikes occur at randomized intervals.",
        "math": r"""Midpoint Displacement Fractal Lightning between $\vec{A}$ and $\vec{B}$:
$$\vec{M} = \frac{\vec{A} + \vec{B}}{2} + \vec{n} \cdot \text{rand}(-D, D)$$
where $\vec{n} \perp (\vec{B} - \vec{A})$ and displacement $D$ decays by factor $0.5$ per recursion level.
Flash background illumination:
$$\alpha_{flash}(t) = \exp(-t / \tau_{decay}) \cdot (1 + \text{flicker})$$""",
        "interaction": "Clicking screen triggers an immediate lightning strike targeted at click coordinates.",
        "implementation": r"""1. Midpoint Subdivision Engine: Recursive fractal generator building segment array.
2. Multi-Layer Glow: Draw core white bolt + cyan outer glow + ambient screen flash.
3. Sound Sync: Optional audio strike trigger hook.
4. Low CPU: Canvas sleeps between strikes.""",
        "modularity": "Organized into `Lightning.tsx` (<120 LoC), `LightningGenerator.ts` (<130 LoC), and `lightningMath.ts` (<50 LoC)."
    },
    {
        "id": "prismatic-burst",
        "name": "Prismatic Burst",
        "category": "Backgrounds",
        "overview": "Prismatic Burst renders expanding geometric rainbow bursts, prismatic light flares, and kaleidoscope refraction patterns radiating from the center.",
        "props": r"""interface PrismaticBurstProps {
  /** Prism burst ray count (default: 24) */
  rayCount?: number;
  /** Expansion speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous kaleidoscope rotation and radial expansion at 60 FPS.",
        "math": r"""Kaleidoscope Fold Angle $\theta_k = \frac{\pi}{N_{folds}}$:
$$\theta' = |\text{mod}(\theta, 2\theta_k) - \theta_k|$$
Prismatic color stop mapping:
$$C(r, \theta') = \text{hsl}(r \cdot 360^\circ / R_{max} + \omega t, \ 90\%, \ 60\%)$$""",
        "interaction": "Mouse drag rotates the kaleidoscope prism symmetry axes.",
        "implementation": r"""1. WebGL / Canvas 2D: Renders radial fan of symmetric triangle facets.
2. Additive Blend: High luminosity screen blending.
3. Auto Scaled Viewport: Full screen responsiveness.
4. Lightweight Loop: Low-poly mathematical rendering.""",
        "modularity": "Decompose into `PrismaticBurst.tsx` (<110 LoC) and `burstMath.ts` (<60 LoC)."
    },
    {
        "id": "galaxy",
        "name": "Galaxy",
        "category": "Backgrounds",
        "overview": "Galaxy renders a spiral galaxy with thousands of star particles orbiting in logarithmic spiral arms, central galactic core glow, and 3D tilt.",
        "props": r"""interface GalaxyProps {
  /** Star particle count (default: 1000) */
  particleCount?: number;
  /** Number of spiral arms (default: 3) */
  spiralArms?: number;
  /** Galaxy core color */
  coreColor?: string;
  /** Arm star color */
  armColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous differential galaxy rotation at 60 FPS.",
        "math": r"""Logarithmic Spiral Arm Coordinates for star $i$ on arm $a \in [0, K-1]$:
$$r_i = R_{max} \cdot u_i^{0.5}, \quad \theta_i = r_i \cdot b + \frac{2\pi a}{K} + \text{rand}(-\sigma_\theta, \sigma_\theta)$$
Orbital Velocity (Differential Keplerian / Flat rotation curve):
$$v_\theta(r) = \frac{V_0}{1 + r / R_c}$$
$$x_i(t) = r_i \cos(\theta_i + \omega(r_i) t), \quad y_i(t) = r_i \sin(\theta_i + \omega(r_i) t)$$""",
        "interaction": "Mouse drag tilts the 3D spiral galaxy plane in space.",
        "implementation": r"""1. WebGL Point Cloud / Canvas 2D: Render instanced point sprites with additive blending.
2. Density Texture: Galactic core rendered with soft glowing radial sprite.
3. 3D Perspective Projection: Perspective camera matrix applied to star coordinates.
4. High Performance: $1000+$ stars rendered at 60 FPS smoothly.""",
        "modularity": "Organized into `Galaxy.tsx` (<120 LoC), `GalaxyEngine.ts` (<140 LoC), and `galaxyMath.ts` (<60 LoC)."
    },
    {
        "id": "dither",
        "name": "Dither",
        "category": "Backgrounds",
        "overview": "Dither applies ordered 8x8 Bayer matrix dithering, retro palette quantization, and monochrome 1-bit pixel shading to underlying graphics.",
        "props": r"""interface DitherProps {
  /** Bayer matrix size (default: 4 for 4x4, 8 for 8x8) */
  matrixSize?: 4 | 8;
  /** Color palette preset (default: 'monochrome') */
  palette?: 'monochrome' | 'gameboy' | 'cga' | 'cyberpunk';
  /** Pixel block size in pixels (default: 2) */
  pixelSize?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Real-time post-processing filter running at 60 FPS.",
        "math": r"""Normalized $4 \times 4$ Bayer Matrix $M_4$:
$$M_4 = \frac{1}{16} \begin{pmatrix} 0 & 8 & 2 & 10 \\ 12 & 4 & 14 & 6 \\ 3 & 11 & 1 & 9 \\ 15 & 7 & 13 & 5 \end{pmatrix}$$
Threshold comparison for pixel $(x, y)$ with luminance $L(x, y) \in [0, 1]$:
$$L_{dither} = L(x, y) + (M[x \bmod N, \ y \bmod N] - 0.5) \cdot \text{spread}$$
$$\text{Color} = \arg\min_{C \in \text{palette}} \|C - L_{dither}\|$$""",
        "interaction": "Mouse position can adjust dither contrast threshold dynamically.",
        "implementation": r"""1. WebGL Fragment Shader: Samples source texture and evaluates Bayer matrix threshold.
2. Palette Texture: 1D palette lookup texture for instantaneous quantization.
3. Pixelation Scale: Integer pixel scaling step to maintain crisp retro aesthetics.
4. CSS Fallback: High-contrast monochrome SVG matrix filter.""",
        "modularity": "Decompose into `Dither.tsx` (<110 LoC), `DitherShader.ts` (<130 LoC), and `ditherPalettes.ts` (<50 LoC)."
    },
    {
        "id": "faulty-terminal",
        "name": "Faulty Terminal",
        "category": "Backgrounds",
        "overview": "Faulty Terminal simulates a malfunctioning retro mainframe CRT monitor with scanlines, horizontal sync tearing, chromatic RGB displacement, and terminal text glitch.",
        "props": r"""interface FaultyTerminalProps {
  /** Terminal phosphor color (default: '#00ff66' for green, '#ffb000' for amber) */
  color?: string;
  /** Glitch burst frequency in seconds (default: 3s) */
  glitchInterval?: number;
  /** CRT scanline intensity (default: 0.3) */
  scanlineIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Scanlines animate at 60 FPS. Sync tear glitches occur sporadically for $100\text{ms}$ to $250\text{ms}$.",
        "math": r"""Horizontal H-Sync Glitch Displacement for slice $y \in [y_1, y_2]$:
$$\Delta x(y) = \text{rand}(-15, 15)\text{px} \cdot \text{isGlitching}$$
Chromatic RGB Split:
$$R(x, y) = I(x + \Delta x + 3, y), \quad G(x, y) = I(x + \Delta x, y), \quad B(x, y) = I(x + \Delta x - 3, y)$$""",
        "interaction": "Clicking terminal triggers manual glitch distortion burst.",
        "implementation": r"""1. WebGL / Canvas Post-Process: Fragment shader applying H-sync tearing and phosphor glow.
2. SVG Scanline Overlay: Repeating scanline pattern with opacity breathing.
3. Sporadic Timer: Randomized `setTimeout` triggering tear slices.
4. Retro Terminal Font: Optional green/amber monospace terminal text layer.""",
        "modularity": "Organized into `FaultyTerminal.tsx` (<120 LoC), `TerminalShader.ts` (<130 LoC), and `terminalStyles.ts` (<50 LoC)."
    },
    {
        "id": "ripple-grid",
        "name": "Ripple Grid",
        "category": "Backgrounds",
        "overview": "Ripple Grid renders an interactive wireframe grid plane that deforms with undulating concentric water ripples when clicked or hovered.",
        "props": r"""interface RippleGridProps {
  /** Grid cell spacing in pixels (default: 30) */
  gridSize?: number;
  /** Ripple propagation speed (default: 1.5) */
  speed?: number;
  /** Wave damping factor (default: 0.96) */
  damping?: number;
  /** Grid stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"2D wave equation solver runs at 60 FPS. Ripple impulses dissipate over $1.5\text{s}$.",
        "math": r"""2D Discrete Wave Grid:
$$h(x, y, t+1) = \left(\frac{h(x-1,y) + h(x+1,y) + h(x,y-1) + h(x,y+1)}{2} - h(x,y,t-1)\right) \cdot d$$
Isometric grid line rendering:
$$x_{iso} = (i - j) \cdot W_{cell}, \quad y_{iso} = (i + j) \cdot H_{cell} - h(i, j)$$""",
        "interaction": "Moving mouse or clicking injects wave energy into grid vertices.",
        "implementation": r"""1. Dual Heightmap Buffers: `Float32Array` buffers ping-ponging wave heights.
2. Canvas 2D Line Drawing: Batch stroke isometric or planar grid lines.
3. Sleep Engine: Deactivates simulation when total kinetic energy $< \epsilon$.
4. Responsive Fit: Adapts grid resolution to screen size.""",
        "modularity": "Decompose into `RippleGrid.tsx` (<120 LoC), `RippleGridEngine.ts` (<130 LoC), and `waveGridMath.ts` (<50 LoC)."
    },
    {
        "id": "dot-field",
        "name": "Dot Field",
        "category": "Backgrounds",
        "overview": "Dot Field renders a 3D perspective field of glowing dot matrix nodes that wave with sinusoidal undulation and react to pointer distance.",
        "props": r"""interface DotFieldProps {
  /** Dot grid columns (default: 30) */
  columns?: number;
  /** Dot grid rows (default: 20) */
  rows?: number;
  /** Dot radius in pixels (default: 2) */
  dotRadius?: number;
  /** Dot color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous 3D wave undulation at 60 FPS.",
        "math": r"""For grid dot $(i, j)$ with rest position $(x_{i,j}, y_{i,j})$:
Elevation wave:
$$z(i, j, t) = A \sin(0.3i + \omega t) \cos(0.3j + \omega t)$$
Perspective Scale:
$$\text{scale}_{i,j} = \frac{d_{cam}}{d_{cam} + z(i, j, t)}$$
Rendered dot radius $R = R_0 \cdot \text{scale}_{i,j}$.
Proximity displacement from mouse:
$$\Delta z = A_{mouse} \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$""",
        "interaction": "Mouse cursor depresses or elevates adjacent 3D dot nodes.",
        "implementation": r"""1. Canvas 2D Points: Draw circular dots with `ctx.arc()` in batch.
2. Perspective Depth Sorting: Render dots from back to front.
3. Variable Opacity: Alpha scales with perspective depth.
4. Auto Resize: Centers dot matrix on window resize.""",
        "modularity": "Organized into `DotField.tsx` (<110 LoC) and `dotFieldMath.ts` (<60 LoC)."
    },
    {
        "id": "dot-grid",
        "name": "Dot Grid",
        "category": "Backgrounds",
        "overview": "Dot Grid renders an interactive planar 2D matrix of dots that illuminate, scale, and displace dynamically as the mouse moves across.",
        "props": r"""interface DotGridProps {
  /** Dot spacing in pixels (default: 24) */
  spacing?: number;
  /** Base dot radius in pixels (default: 1.5) */
  baseRadius?: number;
  /** Max illuminated dot radius in pixels (default: 4) */
  maxRadius?: number;
  /** Active hover color */
  activeColor?: string;
  /** Base inactive color */
  baseColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Dot scaling responds at 60/120 FPS with zero latency. Decay takes $300\text{ms}$.",
        "math": r"""For dot at $(x_k, y_k)$ and mouse $(x_c, y_c)$:
Distance $d_k = \sqrt{(x_k - x_c)^2 + (y_k - y_c)^2}$.
Dot radius:
$$R_k = R_{base} + (R_{max} - R_{base}) \cdot \text{clamp}\left(1 - \frac{d_k}{R_{infl}}, 0, 1\right)^2$$
Color interpolation:
$$C_k = \text{lerpColor}(C_{base}, C_{active}, (R_k - R_{base}) / (R_{max} - R_{base}))$$""",
        "interaction": "Mouse movement lights up an organic radial ripple of enlarged glowing dots.",
        "implementation": r"""1. Canvas 2D Batch Render: Single canvas layer iterating visible grid coordinates.
2. Bounding Box Optimization: Only calculate distances for dots within mouse bounding square.
3. Device Pixel Ratio: Scaled for high-DPI displays.
4. Zero Dependencies: Pure Canvas 2D implementation.""",
        "modularity": "Decompose into `DotGrid.tsx` (<110 LoC) and `dotGridMath.ts` (<50 LoC)."
    },
    {
        "id": "threads",
        "name": "Threads",
        "category": "Backgrounds",
        "overview": "Threads renders a complex woven tapestry of multi-colored glowing threads that vibrate with harmonic resonance and sway with cursor drag.",
        "props": r"""interface ThreadsProps {
  /** Thread count (default: 20) */
  threadCount?: number;
  /** Color palette */
  colors?: string[];
  /** Wave amplitude in pixels (default: 35) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous wave vibration at 60 FPS with harmonic periods.",
        "math": r"""For thread $k \in [0, N-1]$:
$$y_k(x, t) = Y_{0,k} + \sum_{m=1}^3 \frac{A}{m} \sin\left(\frac{2\pi m x}{\lambda_k} + \omega_k t + k \phi\right)$$""",
        "interaction": "Mouse drag plucks adjacent threads like guitar strings, causing high-frequency vibration.",
        "implementation": r"""1. Canvas 2D Splines: Draw smooth cubic Bézier curves.
2. Damped Harmonic Pluck: Spring vibration solver decays plucked thread amplitude over $800\text{ms}$.
3. Luminous Glow: Overlapping translucent threads with screen blend mode.
4. Auto Resize: Responsive viewport scaling.""",
        "modularity": "Organized into `Threads.tsx` (<120 LoC), `ThreadSolver.ts` (<120 LoC), and `threadStyles.ts` (<40 LoC)."
    },
    {
        "id": "hyperspeed",
        "name": "Hyperspeed",
        "category": "Backgrounds",
        "overview": "Hyperspeed renders a high-velocity sci-fi starfield / highway light streak tunnel with relativistic perspective stretching and acceleration.",
        "props": r"""interface HyperspeedProps {
  /** Star / streak particle count (default: 300) */
  count?: number;
  /** Warp travel speed (default: 600) */
  speed?: number;
  /** Light streak color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous high-speed warp drive translation at $V = 600\text{px/s}$.",
        "math": r"""For star $k$ with 3D position $(x_k, y_k, z_k)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{max}$$
Perspective Projection:
$$x_{screen} = \frac{x_k \cdot d}{z_k}, \quad y_{screen} = \frac{y_k \cdot d}{z_k}$$
Relativistic Light Streak:
$$\text{Line from } \left(\frac{x_k d}{z_k + \Delta z}, \ \frac{y_k d}{z_k + \Delta z}\right) \text{ to } (x_{screen}, y_{screen})$$""",
        "interaction": "Mouse coordinates steer the vanishing point of hyperspace star streaks.",
        "implementation": r"""1. Canvas 2D / WebGL: Batch draw streak lines radiating from vanishing point.
2. Z-Wrap Buffer: Star positions recycle to $Z_{max}$ when passing camera plane.
3. Velocity Flare: Accelerate warp speed on mouse down.
4. Low CPU: Highly optimized point projection loop.""",
        "modularity": "Decompose into `Hyperspeed.tsx` (<120 LoC), `WarpEngine.ts` (<130 LoC), and `warpMath.ts` (<50 LoC)."
    },
    {
        "id": "iridescence",
        "name": "Iridescence",
        "category": "Backgrounds",
        "overview": "Iridescence renders a dynamic soap bubble thin-film interference background with shifting rainbow hues, soap bubble swirls, and glossy specular sheen.",
        "props": r"""interface IridescenceProps {
  /** Thin film thickness in nanometers (default: 400) */
  filmThickness?: number;
  /** Color flow speed (default: 0.8) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous thin-film interference color shifting at 60 FPS.",
        "math": r"""Thin-Film Optical Interference for wavelength $\lambda$:
$$2 n d \cos\theta_{refr} = \left(m + \frac{1}{2}\right) \lambda \quad (\text{constructive interference})$$
RGB Reflection Intensities:
$$I_R = \cos^2\left(\frac{2\pi n d}{\lambda_R}\right), \quad I_G = \cos^2\left(\frac{2\pi n d}{\lambda_G}\right), \quad I_B = \cos^2\left(\frac{2\pi n d}{\lambda_B}\right)$$""",
        "interaction": "Mouse drag creates swirling soap film eddies and variable thickness ripples.",
        "implementation": r"""1. WebGL Fragment Shader: Calculates thin-film interference equations per pixel.
2. Simplex Noise Film: Film thickness modulated by low-frequency noise.
3. High Performance: Single full-screen quad shader.
4. CSS Fallback: Animated multi-stop conic gradient.""",
        "modularity": "Organized into `Iridescence.tsx` (<110 LoC), `IridescentShader.ts` (<130 LoC), and `filmMath.ts` (<50 LoC)."
    },
    {
        "id": "waves",
        "name": "Waves",
        "category": "Backgrounds",
        "overview": "Waves renders a multi-layer ocean wave surface with crest foam highlights, realistic water depth shading, and gentle tidal oscillation.",
        "props": r"""interface WavesProps {
  /** Wave layer count (default: 4) */
  layerCount?: number;
  /** Ocean depth color (default: '#0f172a') */
  deepColor?: string;
  /** Surface crest color (default: '#38bdf8') */
  crestColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous ocean wave simulation at 60 FPS.",
        "math": r"""Gerstner Wave Equation for surface point $(x, y)$:
$$x' = x - \sum_{k} \frac{k_x}{k} A_k \sin(\vec{k} \cdot \vec{x} - \omega t)$$
$$y' = y - \sum_{k} \frac{k_y}{k} A_k \sin(\vec{k} \cdot \vec{x} - \omega t)$$
$$z' = \sum_{k} A_k \cos(\vec{k} \cdot \vec{x} - \omega t)$$""",
        "interaction": "Mouse movements create localized surface wakes and splash ripples.",
        "implementation": r"""1. Canvas 2D / WebGL: Draw Gerstner wave polygon surfaces.
2. Depth Gradient: Multi-stage vertical linear gradients for ocean depth.
3. Foam Highlights: White stroke on top wave crest path.
4. Responsive Fit: Adapts seamlessly to all screen sizes.""",
        "modularity": "Decompose into `Waves.tsx` (<120 LoC), `GerstnerWave.ts` (<130 LoC), and `oceanStyles.ts` (<40 LoC)."
    },
    {
        "id": "grid-distortion",
        "name": "Grid Distortion",
        "category": "Backgrounds",
        "overview": "Grid Distortion applies real-time magnetic and gravitational lens warping to an underlying image or video grid based on cursor position.",
        "props": r"""interface GridDistortionProps {
  /** Image URL */
  imageSrc: string;
  /** Grid mesh resolution (default: 32) */
  gridResolution?: number;
  /** Distortion strength (default: 0.3) */
  strength?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Mesh distortion updates in real-time at 60/120 FPS.",
        "math": r"""For mesh vertex $(u, v)$ and mouse $(u_c, v_c)$:
Distance vector $\vec{d} = (u - u_c, \ v - v_c), \ r = \|\vec{d}\|$.
Displaced UV coordinates $(u', v')$:
$$(u', v') = (u, v) + \frac{\vec{d}}{r} \cdot \text{strength} \cdot \exp\left(-\frac{r^2}{2\sigma^2}\right)$$""",
        "interaction": "Moving mouse across image warps and magnifies underlying content like a gravitational lens.",
        "implementation": r"""1. WebGL 2.0 Vertex Grid: Deform vertex positions in vertex shader or texture UVs in fragment shader.
2. Canvas 2D Fallback: Draw triangular mesh with affine texture mapping.
3. Spring Solver: Smoothly rebounds mesh to neutral on mouse leave.
4. Auto Resize: Matches container aspect ratio.""",
        "modularity": "Organized into `GridDistortion.tsx` (<120 LoC), `DistortionShader.ts` (<130 LoC), and `meshMath.ts` (<50 LoC)."
    },
    {
        "id": "ballpit",
        "name": "Ballpit",
        "category": "Backgrounds",
        "overview": "Ballpit creates a playful 2D/3D physics ball pit with hundreds of colorful bouncing sphere particles with gravity, restitution, and pointer repulsion.",
        "props": r"""interface BallpitProps {
  /** Ball sphere count (default: 50) */
  count?: number;
  /** Ball radius in pixels (default: 20) */
  radius?: number;
  /** Ball color palette */
  colors?: string[];
  /** Gravity (default: 980) */
  gravity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Newtonian rigid body physics running at 60 FPS.",
        "math": r"""For sphere $i$ with radius $R_i$, position $\vec{p}_i$, and velocity $\vec{v}_i$:
Gravity:
$$\vec{v}_i(t + \Delta t) = \vec{v}_i(t) + \vec{g} \Delta t$$
Sphere-Sphere Elastic Collision ($d_{ij} < R_i + R_j$):
$$\vec{v}_i' = \vec{v}_i - \frac{2m_j}{m_i + m_j} \frac{\langle \vec{v}_i - \vec{v}_j, \vec{p}_i - \vec{p}_j \rangle}{\|\vec{p}_i - \vec{p}_j\|^2} (\vec{p}_i - \vec{p}_j)$$
Floor Bounce:
$$y_i = H - R_i, \quad v_{y,i} = -e \cdot v_{y,i}$$""",
        "interaction": "Users can stir, toss, and flick bouncing balls with mouse cursor.",
        "implementation": r"""1. 2D Physics Engine: Spatial grid spatial hash for $O(N)$ ball collision checks.
2. Canvas 2D Shaded Circles: Draw 3D radial gradient spheres with specular highlight.
3. Mouse Impulses: Impart velocity when pointer intersects spheres.
4. Auto Sleeping: Pauses simulation when all balls reach rest energy.""",
        "modularity": "Decompose into `Ballpit.tsx` (<120 LoC), `BallpitPhysics.ts` (<150 LoC), and `ballTypes.ts` (<40 LoC)."
    },
    {
        "id": "orb",
        "name": "Orb",
        "category": "Backgrounds",
        "overview": "Orb renders a 3D procedural plasma energy orb with swirling surface noise, glowing electric corona, and mouse-directed orientation.",
        "props": r"""interface OrbProps {
  /** Orb radius in pixels (default: 150) */
  radius?: number;
  /** Core energy color */
  color?: string;
  /** Corona glow intensity (default: 0.8) */
  glowIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous plasma noise rotation at 60 FPS.",
        "math": r"""Raymarched Sphere Surface $(x, y, z)$:
$$x^2 + y^2 + z^2 = R^2 + \text{simplex}(f x, f y, f z + \omega t)$$
Fresnel Corona Glow:
$$I_{corona} = I_0 \cdot (1 - \vec{N} \cdot \vec{V})^3$$""",
        "interaction": "Mouse position rotates the 3D plasma orb and increases corona flares.",
        "implementation": r"""1. WebGL Fragment Shader: Raymarched sphere with 3D noise displacement.
2. Additive Glow Bloom: Multi-pass Gaussian blur on corona halo.
3. Canvas Fallback: Radial gradient circle with rotating SVG turbulence.
4. Auto Sleep: Disables rendering when outside viewport.""",
        "modularity": "Organized into `Orb.tsx` (<120 LoC), `OrbShader.ts` (<140 LoC), and `orbMath.ts` (<50 LoC)."
    },
    {
        "id": "letter-glitch",
        "name": "Letter Glitch",
        "category": "Backgrounds",
        "overview": "Letter Glitch fills the entire background with a dynamic matrix grid of animated ASCII characters and hexadecimal glyphs that glitch and scramble.",
        "props": r"""interface LetterGlitchProps {
  /** Glyph character pool (default: '0123456789ABCDEF$#@%&*') */
  characters?: string;
  /** Grid font size in pixels (default: 14) */
  fontSize?: number;
  /** Glitch update speed in milliseconds (default: 50) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Glyphs scramble at $50\text{ms}$ intervals with sporadic column glitch cascades.",
        "math": r"""For grid cell $(i, j)$ at step $t$:
Glyph selection:
$$G_{i,j}(t) = \begin{cases} \text{charset}[\text{randInt}(N)] & \text{if rand}() < P_{glitch} \\ G_{i,j}(t-1) & \text{otherwise} \end{cases}$$
Pointer proximity luminance:
$$\alpha_{i,j} = \alpha_{base} + \alpha_{boost} \cdot \exp\left(-\frac{d_{i,j}^2}{2\sigma^2}\right)$$""",
        "interaction": "Hovering mouse illuminates adjacent glyphs in vibrant neon colors.",
        "implementation": r"""1. Canvas 2D Monospace Matrix: Draw character grid via `ctx.fillText()`.
2. Glyph State Buffer: `Uint16Array` storing character indices.
3. Proximity Glow: Draw cursor spotlight behind active characters.
4. Responsive Resizing: Recomputes row and column counts on window resize.""",
        "modularity": "Decompose into `LetterGlitch.tsx` (<120 LoC), `GlitchEngine.ts` (<120 LoC), and `glitchTypes.ts` (<40 LoC)."
    },
    {
        "id": "grid-motion",
        "name": "Grid Motion",
        "category": "Backgrounds",
        "overview": "Grid Motion renders high-speed moving 2D/3D grid floor perspective lines, creating an endless retro synthwave highway illusion.",
        "props": r"""interface GridMotionProps {
  /** Grid travel velocity (default: 150) */
  speed?: number;
  /** Grid line color (default: '#ec4899') */
  color?: string;
  /** Horizon height percentage (default: 50) */
  horizonY?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous grid perspective translation at $V = 150\text{px/s}$.",
        "math": r"""Perspective Grid Lines:
Horizontal grid line $k$ depth $z_k(t) = (z_{0,k} - V t) \bmod Z_{max}$.
Screen Y coordinate:
$$y_k(t) = Y_{horizon} + \frac{H_{eye} \cdot d_{cam}}{z_k(t)}$$
Vertical perspective lines radiating from $(X_{vanish}, Y_{horizon})$:
$$x_k(y) = X_{vanish} + (k \cdot W_{spacing}) \cdot \left(\frac{y - Y_{horizon}}{H - Y_{horizon}}\right)$$""",
        "interaction": "Mouse steering shifts horizon vanishing point horizontally.",
        "implementation": r"""1. Canvas 2D / CSS 3D: Batch draw perspective grid lines.
2. Horizon Gradient: Dark synthwave sunset gradient at horizon.
3. Neon Glow: Layered stroke drawing with `globalCompositeOperation: 'screen'`.
4. Lightweight: Pure mathematical rendering with zero memory allocations.""",
        "modularity": "Organized into `GridMotion.tsx` (<120 LoC) and `gridMotionMath.ts` (<50 LoC)."
    },
    {
        "id": "shape-grid",
        "name": "Shape Grid",
        "category": "Backgrounds",
        "overview": "Shape Grid renders a geometric matrix of triangles, hexagons, or diamonds that rotate, scale, and morph dynamically with mouse proximity.",
        "props": r"""interface ShapeGridProps {
  /** Shape geometry (default: 'hexagon') */
  shape?: 'hexagon' | 'triangle' | 'diamond' | 'circle';
  /** Cell spacing in pixels (default: 48) */
  spacing?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Shape rotations update at 60/120 FPS with spring settling ($250\text{ms}$).",
        "math": r"""For shape $(i, j)$ at center $(x_{i,j}, y_{i,j})$:
Distance to mouse $d = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$.
Rotation angle $\theta_{i,j}$:
$$\theta_{i,j} = \theta_0 + \theta_{max} \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$
Hexagon vertex coordinates for radius $R$:
$$V_k = (x_{i,j} + R \cos(k \pi / 3 + \theta), \ y_{i,j} + R \sin(k \pi / 3 + \theta)) \quad \text{for } k \in [0, 5]$$""",
        "interaction": "Moving mouse creates dynamic geometric rotation waves across shapes.",
        "implementation": r"""1. Canvas 2D Batch Polygons: Draw regular polygons using `ctx.lineTo()`.
2. Spatial Partitioning: Optimize distance queries to nearby shapes.
3. Device Pixel Ratio: Sharp vector rendering.
4. Auto Sleeping: Pauses loop when shapes settle.""",
        "modularity": "Decompose into `ShapeGrid.tsx` (<120 LoC) and `shapeGridMath.ts` (<60 LoC)."
    },
    {
        "id": "liquid-chrome",
        "name": "Liquid Chrome",
        "category": "Backgrounds",
        "overview": "Liquid Chrome renders high-gloss fluid mercury and chrome metal pools that reflect panoramic studio environment maps with realistic specular shine.",
        "props": r"""interface LiquidChromeProps {
  /** Reflectivity strength [0..1] (default: 0.9) */
  reflectivity?: number;
  /** Flow viscosity (default: 0.92) */
  viscosity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Fluid Navier-Stokes simulation at 60 FPS.",
        "math": r"""Blinn-Phong Specular Environment Reflection:
$$\vec{R} = \text{reflect}(-\vec{V}, \vec{N})$$
$$C_{chrome} = \text{sampleCubemap}(\vec{R}) + k_s (\vec{N} \cdot \vec{H})^\alpha$$""",
        "interaction": "Pointer drags ripples through the reflective chrome surface.",
        "implementation": r"""1. WebGL Fragment Shader: Real-time normal computation and environment cubemap sampling.
2. Low-Res Fluid FBO: $128 \times 128$ simulation texture.
3. Specular Tone Mapping: High-contrast chrome curve mapping.
4. Clean Teardown: Context disposal on unmount.""",
        "modularity": "Organized into `LiquidChrome.tsx` (<120 LoC), `ChromeShader.ts` (<140 LoC), and `chromeMath.ts` (<50 LoC)."
    },
    {
        "id": "balatro",
        "name": "Balatro",
        "category": "Backgrounds",
        "overview": "Balatro replicates the psychedelic swirling hypnotic card background from Balatro, featuring rotating spiral vortex distortion, CRT scanline overlay, and dynamic palette cycling.",
        "props": r"""interface BalatroProps {
  /** Color palette preset (default: 'spectral-red') */
  palette?: 'spectral-red' | 'cosmic-blue' | 'joker-purple' | 'gold-seal';
  /** Swirl rotation speed (default: 1.0) */
  speed?: number;
  /** Vortex swirl frequency (default: 4.0) */
  swirlFrequency?: number;
  /** CRT scanline overlay (default: true) */
  crtScanlines?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous psychedelic vortex rotation at 60 FPS on WebGL fragment shader.",
        "math": r"""Balatro Swirling Polar Vortex Equation in centered normalized coordinates $(u, v) \in [-1, 1]$:
$$r = \sqrt{u^2 + v^2}, \quad \theta = \arctan2(v, u)$$
Twisted angular coordinate:
$$\theta' = \theta + k_{swirl} \cdot \sin(r \cdot f_{freq} - \omega t)$$
Deformed spatial coordinates:
$$x' = r \cdot \cos(\theta'), \quad y' = r \cdot \sin(\theta')$$
Hypnotic Color Index:
$$I(x', y', t) = \sin(x' \cdot 6.0 + \omega t) \cdot \cos(y' \cdot 6.0 - \omega t)$$
Palette lookup with smooth sine modulation:
$$\text{Color}(I) = \text{paletteLUT}\left(0.5 + 0.5 \cdot I\right)$$
CRT Scanline Function:
$$S(y) = 1.0 - 0.15 \cdot \sin^2(y \cdot \text{resolution}_y \cdot \pi)$$""",
        "interaction": "Mouse cursor acts as a localized vortex attractor, pulling swirl centers and increasing distortion frequency.",
        "implementation": r"""1. WebGL 2.0 Fragment Shader: Full-screen quad evaluating polar swirl and palette LUT in single pass.
2. Palette Swapping: Uniform array `vec3 u_palette[4]` dynamically updated on prop change.
3. CRT Scanline Filter: Fragment shader scanline and vignette pass.
4. Canvas 2D Fallback: Layered rotating spiral canvases with blend modes for non-WebGL environments.""",
        "modularity": "Decompose into `Balatro.tsx` (<120 LoC), `BalatroShader.ts` (<150 LoC), and `balatroPalettes.ts` (<60 LoC)."
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

print(f"Generated {len(ITEMS)} Background prompts in {PROMPTS_DIR}")
