import os

PROMPTS_DIR = r"c:\Projects\karma\prompts\components"
os.makedirs(PROMPTS_DIR, exist_ok=True)

ITEMS = [
    {
        "id": "infinite-spiral",
        "name": "Infinite Spiral",
        "category": "Components",
        "overview": "Infinite Spiral arranges image cards or project nodes in a continuous logarithmic 3D spiral helix that users can scrub, spin, and zoom through infinitely with inertia and depth scaling.",
        "props": r"""interface InfiniteSpiralProps {
  /** Array of items rendered along the spiral */
  items: { id: string | number; title: string; image?: string; link?: string; content?: React.ReactNode }[];
  /** Radius growth factor per revolution (default: 1.2) */
  spiralGrowth?: number;
  /** Vertical pitch height between spiral loops in pixels (default: 300) */
  pitch?: number;
  /** Number of visible items along spiral path (default: 24) */
  visibleCount?: number;
  /** Rotation speed damping factor (default: 0.94) */
  damping?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Inertial scrolling and pointer dragging decelerate via exponential decay with settling time $\approx 800\text{ms}$. Item scale and opacity transitions update per-frame at 60 FPS.",
        "math": r"""Logarithmic Archimedean Spiral in cylindrical coordinates $(r, \theta, z)$:
$$r(\theta) = R_0 \cdot e^{a \theta}, \quad z(\theta) = \frac{\text{pitch}}{2\pi} \cdot \theta$$
Cartesian conversion for card $k$ at continuous spiral angle $\theta_k(t) = \theta_0(t) + k \cdot \Delta\theta$:
$$x_k = r(\theta_k) \cdot \cos(\theta_k), \quad y_k = z(\theta_k), \quad z_k = r(\theta_k) \cdot \sin(\theta_k)$$
3D perspective scale and depth projection:
$$\text{scale}_k = \frac{d_{cam}}{d_{cam} + z_k}, \quad \alpha_k = \text{clamp}\left(1 - \frac{|z_k|}{Z_{max}}, 0, 1\right)$$""",
        "interaction": "Vertical mouse wheel and pointer drag rotate the spiral along its central axis. Clicking any item smoothly animates it to the foreground focal anchor.",
        "implementation": r"""1. Cylindrical 3D Container: `perspective: 1200px; transform-style: preserve-3d`.
2. Dynamic Caching: Maintain index window $[k_{min}, k_{max}]$ around current focus angle to avoid rendering out-of-view items.
3. Transform Matrices: Apply `translate3d(x, y, z) rotateY(theta)` to card elements on composite layer.
4. Touch Gestures: Multi-touch drag and pinch-to-zoom support.""",
        "modularity": "Organized into `InfiniteSpiral.tsx` (<130 LoC), `useSpiralPhysics.ts` (<100 LoC), and `spiralMath.ts` (<70 LoC)."
    },
    {
        "id": "depth-carousel",
        "name": "Depth Carousel",
        "category": "Components",
        "overview": "Depth Carousel renders a 3D cylindrical or hyperbolic carousel where active cards sit in sharp foreground focus while adjacent items recede along depth axes with perspective scaling and dynamic lighting.",
        "props": r"""interface DepthCarouselProps {
  /** Array of carousel items */
  items: React.ReactNode[];
  /** Radius of carousel cylinder in pixels (default: 400) */
  radius?: number;
  /** Card width in pixels (default: 300) */
  cardWidth?: number;
  /** Card height in pixels (default: 400) */
  cardHeight?: number;
  /** Auto-play rotation interval in milliseconds (0 to disable, default: 0) */
  autoPlayInterval?: number;
  /** Active card change callback */
  onIndexChange?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Transitions between active cards execute over $500\text{ms}$ with quintic bezier curve `(0.16, 1, 0.3, 1)`. Inertial drag settles within $450\text{ms}$.",
        "math": r"""For $N$ carousel cards with angular separation $\Delta\theta = \frac{2\pi}{N}$:
Card $i \in [0, N-1]$ angle:
$$\theta_i(t) = \theta_{rot}(t) + i \cdot \Delta\theta$$
3D Transform Matrix:
$$x_i = R \cdot \sin(\theta_i), \quad z_i = R \cdot (\cos(\theta_i) - 1)$$
$$\text{transform: translate3d}(x_i\text{px}, 0, z_i\text{px}) \text{ rotateY}(\theta_i\text{ rad})$$
Card opacity and brightness:
$$\alpha_i = 0.4 + 0.6 \cdot \left(\frac{\cos(\theta_i) + 1}{2}\right)$$
$$\text{filter: brightness}\left(0.5 + 0.5 \cdot \cos(\theta_i)\right)$$""",
        "interaction": "Horizontal drag scrubs carousel angle. Left/Right arrow keys navigate sequentially. Direct clicks select cards.",
        "implementation": r"""1. 3D Stage: Container with `perspective: 1000px; transform-style: preserve-3d`.
2. Inertial Tracker: Pointer tracker computes drag velocity and snaps to nearest $\Delta\theta$ increment.
3. Accessible Nav: Support tab navigation and screen reader live region announcements.
4. Responsive Scale: Adjust radius $R$ and card dimensions based on container width.""",
        "modularity": "Decompose into `DepthCarousel.tsx` (<130 LoC), `useCarouselDrag.ts` (<100 LoC), and `depthCarouselStyles.ts` (<50 LoC)."
    },
    {
        "id": "morph-slider",
        "name": "Morph Slider",
        "category": "Components",
        "overview": "Morph Slider smoothly interpolates geometric SVG clip-paths, morphing backgrounds, and typography between slider slides with liquid organic transitions.",
        "props": r"""interface MorphSliderProps {
  /** Array of slide configurations */
  slides: { id: string; title: string; image: string; description?: string }[];
  /** Transition duration in milliseconds (default: 700) */
  duration?: number;
  /** Morph path style preset (default: 'liquid-blob') */
  morphPreset?: 'liquid-blob' | 'geometric-polygon' | 'curved-wave';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Morphing transition takes $700\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. SVG spline control points animate synchronously.",
        "math": r"""Bézier control point vector interpolation for path $P(t)$:
$$\vec{P}(t) = (1 - f(\tau)) \vec{P}_{from} + f(\tau) \vec{P}_{to}$$
where $\tau = \text{clamp}\left(\frac{t - t_0}{T}, 0, 1\right)$ and $f(\tau) = 3\tau^2 - 2\tau^3$.
Liquid blob radius modulation:
$$R(\theta, t) = R_0 \cdot \left(1 + \sum_{k=2}^4 A_k \sin(k \theta + \phi_k(t))\right)$$""",
        "interaction": "Slide navigation buttons or swipe gestures trigger morph transition. Hovering preview bubbles previews slide.",
        "implementation": r"""1. Morphing SVG ClipPath: Render `<clipPath id=\"morph-clip\"><path d=\"...\">` bound to slide image.
2. WAAPI Path Interpolation: Animate `d` attribute using SMIL or Canvas 2D morph buffer.
3. Staggered Text: Coordinate headline typography unmasking with path expansion.
4. Fallback: Simple crossfade on browsers without path interpolation support.""",
        "modularity": "Organized into `MorphSlider.tsx` (<120 LoC), `useMorphPath.ts` (<100 LoC), and `morphPresets.ts` (<60 LoC)."
    },
    {
        "id": "drift-wall",
        "name": "Drift Wall",
        "category": "Components",
        "overview": "Drift Wall displays a continuous infinite 2D canvas wall of portfolio projects, screenshots, or artwork tiles drifting gently with automated pan, pointer parallax, and smooth dragging.",
        "props": r"""interface DriftWallProps {
  /** Grid items to display across drifting wall */
  items: React.ReactNode[];
  /** Grid column count (default: 6) */
  columns?: number;
  /** Tile width in pixels (default: 280) */
  tileWidth?: number;
  /** Tile height in pixels (default: 200) */
  tileHeight?: number;
  /** Autonomous drift speed in pixels/sec (default: 15) */
  driftSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Autonomous drift runs continuously at 60 FPS. Mouse drag inertia decays over $600\text{ms}$ ($\mu = 0.95$).",
        "math": r"""2D infinite wrap-around coordinate offset $(X(t), Y(t))$:
$$X(t) = (X(t-1) + V_x \Delta t + V_{drag, x}) \bmod W_{grid}$$
$$Y(t) = (Y(t-1) + V_y \Delta t + V_{drag, y}) \bmod H_{grid}$$
Parallax mouse displacement:
$$\vec{\Delta}_{parallax} = \left(\frac{x_{mouse} - W/2}{W} \cdot 40\text{px}, \ \frac{y_{mouse} - H/2}{H} \cdot 40\text{px}\right)$$""",
        "interaction": "Pointer drag pans the 2D infinite wall freely. Hovering over a tile scales it up and brings it to the top z-index.",
        "implementation": r"""1. Virtual 2D Grid: Render $3 \times 3$ grid of repeat blocks to ensure seamless infinite looping.
2. GPU Pan: Apply `transform: translate3d(X, Y, 0)` to grid root wrapper.
3. Memory Optimization: Unmount or hide tiles outside active viewport bounding rectangle.
4. Touch Panning: Native touch drag and multi-touch pinch scaling.""",
        "modularity": "Decompose into `DriftWall.tsx` (<130 LoC), `useInfinitePan.ts` (<110 LoC), and `driftGridMath.ts` (<50 LoC)."
    },
    {
        "id": "accordion-gallery",
        "name": "Accordion Gallery",
        "category": "Components",
        "overview": "Accordion Gallery displays expandable horizontal or vertical card panels that smoothly expand on hover/click while compressing sibling panels with spring physics and high-resolution imagery.",
        "props": r"""interface AccordionGalleryProps {
  /** Array of gallery panels */
  panels: { id: string; title: string; subtitle?: string; image: string; content?: React.ReactNode }[];
  /** Default active panel ID */
  defaultActiveId?: string;
  /** Expansion orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** Expanded panel flex grow ratio (default: 4) */
  activeFlex?: number;
  /** Inactive panel flex grow ratio (default: 1) */
  inactiveFlex?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Panel expansion transitions over $450\text{ms}$ using spring bezier curve `cubic-bezier(0.25, 1, 0.5, 1)`. Image zoom transitions over $600\text{ms}$.",
        "math": r"""For $N$ panels with active index $a$:
Flex grow factor for panel $i \in [0, N-1]$:
$$F_i(t) = \begin{cases} F_{active} & \text{if } i = a \\ F_{inactive} & \text{if } i \ne a \end{cases}$$
Smooth interpolation:
$$w_i(t) = w_i(t-1) + \alpha \cdot (W \cdot \frac{F_i}{\sum F_k} - w_i(t-1))$$
Image pan offset to preserve center alignment:
$$X_{img} = -0.5 \cdot (W_{img} - w_i(t))$$""",
        "interaction": "Clicking or hovering over a panel expands it instantly while collapsing others. Full keyboard arrow navigation.",
        "implementation": r"""1. Flex Container: Outer wrapper with `flex flex-row overflow-hidden`.
2. Transition Classes: Tailwind `transition-[flex] duration-500 ease-out` applied to panel items.
3. Image Containment: `object-cover w-full h-full` with scale transform on active state.
4. Mobile Orientation: Automatically flips to vertical accordion on narrow viewports.""",
        "modularity": "Organized into `AccordionGallery.tsx` (<120 LoC), `AccordionPanel.tsx` (<100 LoC), and `accordionStyles.ts` (<50 LoC)."
    },
    {
        "id": "specular-button",
        "name": "Specular Button",
        "category": "Components",
        "overview": "Specular Button renders a sleek glassmorphic action button with dynamic 3D specular light reflections, glowing border gradients, and physical click depression.",
        "props": r"""interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label or children */
  children: React.ReactNode;
  /** Specular light sheen color (default: 'rgba(255, 255, 255, 0.7)') */
  sheenColor?: string;
  /** Border glow color (default: '#6366f1') */
  glowColor?: string;
  /** Button corner radius in pixels (default: 12) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Specular reflection tracks pointer at 60/120 FPS. Click compression has $120\text{ms}$ ease-out rise and $200\text{ms}$ elastic rebound.",
        "math": r"""Pointer position $(x_c, y_c)$ relative to button rect $(W, H)$:
Normalized coords $u = x_c / W, \ v = y_c / H$.
Specular radial gradient:
$$\text{background} = \text{radial-gradient}(120\text{px at } x_c\text{px } y_c\text{px}, C_{sheen} \ 0\%, \text{transparent } 80\%)$$
Active press transform:
$$\text{transform: scale}(0.96) \text{ translateY}(1\text{px})$$""",
        "interaction": "Smoothly illuminates under cursor. Compresses with tactile feedback on mouse down / space key press.",
        "implementation": r"""1. Layered Button: Base background + specular highlight layer + content text.
2. Pointer Events: Measure `offsetX, offsetY` on `pointermove`.
3. CSS Variables: Update `--mouse-x` and `--mouse-y` inline.
4. Keyboard Access: Visible `:focus-visible` focus ring matching glow color.""",
        "modularity": "Decompose into `SpecularButton.tsx` (<110 LoC) and `specularButtonStyles.ts` (<60 LoC)."
    },
    {
        "id": "option-wheel",
        "name": "Option Wheel",
        "category": "Components",
        "overview": "Option Wheel renders a rotating radial menu / selector wheel with physics inertia, haptic click snapping, center action badge, and directional selection.",
        "props": r"""interface OptionWheelProps {
  /** Array of menu options */
  options: { id: string; label: string; icon?: React.ReactNode }[];
  /** Selected option ID */
  selectedId?: string;
  /** Radius of wheel in pixels (default: 140) */
  radius?: number;
  /** Callback fired when an option is selected */
  onSelect?: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Snaps to selected option angle over $300\text{ms}$ with spring curve `(0.18, 0.9, 0.3, 1)`. Inertial drag settling time $\approx 500\text{ms}$.",
        "math": r"""For $N$ options with angular slice $\Delta\theta = \frac{2\pi}{N}$:
Option $k$ angle:
$$\theta_k = k \cdot \Delta\theta$$
Cartesian coordinates on wheel:
$$x_k = R \cdot \cos(\theta_k + \theta_{rot}), \quad y_k = R \cdot \sin(\theta_k + \theta_{rot})$$
Nearest snap angle index:
$$k_{snap} = \left\lfloor \frac{-\theta_{rot} + \Delta\theta/2}{\Delta\theta} \right\rfloor \bmod N$$""",
        "interaction": "Pointer dragging spins wheel. Wheel snaps cleanly to closest option upon release. Arrow keys rotate wheel step-by-step.",
        "implementation": r"""1. SVG / DOM Circle: Absolute positioned option chips around central pivot.
2. Angular Drag: Calculate `atan2(dy, dx)` deltas on pointer move.
3. Inertial Deceleration: Physics hook applies rotational friction.
4. Screen Reader: Standard radio group ARIA markup (`role=\"radiogroup\"`).""",
        "modularity": "Organized into `OptionWheel.tsx` (<130 LoC), `useWheelPhysics.ts` (<100 LoC), and `wheelMath.ts` (<50 LoC)."
    },
    {
        "id": "curved-input",
        "name": "Curved Input",
        "category": "Components",
        "overview": "Curved Input renders form input fields with dynamic SVG curved borders, floating organic labels, and animated underline waveforms that ripple during typing.",
        "props": r"""interface CurvedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label: string;
  /** Error message string */
  error?: string;
  /** Wave animation amplitude in pixels on focus (default: 4) */
  waveAmplitude?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Focus transition unfolds over $250\text{ms}$. Typing ripples create a $300\text{ms}$ sine wave pulse along bottom border.",
        "math": r"""Bottom curved border SVG path $y(x, t)$ for width $W$:
$$y(x, t) = H + A \cdot \sin\left(\frac{2\pi x}{W} \cdot f + \omega t\right) \cdot e^{-t / \tau}$$
Floating label translation on focus/input:
$$y_{label} = -24\text{px}, \quad \text{scale}_{label} = 0.85$$""",
        "interaction": "Focus activates illuminated border glow and floats label. Typing triggers harmonic wave pulses.",
        "implementation": r"""1. Custom SVG Border: Render `<path>` element beneath `<input>`.
2. Wave Trigger: On `keydown`, start sine wave pulse in `requestAnimationFrame`.
3. Native Form Support: Full keyboard and accessibility compliance.
4. Tailwind Integration: Pure utility classes with SVG stroke styling.""",
        "modularity": "Decompose into `CurvedInput.tsx` (<120 LoC) and `curvedBorderMath.ts` (<60 LoC)."
    },
    {
        "id": "line-sidebar",
        "name": "Line Sidebar",
        "category": "Components",
        "overview": "Line Sidebar renders a minimalist navigation sidebar with an animated indicator pill that slides and morphs smoothly along a vertical vector track following the active route.",
        "props": r"""interface LineSidebarProps {
  /** Navigation items */
  items: { id: string; label: string; icon?: React.ReactNode; href?: string }[];
  /** Active item ID */
  activeId: string;
  /** On item select callback */
  onSelect: (id: string) => void;
  /** Sidebar collapsed state (default: false) */
  collapsed?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Active indicator pill slides between items over $300\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)`. Pill stretches during transit.",
        "math": r"""Indicator pill position $(y_p, h_p)$ interpolates from item $A$ to item $B$:
$$y_p(t) = \text{lerp}(y_A, y_B, f(\tau))$$
Velocity stretch height:
$$h_p(\tau) = H_{base} + |y_B - y_A| \cdot \sin(\pi \tau) \cdot 0.3$$""",
        "interaction": "Clicking any item animates indicator smoothly. Hovering shows preview glow.",
        "implementation": r"""1. Measured Item Bounds: Store `offsetTop` and `offsetHeight` of each nav item.
2. Floating Indicator: Absolutely positioned indicator pill with `transition: transform, height`.
3. Collapsible Mode: Collapse labels smoothly with `overflow-hidden` and opacity transition.
4. ARIA Navigation: Standard `<nav>` element with `aria-current=\"page\"`.""",
        "modularity": "Organized into `LineSidebar.tsx` (<120 LoC), `SidebarItem.tsx` (<90 LoC), and `sidebarStyles.ts` (<50 LoC)."
    },
    {
        "id": "animated-list",
        "name": "Animated List",
        "category": "Components",
        "overview": "Animated List renders dynamic lists where additions, removals, and reorderings animate smoothly with FLIP (First, Last, Invert, Play) layout animations and zero jumpiness.",
        "props": r"""interface AnimatedListProps<T> {
  /** Array of data items */
  items: T[];
  /** Key extractor function */
  keyExtractor: (item: T) => string;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Animation preset (default: 'fade-slide') */
  variant?: 'fade-slide' | 'scale' | 'pop';
  /** Stagger delay in milliseconds (default: 30) */
  stagger?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"FLIP layout reordering animations execute over $350\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Insertions and deletions take $250\text{ms}$.",
        "math": r"""FLIP Technique Equations:
1. First: Record bounding rect $R_{first} = (x_1, y_1)$.
2. Last: Update DOM state, record $R_{last} = (x_2, y_2)$.
3. Invert: Compute delta:
   $$\Delta x = x_1 - x_2, \quad \Delta y = y_1 - y_2$$
   Apply `transform: translate3d(\Delta x, \Delta y, 0)`.
4. Play: Transition transform to `translate3d(0, 0, 0)`.
   $$y(t) = \Delta y \cdot (1 - f(\tau))$$""",
        "interaction": "Smoothly updates when items are added, filtered, or reordered.",
        "implementation": r"""1. FLIP Hook: Custom `useFLIP` hook capturing DOM rects before and after render cycles.
2. WAAPI Keyframes: Animate inverse transforms on composite thread.
3. Exit Animation: Hold exiting DOM elements in temporary exit portal until animation finishes.
4. Zero Dependency: Pure native Web Animations API without Framer Motion.""",
        "modularity": "Decompose into `AnimatedList.tsx` (<120 LoC), `useFLIP.ts` (<100 LoC), and `listVariants.ts` (<50 LoC)."
    },
    {
        "id": "scroll-stack",
        "name": "Scroll Stack",
        "category": "Components",
        "overview": "Scroll Stack pins a sequence of cards into a sticky viewport deck as the user scrolls, scaling down and stacking preceding cards with realistic depth shadows.",
        "props": r"""interface ScrollStackProps {
  /** Array of card elements to stack */
  children: React.ReactNode[];
  /** Scale reduction factor per stacked card (default: 0.05) */
  scaleStep?: number;
  /** Top offset distance between stacked cards in pixels (default: 20) */
  offsetStep?: number;
  /** Sticky top anchor in pixels or CSS value (default: '80px') */
  topOffset?: string | number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous scroll-driven progress mapping without fixed time durations. Spring smoothing prevents scroll jitter.",
        "math": r"""For card $k \in [0, N-1]$ with sticky trigger scroll threshold $Y_k$:
Scroll progress $p_k \in [0, 1]$ after reaching sticky top:
$$p_k = \text{clamp}\left(\frac{Y_{scroll} - Y_k}{H_{card}}, 0, 1\right)$$
Stacked scale:
$$\text{scale}_k = 1 - k \cdot \text{scaleStep} \cdot p_k$$
Top stacking offset:
$$\text{top}_k = \text{topOffset} + k \cdot \text{offsetStep} \cdot p_k$$
Drop shadow darkening:
$$\text{shadowOpacity}_k = k \cdot 0.15 \cdot p_k$$""",
        "interaction": "Scroll binds directly to sticky card stacking. Smooth unstacking when scrolling upward.",
        "implementation": r"""1. CSS Sticky Containers: Each card wrapped in a container with `sticky top-[80px]`.
2. Scroll Progress Observer: Calculate individual card progress relative to viewport.
3. Transform Matrix: Apply `transform: scale(calc(var(--scale)))` on card bodies.
4. Layout Isolation: Content retains independent scrollability if needed.""",
        "modularity": "Organized into `ScrollStack.tsx` (<120 LoC), `ScrollStackCard.tsx` (<90 LoC), and `stackScrollMath.ts` (<50 LoC)."
    },
    {
        "id": "bubble-menu",
        "name": "Bubble Menu",
        "category": "Components",
        "overview": "Bubble Menu renders an expandable floating action menu where radial bubble buttons pop outward with elastic spring physics, staggered delays, and backdrop blur.",
        "props": r"""interface BubbleMenuProps {
  /** Main trigger button icon / content */
  triggerContent: React.ReactNode;
  /** Array of menu item actions */
  items: { id: string; icon: React.ReactNode; label?: string; onClick?: () => void }[];
  /** Radial expansion radius in pixels (default: 90) */
  radius?: number;
  /** Expansion angle arc range [startAngle, endAngle] in degrees (default: [180, 270]) */
  angleRange?: [number, number];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Bubbles pop open over $400\text{ms}$ with spring overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Stagger interval is $30\text{ms}$ per bubble.",
        "math": r"""For $N$ bubbles with angular span $[\theta_1, \theta_2]$:
Bubble $i$ target angle:
$$\theta_i = \theta_1 + i \cdot \frac{\theta_2 - \theta_1}{N - 1}$$
Radial position during expansion progress $\tau_i(t) \in [0, 1]$:
$$f(\tau) = 1 + c_3(\tau - 1)^3 + c_1(\tau - 1)^2 \quad (\text{back ease-out})$$
$$x_i(\tau) = R \cdot \cos(\theta_i) \cdot f(\tau_i)$$
$$y_i(\tau) = R \cdot \sin(\theta_i) \cdot f(\tau_i)$$""",
        "interaction": "Clicking main bubble toggles menu expansion. Hovering over sub-bubbles displays tooltips.",
        "implementation": r"""1. Fixed Floating Wrapper: Positioned in viewport corner with `z-index: 50`.
2. Staggered WAAPI: Animate `transform: translate3d(x, y, 0) scale(1)` with calculated delays.
3. Escape Key Listener: Closes menu automatically when user presses Escape.
4. Click Outside: Closes menu when clicking outside bounding radius.""",
        "modularity": "Decompose into `BubbleMenu.tsx` (<120 LoC), `BubbleItem.tsx` (<90 LoC), and `bubbleMath.ts` (<50 LoC)."
    },
    {
        "id": "magic-bento",
        "name": "Magic Bento",
        "category": "Components",
        "overview": "Magic Bento renders a high-impact Bento grid layout with dynamic spotlight mouse glows, border gradient illumination, and 3D card tilt across modular tiles.",
        "props": r"""interface MagicBentoProps {
  /** Array of bento grid cards */
  cards: { id: string; colSpan?: number; rowSpan?: number; title?: string; content: React.ReactNode }[];
  /** Spotlight glow color (default: 'rgba(99, 102, 241, 0.15)') */
  spotlightColor?: string;
  /** Enable 3D card tilt (default: true) */
  enableTilt?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Spotlight and border illumination track pointer at 60/120 FPS. Hover tilt settles within $250\text{ms}$.",
        "math": r"""For card $k$ with bounding box $(X_k, Y_k, W_k, H_k)$ and pointer $(x_c, y_c)$:
Relative pointer coordinates:
$$u_k = x_c - X_k, \quad v_k = y_c - Y_k$$
Spotlight radial gradient:
$$\text{background} = \text{radial-gradient}(300\text{px at } u_k\text{px } v_k\text{px}, C_{spot}, \text{transparent } 80\%)$$
3D Tilt:
$$\text{rotX} = -\left(\frac{v_k}{H_k} - 0.5\right) \cdot 10^\circ, \quad \text{rotY} = \left(\frac{u_k}{W_k} - 0.5\right) \cdot 10^\circ$$""",
        "interaction": "Moving mouse over the grid illuminates adjacent card borders and spotlights the active card.",
        "implementation": r"""1. CSS Grid Container: Responsive grid with `grid-cols-1 md:grid-cols-3 lg:grid-cols-4`.
2. Global Pointer Listener: Update CSS variables `--mouse-x` and `--mouse-y` across all cards.
3. Border Glow: Dual-layer card with gradient background and `p-[1px]` border mask.
4. Tailwind Integration: Pure Tailwind CSS classes with CSS custom properties.""",
        "modularity": "Organized into `MagicBento.tsx` (<120 LoC), `BentoCard.tsx` (<110 LoC), and `bentoStyles.ts` (<50 LoC)."
    },
    {
        "id": "circular-gallery",
        "name": "Circular Gallery",
        "category": "Components",
        "overview": "Circular Gallery arranges photographic cards or portfolio showcases along a 3D curved spherical ring, allowing users to scroll and drag through items with radial perspective.",
        "props": r"""interface CircularGalleryProps {
  /** Array of gallery images */
  items: { id: string; title: string; image: string }[];
  /** Cylinder radius in pixels (default: 600) */
  radius?: number;
  /** Card width in pixels (default: 240) */
  cardWidth?: number;
  /** Card height in pixels (default: 320) */
  cardHeight?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Drag rotation responds instantly. Momentum scroll decelerates over $700\text{ms}$ ($\mu = 0.94$).",
        "math": r"""For $N$ items with angular separation $\Delta\theta = \frac{2\pi}{N}$:
Item $i$ position:
$$\theta_i(t) = \theta_0(t) + i \cdot \Delta\theta$$
$$\text{transform: rotateY}(\theta_i\text{ rad}) \text{ translateZ}(R\text{px})$$
Depth fog and opacity:
$$\alpha_i = \text{clamp}(\cos(\theta_i), 0, 1)$$""",
        "interaction": "Horizontal dragging spins gallery. Inertia momentum allows free flick navigation.",
        "implementation": r"""1. 3D Scene: `perspective: 1000px; transform-style: preserve-3d; overflow: hidden`.
2. GPU Transforms: Position cards with `rotateY` and `translateZ`.
3. Inertial Hook: Track velocity on pointer up and decay via RAF loop.
4. Touch Swipe: Native touch gesture binding with passive listeners.""",
        "modularity": "Decompose into `CircularGallery.tsx` (<120 LoC), `useGalleryRotation.ts` (<90 LoC), and `galleryMath.ts` (<50 LoC)."
    },
    {
        "id": "reflective-card",
        "name": "Reflective Card",
        "category": "Components",
        "overview": "Reflective Card simulates high-end glassmorphic material reflection with mirror sheen, surface normal refraction, ambient lighting, and interactive 3D rotation.",
        "props": r"""interface ReflectiveCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Reflection intensity [0..1] (default: 0.4) */
  reflectivity?: number;
  /** Glass border color (default: 'rgba(255, 255, 255, 0.2)') */
  borderColor?: string;
  /** Maximum tilt angle in degrees (default: 12) */
  maxTilt?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Pointer tracking interpolates via lerp at 60/120 FPS ($\alpha = 0.15$). Rebounds in $300\text{ms}$ on mouse leave.",
        "math": r"""Surface normal vector $\vec{N}$ from normalized coordinates $(u, v) \in [-1, 1]$:
$$\vec{N} = \frac{(-u \sin\theta_{max}, \ -v \sin\theta_{max}, \ 1)}{\sqrt{u^2 \sin^2\theta_{max} + v^2 \sin^2\theta_{max} + 1}}$$
Fresnel reflection factor:
$$F = F_0 + (1 - F_0)(1 - \vec{N} \cdot \vec{V})^5$$
Linear gradient reflection angle:
$$\phi = \arctan2(v, u) + 90^\circ$$""",
        "interaction": "Tilts in 3D toward mouse. Shimmer reflection traverses card face based on viewing angle.",
        "implementation": r"""1. Glassmorphic Surface: `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.05)`.
2. Specular Sheen: Multi-stop linear gradient overlay with `mix-blend-mode: overlay`.
3. CSS Transforms: Update `--rx`, `--ry` on RAF loop.
4. Mobile Optimization: Disables tilt on touch devices.""",
        "modularity": "Organized into `ReflectiveCard.tsx` (<120 LoC) and `reflectiveStyles.ts` (<60 LoC)."
    },
    {
        "id": "card-nav",
        "name": "Card Nav",
        "category": "Components",
        "overview": "Card Nav renders an expandable navigation menu composed of stacked micro-cards that fan out into a grid of navigation destinations on click with staggered spring physics.",
        "props": r"""interface CardNavProps {
  /** Array of navigation card items */
  items: { id: string; title: string; icon?: React.ReactNode; href?: string; description?: string }[];
  /** Menu open state */
  isOpen?: boolean;
  /** On toggle callback */
  onToggle?: (open: boolean) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Cards fan out over $450\text{ms}$ with spring overshoot `(0.34, 1.3, 0.64, 1)`. Stagger delay is $35\text{ms}$ per card.",
        "math": r"""For card $k \in [0, N-1]$:
Collapsed state:
$$\text{translate3d}(0, k \cdot 4\text{px}, -k \cdot 10\text{px}) \text{ scale}(1 - k \cdot 0.04)$$
Expanded grid position $(x_k, y_k)$:
$$x_k = (k \bmod C) \cdot (W_{card} + \text{gap}), \quad y_k = \lfloor k / C \rfloor \cdot (H_{card} + \text{gap})$$
Interpolation progress:
$$\vec{p}_k(t) = \text{lerp}(\vec{p}_{collapsed, k}, \vec{p}_{expanded, k}, f(\tau_k))$$""",
        "interaction": "Clicking trigger fans out cards into full navigation menu. Hovering cards elevates them.",
        "implementation": r"""1. Fixed / Sticky Menu Root: Positioned at navigation bar header.
2. WAAPI Fan Out: Staggered animation of `transform` and `opacity`.
3. Keyboard Trapping: Focus trapped within open card menu with Escape to close.
4. Responsive Grid: Adapts column count from 1 (mobile) to 3 (desktop).""",
        "modularity": "Decompose into `CardNav.tsx` (<130 LoC), `NavCardItem.tsx` (<90 LoC), and `cardNavMath.ts` (<50 LoC)."
    },
    {
        "id": "stack",
        "name": "Stack",
        "category": "Components",
        "overview": "Stack renders an interactive Tinder-like swipeable card deck where users can drag, flick, swipe left/right to dismiss cards, and cycle through the stack with spring rebound.",
        "props": r"""interface StackProps {
  /** Array of card elements */
  children: React.ReactNode[];
  /** Card dismissal threshold in pixels (default: 120) */
  dragThreshold?: number;
  /** Callback fired when a card is swiped (direction: 'left' | 'right') */
  onSwipe?: (index: number, direction: 'left' | 'right') => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Card drag tracks pointer at 60/120 FPS. Rebound spring settles in $250\text{ms}$. Dismissal throw animation takes $300\text{ms}$.",
        "math": r"""Drag translation $(x_d, y_d)$ and rotation angle:
$$\theta = \frac{x_d}{W_{card}} \cdot 15^\circ$$
Card throw dismissal velocity:
$$\vec{v}_{throw} = \vec{v}_{pointer} \cdot 1.5$$
Stacked background cards:
$$S_k = 1 - k \cdot 0.05, \quad Y_k = k \cdot 12\text{px}, \quad \alpha_k = 1 - k \cdot 0.2$$""",
        "interaction": "Drag to inspect. Swipe past threshold or flick with high velocity to dismiss.",
        "implementation": r"""1. Stack Layering: Top card active with pointer events; background cards inert.
2. Pointer Drag Physics: Measure displacement and rotation in `pointermove`.
3. Spring Rebound: If released before threshold, animate back to $(0,0)$ via spring solver.
4. Touch Swipe: Native touch action handling (`touch-action: none` on top card).""",
        "modularity": "Organized into `Stack.tsx` (<130 LoC), `useSwipeableCard.ts` (<110 LoC), and `stackStyles.ts` (<50 LoC)."
    },
    {
        "id": "fluid-glass",
        "name": "Fluid Glass",
        "category": "Components",
        "overview": "Fluid Glass renders a liquid glass surface with dynamic chromatic aberration, refractive distortion, liquid ripple physics, and frosted glass background blur.",
        "props": r"""interface FluidGlassProps {
  /** Content rendered inside glass container */
  children: React.ReactNode;
  /** Backdrop blur radius in pixels (default: 20) */
  blurRadius?: number;
  /** Glass refraction index [1.0..1.5] (default: 1.15) */
  refractionIndex?: number;
  /** Glass tint color (default: 'rgba(255, 255, 255, 0.08)') */
  tintColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Continuous background refractive distortion at 60 FPS. Glass ripple impulse decays over $800\text{ms}$.",
        "math": r"""Snell's Law Refraction at glass boundary:
$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$
Chromatic separation lookup offsets for RGB channels:
$$\vec{d}_R = \vec{N} \cdot (\eta_R - 1), \quad \vec{d}_G = \vec{N} \cdot (\eta_G - 1), \quad \vec{d}_B = \vec{N} \cdot (\eta_B - 1)$$
where $\eta_R = 1.14, \eta_G = 1.15, \eta_B = 1.16$.""",
        "interaction": "Pointer movement creates localized fluid ripples and refractive lens magnification across glass.",
        "implementation": r"""1. Glassmorphic Wrapper: `backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15)`.
2. SVG Displacement Filter: Optional `<feDisplacementMap>` creating authentic lens refraction.
3. Specular Lighting: Dynamic radial highlight tracking cursor position.
4. High Performance: Pure CSS backdrop-filter fallback for low-power devices.""",
        "modularity": "Decompose into `FluidGlass.tsx` (<120 LoC) and `fluidGlassStyles.ts` (<60 LoC)."
    },
    {
        "id": "pill-nav",
        "name": "Pill Nav",
        "category": "Components",
        "overview": "Pill Nav renders a floating capsule navigation bar with an animated magnetic pill indicator, backdrop blur, glowing active states, and route switching.",
        "props": r"""interface PillNavProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; icon?: React.ReactNode }[];
  /** Active link ID */
  activeId: string;
  /** On link select callback */
  onSelect: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Pill indicator transitions between tabs in $250\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Capsule stretches slightly during transit.",
        "math": r"""Indicator bounding box $(x(t), w(t))$:
$$x(t) = \text{lerp}(x_1, x_2, f(\tau)), \quad w(t) = \text{lerp}(w_1, w_2, f(\tau))$$
where $f(\tau) = 1 - (1 - \tau)^4$ (quartic ease-out).
Glow spotlight:
$$\text{background} = \text{radial-gradient}(80\text{px at } x_{indicator}\text{px } 50\%, C_{glow}, \text{transparent } 80\%)$$""",
        "interaction": "Clicking any tab slides pill indicator. Hovering previews ghost indicator.",
        "implementation": r"""1. Capsule Wrapper: `rounded-full backdrop-blur-md bg-black/40 border border-white/10 p-1 flex items-center`.
2. Sliding Indicator: Absolute positioned `rounded-full bg-white/10` with `transition: transform, width`.
3. Ref Measurements: Measure active tab element offset via `getBoundingClientRect()`.
4. Keyboard Navigation: Left/Right arrow keys navigate tabs with automatic focus management.""",
        "modularity": "Organized into `PillNav.tsx` (<120 LoC), `PillItem.tsx` (<80 LoC), and `pillNavStyles.ts` (<50 LoC)."
    },
    {
        "id": "tilted-card",
        "name": "Tilted Card",
        "category": "Components",
        "overview": "Tilted Card creates an interactive 3D perspective card that tilts toward the mouse pointer with multi-layered depth parallax, cast shadows, and floating caption overlays.",
        "props": r"""interface TiltedCardProps {
  /** Image URL */
  imageSrc: string;
  /** Card caption / title */
  captionText?: string;
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Scale on hover (default: 1.05) */
  scale?: number;
  /** Card corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Tilt angles track mouse at 60/120 FPS via exponential lerp ($\alpha = 0.12$). Rebounds to $(0^\circ, 0^\circ)$ in $350\text{ms}$ on mouse leave.",
        "math": r"""Normalized cursor coordinates $(u, v) \in [-1, 1]$ from card center:
$$u = \frac{2(x_c - X_0)}{W} - 1, \quad v = \frac{2(y_c - Y_0)}{H} - 1$$
Rotation angles:
$$\text{rotateY} = u \cdot \theta_{max}, \quad \text{rotateX} = -v \cdot \theta_{max}$$
Floating caption parallax layer translation:
$$x_{caption} = u \cdot 20\text{px}, \quad y_{caption} = v \cdot 20\text{px}, \quad z_{caption} = 40\text{px}$$""",
        "interaction": "3D tilt smoothly responds to mouse hover. Overlay elements lift off card surface along Z-axis.",
        "implementation": r"""1. 3D Card Shell: `transform-style: preserve-3d; perspective: 1000px`.
2. Parallax Layers: Child elements use `transform: translateZ(40px)` to float above background.
3. RAF Smooth Loop: Update CSS variables `--tilt-x`, `--tilt-y` smoothly.
4. Mobile Safe: Degrades to static card on touch screens.""",
        "modularity": "Decompose into `TiltedCard.tsx` (<120 LoC) and `tiltedCardStyles.ts` (<50 LoC)."
    },
    {
        "id": "masonry",
        "name": "Masonry",
        "category": "Components",
        "overview": "Masonry arranges dynamic variable-height cards into optimal multi-column Pinterest-style layouts with animated column adjustments and staggered entrance reveals.",
        "props": r"""interface MasonryProps<T> {
  /** Data items array */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Responsive column count map (e.g. { default: 4, 1024: 3, 768: 2, 640: 1 }) */
  columns?: { [breakpoint: string]: number } | number;
  /** Grid gap in pixels (default: 16) */
  gap?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Cards enter with staggered fade-in ($400\text{ms}$, $30\text{ms}$ step). Column repositioning uses FLIP transitions over $300\text{ms}$.",
        "math": r"""Greedy Column Packing Algorithm:
Maintain column height array $H = [h_0, h_1, \dots, h_{C-1}]$.
For card $k$ with height $h_k$:
1. Find column with minimum height:
   $$c_{min} = \arg\min_{c} H[c]$$
2. Position card $k$:
   $$x_k = c_{min} \cdot (W_{col} + \text{gap}), \quad y_k = H[c_{min}]$$
3. Update column height:
   $$H[c_{min}] \leftarrow H[c_{min}] + h_k + \text{gap}$$""",
        "interaction": "Smoothly reflows cards on window resize or when filtering items.",
        "implementation": r"""1. Dynamic Layout Engine: Calculate card positions in pure JavaScript or CSS multi-column / flex columns.
2. Image Load Listener: Re-measure card heights when child images finish loading.
3. Virtualization Option: Support windowed rendering for large datasets ($>100$ items).
4. Responsive Breakpoints: Match Tailwind standard breakpoints.""",
        "modularity": "Organized into `Masonry.tsx` (<120 LoC), `useMasonryLayout.ts` (<110 LoC), and `masonryTypes.ts` (<40 LoC)."
    },
    {
        "id": "glass-surface",
        "name": "Glass Surface",
        "category": "Components",
        "overview": "Glass Surface provides a customizable frosted glass UI panel with customizable backdrop blur, border lighting highlights, noise grain textures, and inner ambient glow.",
        "props": r"""interface GlassSurfaceProps {
  /** Child content */
  children: React.ReactNode;
  /** Backdrop blur intensity in pixels (default: 16) */
  blur?: number;
  /** Surface opacity [0..1] (default: 0.1) */
  opacity?: number;
  /** Border highlight intensity (default: 0.2) */
  borderOpacity?: number;
  /** Apply noise grain texture overlay (default: true) */
  grain?: boolean;
  /** Corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Hardware-accelerated CSS backdrop rendering. Hover highlight transitions over $200\text{ms}$ `ease-out`.",
        "math": r"""Glassmorphism CSS styling equation:
$$\text{backdrop-filter: blur}(B\text{px}) \text{ saturate}(180\%)$$
$$\text{background: rgba}(255, 255, 255, \alpha)$$
$$\text{border: 1px solid rgba}(255, 255, 255, \alpha_{border})$$
$$\text{box-shadow: 0 8px 32px 0 rgba}(0, 0, 0, 0.37)$$""",
        "interaction": "Illuminates with soft specular highlight when pointer moves across panel.",
        "implementation": r"""1. Composite Layers: Outer glass container + optional grain texture overlay + content.
2. Tailwind Classes: `backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl`.
3. Noise Texture: Base64 micro-noise SVG pattern tile with `mix-blend-mode: overlay`.
4. Performance: Uses hardware acceleration to prevent scroll lag.""",
        "modularity": "Decompose into `GlassSurface.tsx` (<110 LoC) and `glassStyles.ts` (<50 LoC)."
    },
    {
        "id": "dome-gallery",
        "name": "Dome Gallery",
        "category": "Components",
        "overview": "Dome Gallery maps gallery thumbnails or video clips onto an interactive geodesic 3D dome hemisphere, allowing users to orbit and inspect cards in hemispherical space.",
        "props": r"""interface DomeGalleryProps {
  /** Array of media cards */
  items: { id: string; title: string; image: string }[];
  /** Dome radius in pixels (default: 500) */
  domeRadius?: number;
  /** Number of latitude rings (default: 4) */
  latitudeRings?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Inertial 3D dome rotation at 60 FPS. Card focus transition takes $500\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`.",
        "math": r"""Spherical Coordinates on Dome Hemisphere $(\theta \in [0, 2\pi], \phi \in [0, \pi/2])$:
$$x = R \cdot \sin\phi \cos\theta$$
$$y = R \cdot \cos\phi$$
$$z = R \cdot \sin\phi \sin\theta$$
Rotation matrix $R_x(\alpha) R_y(\beta)$ applied to each vertex point:
$$\vec{p}_{rot} = R_y(\beta) R_x(\alpha) \vec{p}$$
Perspective projection:
$$x_{screen} = \frac{x_{rot} \cdot d}{z_{rot} + d}, \quad y_{screen} = \frac{y_{rot} \cdot d}{z_{rot} + d}$$""",
        "interaction": "Click and drag rotates the 3D dome freely. Clicking a card spins it to the front focal point.",
        "implementation": r"""1. 3D Transform Pipeline: Pure CSS 3D transforms or WebGL 2D/3D point billboarding.
2. Spherical Fibonacci Distribution: Uniform distribution of cards over hemisphere.
3. Inertial Physics: Pointer velocity tracker applies spherical rotational friction.
4. Auto Billboard: Orient card faces to look toward dome center.""",
        "modularity": "Organized into `DomeGallery.tsx` (<130 LoC), `useDomeRotation.ts` (<110 LoC), and `sphericalMath.ts` (<60 LoC)."
    },
    {
        "id": "chroma-grid",
        "name": "Chroma Grid",
        "category": "Components",
        "overview": "Chroma Grid renders a grid of interactive glass tiles that illuminate with vibrant chromatic color halos, rainbow dispersion lines, and specular highlights as the cursor moves.",
        "props": r"""interface ChromaGridProps {
  /** Number of grid columns (default: 4) */
  columns?: number;
  /** Number of grid rows (default: 3) */
  rows?: number;
  /** Tile items */
  items: React.ReactNode[];
  /** Halo radius in pixels (default: 200) */
  glowRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Color halos track pointer at 60/120 FPS. Light dissipation settles in $300\text{ms}$.",
        "math": r"""For tile center $(X_k, Y_k)$ and pointer $(x_c, y_c)$:
Distance $d_k = \sqrt{(X_k - x_c)^2 + (Y_k - y_c)^2}$.
Rainbow hue calculation:
$$\text{Hue}(k) = \left(\frac{x_c}{W} \cdot 360^\circ + k \cdot 20^\circ\right) \bmod 360^\circ$$
Radial glow mask:
$$\text{background} = \text{radial-gradient}(R\text{px at } (x_c - X_k)\text{px } (y_c - Y_k)\text{px}, \text{hsl}(\text{Hue}, 80\%, 60\%), \text{transparent } 70\%)$$""",
        "interaction": "Sweeping mouse across grid creates fluid waves of vibrant chromatic light.",
        "implementation": r"""1. Grid Layout: Tailwind CSS grid with `gap-4`.
2. Dynamic Gradient Overlays: Each tile has absolute glow layer listening to parent mouse coordinates.
3. CSS Blend Modes: `mix-blend-mode: color-dodge` for neon intensity.
4. Optimized Events: Single mouse move listener on root grid container.""",
        "modularity": "Decompose into `ChromaGrid.tsx` (<120 LoC), `ChromaTile.tsx` (<90 LoC), and `chromaStyles.ts` (<50 LoC)."
    },
    {
        "id": "folder",
        "name": "Folder",
        "category": "Components",
        "overview": "Folder creates an interactive macOS-style 3D expandable folder that opens its front flap, reveals nested document previews, and fans out files with spring physics.",
        "props": r"""interface FolderProps {
  /** Folder title */
  title: string;
  /** Array of nested file items */
  files: { id: string; name: string; type?: string; thumbnail?: string }[];
  /** Folder open state */
  isOpen?: boolean;
  /** On toggle callback */
  onToggle?: (open: boolean) => void;
  /** Folder color */
  folderColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Folder flap opens in $350\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. File previews fan out with staggered delays ($30\text{ms}$).",
        "math": r"""Front flap 3D rotation angle $\theta_{flap}(t)$:
$$\theta_{flap} = \text{if open then } -55^\circ \text{ else } 0^\circ$$
Nested file $k \in [0, N-1]$ fan out transform when open:
$$y_k = -(k + 1) \cdot 24\text{px}, \quad \text{rotate}_k = (k - 1) \cdot 6^\circ, \quad \text{scale}_k = 1 - k \cdot 0.05$$""",
        "interaction": "Clicking folder toggles open/closed states. Hovering previews nested files.",
        "implementation": r"""1. 3D Folder Shell: Back flap layer + nested file items + front flap with `transform-origin: bottom`.
2. CSS 3D Perspective: `perspective: 800px; transform-style: preserve-3d`.
3. Staggered WAAPI: Animate file card translations on open.
4. Keyboard Accessible: Toggle with Enter or Space key.""",
        "modularity": "Organized into `Folder.tsx` (<130 LoC), `FolderFlap.tsx` (<80 LoC), and `folderStyles.ts` (<50 LoC)."
    },
    {
        "id": "staggered-menu",
        "name": "Staggered Menu",
        "category": "Components",
        "overview": "Staggered Menu renders an editorial full-screen or slide-out menu where navigation links, numbers, and background color blocks stagger into place with magnetic hover states.",
        "props": r"""interface StaggeredMenuProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; subtitle?: string }[];
  /** Menu open state */
  isOpen: boolean;
  /** Close menu callback */
  onClose: () => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Menu slides in over $500\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Links stagger in with $40\text{ms}$ offsets.",
        "math": r"""For link $k \in [0, N-1]$:
Stagger start time $t_{start, k} = k \cdot 40\text{ms}$.
Link translation and opacity:
$$y_k(t) = 40\text{px} \cdot (1 - f(\tau_k))$$
$$\alpha_k(t) = f(\tau_k)$$
where $f(\tau) = 1 - (1 - \tau)^4$.
Magnetic pointer offset on hover:
$$\Delta x = (x_{mouse} - X_{link}) \cdot 0.15$$""",
        "interaction": "Hovering links triggers magnetic pull and reveals background image preview.",
        "implementation": r"""1. Full-Screen Portal: Render menu in React portal with top z-index.
2. WAAPI Stagger Engine: Stagger text unmasking using `translateY(100%) -> translateY(0%)`.
3. Background Preview: Dynamic image crossfade when hovering links.
4. Focus Trapping: Automatic keyboard focus trapping when open.""",
        "modularity": "Decompose into `StaggeredMenu.tsx` (<130 LoC), `MenuLinkItem.tsx` (<90 LoC), and `menuStyles.ts` (<50 LoC)."
    },
    {
        "id": "model-viewer",
        "name": "Model Viewer",
        "category": "Components",
        "overview": "Model Viewer renders interactive 3D GLTF/GLB models or wireframe geometry with orbit controls, auto-rotation, lighting environment maps, and stage shadows.",
        "props": r"""interface ModelViewerProps {
  /** 3D model asset URL (GLTF / GLB / JSON mesh) */
  modelSrc: string;
  /** Auto-rotation speed (0 to disable, default: 0.5) */
  autoRotateSpeed?: number;
  /** Camera field of view in degrees (default: 45) */
  fov?: number;
  /** Stage shadow opacity (default: 0.3) */
  shadowOpacity?: number;
  /** Background environment color */
  backgroundColor?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Orbit controls respond with zero latency. Auto-rotation progresses at constant angular velocity $\omega = \text{speed} \cdot 0.01\text{ rad/s}$.",
        "math": r"""Orbit Camera Spherical Coordinates $(\rho, \theta, \phi)$:
$$x_{cam} = \rho \sin\phi \sin\theta$$
$$y_{cam} = \rho \cos\phi$$
$$z_{cam} = \rho \sin\phi \cos\theta$$
Look-At View Matrix:
$$\vec{z}_{view} = \frac{\vec{eye} - \vec{target}}{\|\vec{eye} - \vec{target}\|}, \quad \vec{x}_{view} = \frac{\vec{up} \times \vec{z}_{view}}{\|\vec{up} \times \vec{z}_{view}\|}, \quad \vec{y}_{view} = \vec{z}_{view} \times \vec{x}_{view}$$""",
        "interaction": "Pointer drag orbits camera around model. Scroll wheel zooms in/out. Double click resets view.",
        "implementation": r"""1. WebGL Context: Native WebGL 2.0 or Three.js mini canvas pipeline.
2. Orbit Controller: Pointer drag updates polar angles $\theta, \phi$.
3. Mesh Buffer: Stream vertex, normal, and UV buffers efficiently.
4. Loading Skeleton: Graceful animated spinner while model downloads.""",
        "modularity": "Organized into `ModelViewer.tsx` (<130 LoC), `OrbitCamera.ts` (<120 LoC), and `modelRenderer.ts` (<140 LoC)."
    },
    {
        "id": "lanyard",
        "name": "Lanyard",
        "category": "Components",
        "overview": "Lanyard renders a physics-simulated hanging conference badge or ID lanyard that sways with 2D/3D Verlet particle cloth physics, gravity, pointer drag, and momentum.",
        "props": r"""interface LanyardProps {
  /** ID badge content / profile info */
  badgeContent: React.ReactNode;
  /** Lanyard string length in pixels (default: 200) */
  lanyardLength?: number;
  /** Number of rope segments (default: 8) */
  segments?: number;
  /** Gravity acceleration (default: 980) */
  gravity?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Verlet physics runs at 60 FPS. Badge oscillations settle in $\approx 1.5\text{s}$ under air resistance damping.",
        "math": r"""Verlet Particle Integration for rope node $i$:
$$\vec{p}_i(t + \Delta t) = 2\vec{p}_i(t) - \vec{p}_i(t - \Delta t) + \vec{g} \Delta t^2 \cdot (1 - \text{damping})$$
Distance Constraint Enforcement between adjacent nodes $(i, i+1)$:
$$\vec{\Delta} = \vec{p}_{i+1} - \vec{p}_i, \quad \text{dist} = \|\vec{\Delta}\|$$
$$\text{correction} = \frac{\text{dist} - L_0}{\text{dist}} \cdot 0.5$$
$$\vec{p}_i \leftarrow \vec{p}_i + \vec{\Delta} \cdot \text{correction}, \quad \vec{p}_{i+1} \leftarrow \vec{p}_{i+1} - \vec{\Delta} \cdot \text{correction}$$
Badge 3D rotation angle:
$$\theta_{badge} = \arctan2(\Delta x_{last}, \Delta y_{last})$$""",
        "interaction": "Users can grab badge card with mouse and throw it, watching the lanyard string snap and swing.",
        "implementation": r"""1. Verlet Rope Solver: 8-node constrained particle chain pinned at top origin $(x_0, y_0)$.
2. Canvas / SVG String: Draw smooth bezier curve through rope nodes.
3. DOM Badge Card: Pin HTML badge card to final rope node with `transform: translate3d(x, y, 0) rotate(theta)`.
4. Drag Physics: Lock position of final node to cursor coordinates during pointer drag.""",
        "modularity": "Decompose into `Lanyard.tsx` (<130 LoC), `VerletRope.ts` (<140 LoC), and `lanyardMath.ts` (<60 LoC)."
    },
    {
        "id": "profile-card",
        "name": "Profile Card",
        "category": "Components",
        "overview": "Profile Card renders a glassmorphic personal ID badge / career avatar card with holographic sheen, tilt physics, verified badge glow, and animated social links.",
        "props": r"""interface ProfileCardProps {
  /** User name */
  name: string;
  /** Role / title */
  role: string;
  /** Avatar image URL */
  avatarSrc: string;
  /** Career stats or skill tags */
  tags?: string[];
  /** Verified status badge */
  verified?: boolean;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Card tilts at 60/120 FPS via lerp ($\alpha = 0.15$). Avatar glow pulses over period $T = 3.0\text{s}$.",
        "math": r"""3D Tilt Angles from card center $(X_0, Y_0)$:
$$\text{rotX} = -\left(\frac{y_c - Y_0}{H/2}\right) \cdot 12^\circ, \quad \text{rotY} = \left(\frac{x_c - X_0}{W/2}\right) \cdot 12^\circ$$
Holographic sheen gradient:
$$\text{background} = \text{linear-gradient}(\theta_{sheen}\text{deg}, \text{transparent } 30\%, C_{holo} \ 50\%, \text{transparent } 70\%)$$""",
        "interaction": "Mouse hover tilts card in 3D and sweeps holographic sheen across avatar badge.",
        "implementation": r"""1. 3D Card Shell: `perspective: 1000px; transform-style: preserve-3d`.
2. Holographic Layer: Pseudo-element with `mix-blend-mode: color-dodge` and dynamic position.
3. Avatar Glow: Multi-stage drop shadow on avatar border.
4. Tailwind Integration: Pure Tailwind styling with CSS custom properties.""",
        "modularity": "Organized into `ProfileCard.tsx` (<120 LoC) and `profileCardStyles.ts` (<60 LoC)."
    },
    {
        "id": "dock",
        "name": "Dock",
        "category": "Components",
        "overview": "Dock emulates the macOS application dock with smooth mouse proximity magnification, cosine wave scaling, bounce badges, and tooltips.",
        "props": r"""interface DockProps {
  /** Array of dock items */
  items: { id: string; icon: React.ReactNode; label: string; onClick?: () => void }[];
  /** Base icon size in pixels (default: 48) */
  iconSize?: number;
  /** Maximum magnified icon size in pixels (default: 80) */
  maxIconSize?: number;
  /** Proximity influence distance in pixels (default: 150) */
  distance?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Icon scaling updates at 60/120 FPS with zero latency. Active app click bounce period $T = 400\text{ms}$.",
        "math": r"""For icon $i$ at horizontal center $x_i$ and mouse position $x_m$:
Distance:
$$d_i = |x_i - x_m|$$
Cosine Bell Curve Magnification ($d_i < D$):
$$S_i = S_{base} + (S_{max} - S_{base}) \cdot \cos^2\left(\frac{\pi d_i}{2D}\right)$$
$$S_i = S_{base} \quad \text{if } d_i \ge D$$""",
        "interaction": "Icons magnify dynamically as mouse sweeps horizontally along dock. Clicking an icon triggers vertical bounce.",
        "implementation": r"""1. Dock Container: `rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 p-2 flex items-end`.
2. Proximity Tracker: Track `clientX` and compute each icon's width/height in RAF loop.
3. WAAPI Bounce: Click triggers `@keyframes dock-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }`.
4. Tooltips: Animated tooltip appears above hovered icon.""",
        "modularity": "Decompose into `Dock.tsx` (<120 LoC), `DockItem.tsx` (<90 LoC), and `dockMath.ts` (<50 LoC)."
    },
    {
        "id": "gooey-nav",
        "name": "Gooey Nav",
        "category": "Components",
        "overview": "Gooey Nav renders a liquid navigation bar where the active indicator droplet stretches, detaches, and snaps elastically between menu items using SVG gooey filter contrast.",
        "props": r"""interface GooeyNavProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; icon?: React.ReactNode }[];
  /** Active link ID */
  activeId: string;
  /** On select callback */
  onSelect: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Gooey indicator travels between tabs over $400\text{ms}$ with spring overshoot `(0.34, 1.4, 0.64, 1)`. Liquid droplet snaps apart at $t = 0.5T$.",
        "math": r"""Liquid droplet connection bridge thickness:
$$w_{bridge}(\tau) = w_0 \cdot \sin(\pi \tau) \quad \text{for } \tau \in [0, 1]$$
SVG Matrix Contrast:
$$\begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 20 & -10 \end{pmatrix}$$""",
        "interaction": "Clicking any menu item shoots a liquid gooey bubble that stretches across to the new target tab.",
        "implementation": r"""1. SVG Filter Defs: Render hidden SVG with `<feGaussianBlur>` and `<feColorMatrix>`.
2. Gooey Container: Wrap indicator and tab items inside `filter: url(#gooey-filter)`.
3. Dual Droplet Animation: Origin droplet shrinks while destination droplet expands.
4. Screen Reader Access: Standard navigation semantics retained.""",
        "modularity": "Organized into `GooeyNav.tsx` (<120 LoC), `GooeyFilter.tsx` (<60 LoC), and `gooeyStyles.ts` (<50 LoC)."
    },
    {
        "id": "pixel-card",
        "name": "Pixel Card",
        "category": "Components",
        "overview": "Pixel Card renders interactive UI cards with a retro pixelated mosaic border or background grid that animates, highlights, and scrambles on cursor proximity.",
        "props": r"""interface PixelCardProps {
  /** Card children content */
  children: React.ReactNode;
  /** Pixel block size in pixels (default: 16) */
  pixelSize?: number;
  /** Pixel highlight color (default: '#6366f1') */
  color?: string;
  /** Pixel activation radius around pointer (default: 100) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Pixel cells illuminate on pointer contact ($<16\text{ms}$) and fade out exponentially over $450\text{ms}$.",
        "math": r"""For pixel cell $(i, j)$ at center $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Proximity test:
$$d = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$$
$$\text{isActive} = d < R_{radius}$$
Opacity decay function:
$$\alpha_{i,j}(t) = \alpha_0 \cdot e^{-(t - t_{hit}) / \tau_{decay}}$$""",
        "interaction": "Moving mouse over card surface lights up a trail of illuminated pixel tiles.",
        "implementation": r"""1. Canvas Pixel Overlay: Overlay `<canvas>` rendering square tiles with `ctx.fillRect()`.
2. Timestamp Map: Track active cell hits in `Map<string, number>`.
3. Auto Pause: RAF loop pauses when all illuminated cells fade to zero.
4. Clean Border: Card content sits atop canvas with `relative z-10`.""",
        "modularity": "Decompose into `PixelCard.tsx` (<120 LoC), `PixelCanvas.ts` (<100 LoC), and `pixelCardStyles.ts` (<40 LoC)."
    },
    {
        "id": "carousel",
        "name": "Carousel",
        "category": "Components",
        "overview": "Carousel provides a high-performance touch-enabled slider with smooth spring drag inertia, pagination indicators, autoplay controls, and zero layout shift.",
        "props": r"""interface CarouselProps {
  /** Slide elements */
  children: React.ReactNode[];
  /** Auto-play interval in milliseconds (0 to disable, default: 4000) */
  autoplayInterval?: number;
  /** Show pagination dots (default: true) */
  showPagination?: boolean;
  /** Show prev/next arrow buttons (default: true) */
  showArrows?: boolean;
  /** Active slide change callback */
  onSlideChange?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Slide transition duration $450\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Drag drag-release settles via spring solver in $350\text{ms}$.",
        "math": r"""For slide index $k \in [0, N-1]$:
Track displacement $X(t)$:
$$X(t) = -(k \cdot 100\% + X_{drag})$$
Spring recovery if released before threshold ($|X_{drag}| < X_{thresh}$):
$$X_{drag}(t) = X_{drag}(0) \cdot e^{-\zeta \omega_n t} \cos(\omega_d t)$$""",
        "interaction": "Touch swipe and mouse drag with rubber-band resistance at boundaries. Full keyboard arrow navigation.",
        "implementation": r"""1. Track Container: `overflow-hidden w-full relative flex`.
2. GPU Sliding: `transform: translate3d(X, 0, 0)` applied to slide ribbon track.
3. Autoplay Timer: Pauses on pointer hover or focus-visible.
4. ARIA Carousel: Implements WAI-ARIA Carousel Design Pattern.""",
        "modularity": "Organized into `Carousel.tsx` (<130 LoC), `CarouselTrack.tsx` (<90 LoC), and `useCarouselAutoplay.ts` (<70 LoC)."
    },
    {
        "id": "spotlight-card",
        "name": "Spotlight Card",
        "category": "Components",
        "overview": "Spotlight Card illuminates card content with a dynamic radial spotlight halo tracking cursor coordinates, rendering subtle specular border highlights.",
        "props": r"""interface SpotlightCardProps {
  /** Card children */
  children: React.ReactNode;
  /** Spotlight halo color (default: 'rgba(255, 255, 255, 0.1)') */
  spotlightColor?: string;
  /** Spotlight radius in pixels (default: 250) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Spotlight tracks cursor in real-time at 60/120 FPS. Fades in on mouse enter ($150\text{ms}$) and fades out on mouse leave ($300\text{ms}$).",
        "math": r"""Pointer offset $(x_c, y_c)$ relative to card:
Spotlight radial gradient:
$$\text{background} = \text{radial-gradient}(R\text{px at } x_c\text{px } y_c\text{px}, C_{spot}, \text{transparent } 80\%)$$""",
        "interaction": "Smoothly highlights card surface under mouse. Sibling cards stay dim.",
        "implementation": r"""1. Relative Card Wrapper: `relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900`.
2. Spotlight Overlay: Absolute div with `pointer-events: none` and dynamic inline background.
3. CSS Custom Properties: Update `--mouse-x` and `--mouse-y` on pointer move.
4. Tailwind Integration: Pure Tailwind CSS classes.""",
        "modularity": "Decompose into `SpotlightCard.tsx` (<110 LoC) and `spotlightStyles.ts` (<50 LoC)."
    },
    {
        "id": "border-glow",
        "name": "Border Glow",
        "category": "Components",
        "overview": "Border Glow renders a dynamic glowing perimeter border that circulates or follows mouse coordinates around card perimeters with neon gradient luminance.",
        "props": r"""interface BorderGlowProps {
  /** Content wrapped in glowing border */
  children: React.ReactNode;
  /** Border glow color or gradient stops */
  glowColor?: string;
  /** Border thickness in pixels (default: 2) */
  borderWidth?: number;
  /** Corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Circulating border glow cycles continuously over period $T = 4.0\text{s}$. Pointer-following mode updates at 60/120 FPS.",
        "math": r"""Conic gradient border angle $\theta(t)$:
$$\theta(t) = \left(\frac{t}{T}\right) \cdot 360^\circ$$
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg}, \text{transparent } 0^\circ, C_{glow} \ 45^\circ, \text{transparent } 90^\circ)$$
Masking equation to retain only border perimeter:
$$\text{mask} = \text{linear-gradient}(\#\text{fff } 0\ 0)\text{ content-box, linear-gradient}(\#\text{fff } 0\ 0)$$
$$\text{mask-composite: exclude}$$""",
        "interaction": "Glow speed accelerates and brightens on hover.",
        "implementation": r"""1. Dual-Layer Mask: Inner content container + animated border gradient pseudo-element.
2. CSS Conic Gradient: Animated `@keyframes border-spin` rotating gradient angle.
3. Mask Composite: Exclude content-box from border-box to create razor-sharp border stroke.
4. Performance: Composite thread animation with zero repaint cost.""",
        "modularity": "Organized into `BorderGlow.tsx` (<110 LoC) and `borderGlowStyles.ts` (<50 LoC)."
    },
    {
        "id": "flying-posters",
        "name": "Flying Posters",
        "category": "Components",
        "overview": "Flying Posters renders a 3D tunnel gallery of photographic poster boards flying toward the camera in infinite perspective with mouse parallax steering.",
        "props": r"""interface FlyingPostersProps {
  /** Array of poster images */
  items: { id: string; title: string; image: string }[];
  /** Flying travel speed (default: 200) */
  speed?: number;
  /** 3D tunnel depth in pixels (default: 2000) */
  depth?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Posters travel continuously along Z axis at $V = 200\text{px/s}$. Tunnel recycle loop is completely seamless.",
        "math": r"""For poster $k \in [0, N-1]$ with Z coordinate $z_k(t)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{depth}$$
3D Perspective Scale:
$$\text{scale}_k = \frac{d_{cam}}{d_{cam} + z_k(t)}$$
Screen position with mouse parallax $(\Delta X, \Delta Y)$:
$$x_k = (X_k + \Delta X \cdot z_k / Z_{depth}) \cdot \text{scale}_k$$
$$y_k = (Y_k + \Delta Y \cdot z_k / Z_{depth}) \cdot \text{scale}_k$$""",
        "interaction": "Mouse steering shifts 3D camera trajectory through the poster tunnel.",
        "implementation": r"""1. 3D Canvas / DOM Stage: `perspective: 1000px; transform-style: preserve-3d`.
2. Z-Buffer Sorting: Depth sort posters to ensure correct occlusion.
3. Seamless Wrap: Reset poster Z position to far plane when $z < 0$.
4. Touch Parallax: Device gyroscope tilt on mobile.""",
        "modularity": "Decompose into `FlyingPosters.tsx` (<130 LoC), `useTunnelPhysics.ts` (<100 LoC), and `posterMath.ts` (<60 LoC)."
    },
    {
        "id": "card-swap",
        "name": "Card Swap",
        "category": "Components",
        "overview": "Card Swap executes a physical 3D card shuffling animation where top cards lift, slide outward, flip to the back of the deck, and tuck into place.",
        "props": r"""interface CardSwapProps {
  /** Array of card elements */
  children: React.ReactNode[];
  /** Auto-shuffle interval in milliseconds (0 to disable, default: 3500) */
  interval?: number;
  /** Card swap animation duration in milliseconds (default: 600) */
  duration?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Card swap executes over $600\text{ms}$ with `cubic-bezier(0.34, 1.3, 0.64, 1)`. Idle dwell between shuffles is $3500\text{ms}$.",
        "math": r"""Normalized swap progress $\tau \in [0, 1]$:
Phase 1 (Lift & Slide Out $\tau \in [0, 0.5]$):
$$x(\tau) = W_{card} \cdot \sin(\pi \tau), \quad z(\tau) = 50\text{px} \cdot \sin(\pi \tau)$$
$$\text{rotZ}(\tau) = 15^\circ \cdot \sin(\pi \tau)$$
Phase 2 (Drop to Back $\tau \in [0.5, 1.0]$):
$$\text{zIndex} \leftarrow \text{back}, \quad x(\tau) \to 0, \quad z(\tau) \to -N \cdot 10\text{px}$$""",
        "interaction": "Clicking card deck triggers manual card swap. Pauses on hover.",
        "implementation": r"""1. 3D Stack Container: `transform-style: preserve-3d; perspective: 800px`.
2. Staggered Z-Index: Maintain card depth indices $[0, 1, \dots, N-1]$.
3. WAAPI Sequence: Animate top card through keyframe bezier trajectory.
4. ARIA Deck: Announce active card to screen readers.""",
        "modularity": "Organized into `CardSwap.tsx` (<120 LoC), `useCardSwap.ts` (<90 LoC), and `cardSwapStyles.ts` (<50 LoC)."
    },
    {
        "id": "glass-icons",
        "name": "Glass Icons",
        "category": "Components",
        "overview": "Glass Icons renders 3D glassmorphic social icons or tool badges with translucent frosted layers, specular surface sheen, and floating icon glyphs.",
        "props": r"""interface GlassIconsProps {
  /** Array of icon configurations (icon, label, color, href) */
  icons: { id: string; icon: React.ReactNode; label?: string; color?: string; href?: string }[];
  /** Icon badge size in pixels (default: 56) */
  size?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Hover lifts icon badge in $200\text{ms}$ with spring overshoot `(0.34, 1.5, 0.64, 1)`. Sheen sweep takes $400\text{ms}$.",
        "math": r"""3D Layer Separation on Hover:
$$\text{Glass Base: } \text{translateZ}(10\text{px})$$
$$\text{Icon Glyph: } \text{translateZ}(30\text{px})$$
$$\text{Drop Shadow: } 0\ 16\text{px } 32\text{px rgba}(C_{icon}, 0.35)$$""",
        "interaction": "Hovering lifts glass icon in 3D and illuminates vibrant brand glow.",
        "implementation": r"""1. Multi-Layer DOM: Glass background + frosted middle layer + elevated icon glyph.
2. CSS 3D Transforms: `transform-style: preserve-3d; transition: transform 0.3s ease`.
3. Dynamic Brand Tint: Injects `--icon-color` for custom drop-shadow and border glow.
4. Accessible Links: Semantic `<a>` tags with ARIA labels.""",
        "modularity": "Decompose into `GlassIcons.tsx` (<110 LoC), `GlassIconItem.tsx` (<80 LoC), and `glassIconStyles.ts` (<50 LoC)."
    },
    {
        "id": "decay-card",
        "name": "Decay Card",
        "category": "Components",
        "overview": "Decay Card renders an interactive card that deconstructs into disintegrating particle dust or pixel fragments when swiped or dragged across a threshold.",
        "props": r"""interface DecayCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Disintegration particle count (default: 60) */
  particleCount?: number;
  /** Trigger mode (default: 'hover') */
  trigger?: 'hover' | 'click' | 'swipe';
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Decay particle explosion executes over $700\text{ms}$ with exponential particle deceleration.",
        "math": r"""For decay particle $k \in [0, N-1]$ at origin $(x_{0,k}, y_{0,k})$:
Velocity vector $\vec{v}_k = (V_{max} \cos\theta_k, \ V_{max} \sin\theta_k)$.
Position over time $t$:
$$\vec{p}_k(t) = \vec{p}_{0,k} + \vec{v}_k \cdot t \cdot e^{-t / \tau} + \frac{1}{2} \vec{g} t^2$$
Particle opacity & size:
$$\alpha_k(t) = 1 - \frac{t}{T}, \quad S_k(t) = S_0 \cdot \left(1 - \frac{t}{T}\right)$$""",
        "interaction": "Dragging or hovering over card triggers particle disintegration and dissolves card face.",
        "implementation": r"""1. Canvas Overlay: Capture card snapshot and spawn particle coordinate array.
2. Particle Simulation: Update particle positions in RAF loop with gravity and wind.
3. Card Fade: Fade base card element synchronously with particle explosion.
4. Auto Reset: Restore card when pointer exits.""",
        "modularity": "Organized into `DecayCard.tsx` (<120 LoC), `DecayParticleEngine.ts` (<130 LoC), and `decayTypes.ts` (<40 LoC)."
    },
    {
        "id": "flowing-menu",
        "name": "Flowing Menu",
        "category": "Components",
        "overview": "Flowing Menu displays full-width editorial navigation menu rows where hovering any row reveals a continuous flowing circular marquee ribbon and floating preview imagery.",
        "props": r"""interface FlowingMenuProps {
  /** Menu items */
  items: { id: string; text: string; image: string; link?: string }[];
  /** Marquee flow speed in pixels/sec (default: 80) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Row expansion takes $300\text{ms}$. Flowing marquee runs continuously at $80\text{px/s}$. Floating image follows mouse with $16\text{ms}$ lerp.",
        "math": r"""Floating image coordinates $(x_{img}, y_{img})$ smoothed via lerp:
$$(x_{img}(t), y_{img}(t)) = \text{lerp}((x_{img}(t-1), y_{img}(t-1)), (x_{mouse}, y_{mouse}), 0.2)$$
Row marquee translation:
$$X_{marquee}(t) = (V \cdot t) \bmod W_{text}$$""",
        "interaction": "Hovering a row opens marquee text flow and displays floating cursor image preview.",
        "implementation": r"""1. Menu Row Structure: Flex row with hidden overflow marquee sub-layer.
2. Floating Image Portal: Fixed position image follower attached to mouse.
3. CSS Keyframe Marquee: Horizontal infinite translation ribbon.
4. Clean Exit: Smoothly collapses row and fades image preview on mouse leave.""",
        "modularity": "Decompose into `FlowingMenu.tsx` (<120 LoC), `FlowingMenuItem.tsx` (<100 LoC), and `flowingMenuStyles.ts` (<50 LoC)."
    },
    {
        "id": "elastic-slider",
        "name": "Elastic Slider",
        "category": "Components",
        "overview": "Elastic Slider renders an interactive range input slider whose track and thumb bend elastically like a rubber band under pointer drag with authentic haptic spring snap.",
        "props": r"""interface ElasticSliderProps {
  /** Current numeric value */
  value: number;
  /** Min value (default: 0) */
  min?: number;
  /** Max value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Value change callback */
  onChange: (value: number) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Slider thumb tracks pointer at 60/120 FPS. Elastic track rebound spring settles within $250\text{ms}$ upon release.",
        "math": r"""Thumb coordinate $x_t \in [0, W]$:
$$x_t = \frac{\text{value} - \text{min}}{\text{max} - \text{min}} \cdot W$$
SVG Bezier Track Deflection curve $y(x)$ when pulled vertically by $\Delta y$:
$$B(s) = (1-s)^2 P_0 + 2(1-s)s P_1 + s^2 P_2$$
where $P_0 = (0, 0), \ P_1 = (x_t, \Delta y), \ P_2 = (W, 0)$.
Restoring spring force:
$$F_{spring} = -k \cdot \Delta y - c \cdot v_y$$""",
        "interaction": "Dragging slider thumb pulls track vertically with elastic resistance. Snaps back to straight line on release.",
        "implementation": r"""1. SVG Slider Track: Render `<path d=\"M 0 0 Q x_t dy W 0\">` dynamically.
2. Pointer Drag Physics: Capture pointer move deltas along X and Y axes.
3. Spring Solver: Rebound $\Delta y \to 0$ via damped harmonic oscillator.
4. Accessible Range: Full ARIA `role=\"slider\"` with keyboard arrow support.""",
        "modularity": "Organized into `ElasticSlider.tsx` (<120 LoC), `useElasticTrack.ts` (<100 LoC), and `sliderMath.ts` (<50 LoC)."
    },
    {
        "id": "counter",
        "name": "Counter",
        "category": "Components",
        "overview": "Counter renders an animated numeric odometer where individual digit columns slide vertically to reveal target numbers with authentic mechanical motion.",
        "props": r"""interface CounterProps {
  /** Target numeric value to display */
  value: number;
  /** Digit transition duration in milliseconds (default: 600) */
  duration?: number;
  /** Stagger delay between digit columns in milliseconds (default: 40) */
  stagger?: number;
  /** Text size / styling classes */
  fontSize?: string;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Each digit wheel rotates over $600\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Stagger delay cascades from right to left.",
        "math": r"""For digit column $k$ displaying digit $d_k \in [0, 9]$:
Vertical translation:
$$y_k(t) = -d_k \cdot 100\% \cdot f(\tau_k)$$
where $f(\tau) = 1 - (1 - \tau)^4$.
Digit column stack contains strings ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].""",
        "interaction": "Smoothly cascades and slides whenever `value` prop changes.",
        "implementation": r"""1. Column Strips: Render separate vertical strip of numbers 0-9 for each digit position.
2. CSS `translateY`: Animate `--digit-offset` via WAAPI or Tailwind transition.
3. Container Mask: `overflow-hidden` height matching single digit font height (`1em`).
4. Monospace Alignment: `tabular-nums` ensures uniform digit spacing.""",
        "modularity": "Decompose into `Counter.tsx` (<110 LoC), `DigitColumn.tsx` (<80 LoC), and `counterStyles.ts` (<40 LoC)."
    },
    {
        "id": "infinite-menu",
        "name": "Infinite Menu",
        "category": "Components",
        "overview": "Infinite Menu renders a seamless 2D circular menu ring that rotates infinitely, keeping menu items oriented upright with depth scaling and active selection.",
        "props": r"""interface InfiniteMenuProps {
  /** Menu items */
  items: { id: string; title: string; icon?: React.ReactNode; link?: string }[];
  /** Radius of circular menu in pixels (default: 200) */
  radius?: number;
  /** Selection change callback */
  onSelect?: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Inertial rotation decelerates over $600\text{ms}$ ($\mu = 0.94$). Active item snap animation takes $250\text{ms}$.",
        "math": r"""For $N$ items with angular spacing $\Delta\theta = \frac{2\pi}{N}$:
Item $k$ position at continuous angle $\theta_k(t)$:
$$x_k = R \cdot \sin(\theta_k(t)), \quad y_k = R \cdot \cos(\theta_k(t))$$
Billboard compensation angle to keep text horizontal:
$$\text{transform: translate3d}(x_k, y_k, 0) \text{ rotate}(0\text{deg})$$""",
        "interaction": "Drag or scroll wheel spins menu ring. Clicking any item snaps it to the active 12 o'clock anchor.",
        "implementation": r"""1. Ring Stage: Absolute positioning of items around origin $(0, 0)$.
2. Inertial Drag Hook: Compute angular deltas on pointer drag.
3. Snap Solver: Smoothly interpolates angle to closest item on release.
4. Keyboard Accessible: Arrow keys cycle through menu items.""",
        "modularity": "Organized into `InfiniteMenu.tsx` (<120 LoC), `useRingRotation.ts` (<90 LoC), and `ringMath.ts` (<50 LoC)."
    },
    {
        "id": "stepper",
        "name": "Stepper",
        "category": "Components",
        "overview": "Stepper renders an interactive multi-step workflow progress bar with animated step nodes, glowing connection lines, checkmark draws, and step transitions.",
        "props": r"""interface StepperProps {
  /** Array of step configurations */
  steps: { id: string; title: string; description?: string }[];
  /** Currently active step index (0-based) */
  activeStep: number;
  /** On step click callback (if steps are directly navigable) */
  onStepClick?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Connection line fill progress transitions over $350\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. Step node checkmark draws over $200\text{ms}$.",
        "math": r"""For step $k \in [0, N-1]$:
Connection line fill width between step $k$ and $k+1$:
$$W_{fill}(k) = \begin{cases} 100\% & \text{if } k < \text{activeStep} \\ p(t) \cdot 100\% & \text{if } k = \text{activeStep} \\ 0\% & \text{if } k > \text{activeStep} \end{cases}$$
Checkmark SVG draw:
$$\text{stroke-dashoffset} = L_{check} \cdot (1 - f(\tau))$$""",
        "interaction": "Step status updates as user completes workflow phases. Completed steps clickable for fast backtracking.",
        "implementation": r"""1. Stepper Bar: Flex container with step node badges and connecting progress bars.
2. SVG Progress Lines: Animate `scaleX` or `width` of connecting fill bar.
3. Checkmark Animation: Animate SVG path `stroke-dashoffset` from length to 0.
4. ARIA Stepper: `aria-current=\"step\"` on active node with accessible progress bar markup.""",
        "modularity": "Decompose into `Stepper.tsx` (<120 LoC), `StepNode.tsx` (<90 LoC), and `stepperStyles.ts` (<40 LoC)."
    },
    {
        "id": "bounce-cards",
        "name": "Bounce Cards",
        "category": "Components",
        "overview": "Bounce Cards renders a stack of image cards that explode outward in playful randomized directions with bouncy physics on hover and snap back on leave.",
        "props": r"""interface BounceCardsProps {
  /** Array of card images */
  images: string[];
  /** Maximum scatter distance in pixels (default: 80) */
  scatterDistance?: number;
  /** Card dimensions [width, height] in pixels (default: [160, 220]) */
  cardSize?: [number, number];
  /** Custom CSS classes */
  className?: string;
}""",
        "timing": r"Cards scatter in $400\text{ms}$ with bouncy spring overshoot `(0.34, 1.56, 0.64, 1)`. Return snap takes $300\text{ms}$.",
        "math": r"""For card $k \in [0, N-1]$:
Collapsed state:
$$x_k = 0, \quad y_k = 0, \quad \theta_k = (k - 1) \cdot 4^\circ$$
Scattered target coordinates:
$$x_{target, k} = D \cdot \cos\left(\frac{2\pi k}{N}\right), \quad y_{target, k} = D \cdot \sin\left(\frac{2\pi k}{N}\right)$$
$$\theta_{target, k} = \theta_k + \text{rand}(-15^\circ, 15^\circ)$$""",
        "interaction": "Hovering container scatters cards outward in a vibrant fan explosion. Cards return to neat stack on mouse leave.",
        "implementation": r"""1. Relative Stack: Container with centered absolute card stack.
2. WAAPI Transform: Animate `translate3d(x, y, 0) rotate(theta)` on hover state toggle.
3. Shadow Flare: Drop shadow expands during scatter phase.
4. Touch Tap: Toggles scatter state on mobile tap.""",
        "modularity": "Organized into `BounceCards.tsx` (<120 LoC), `BounceCardItem.tsx` (<80 LoC), and `bounceMath.ts` (<50 LoC)."
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

print(f"Generated {len(ITEMS)} Component prompts in {PROMPTS_DIR}")
