# Particle Text (Text Animations)

## 1. Overview & Visual Behavior
Particle Text rasterizes typography onto an offscreen canvas, samples luminance to create a coordinate grid of particles, and simulates real-time physics including cursor repulsion, spring equilibrium return, velocity damping, and jitter turbulence.

## 2. Props & Configuration Interface
```typescript
interface ParticleTextProps {
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
}
```

## 3. Animation Specifications & Timing
Physics simulation runs continuously at display refresh rate (60/120 FPS). Particle displacement rise time is $<16\text{ms}$, and spring settling duration is $\approx 550\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For particle $i$ with current position $\vec{p}_i = (x_i, y_i)$, rest position $\vec{p}_{0,i} = (x_{0,i}, y_{0,i})$, and cursor $\vec{p}_{c} = (x_c, y_c)$:
1. Restoring Spring Force:
   $$\vec{F}_{spring} = -k \cdot (\vec{p}_i - \vec{p}_{0,i})$$
2. Cursor Repulsion Force ($r = \|\vec{p}_i - \vec{p}_c\|$):
   $$\vec{F}_{rep} = \begin{cases} \frac{G}{r^2 + \epsilon} \cdot \frac{\vec{p}_i - \vec{p}_c}{r} & \text{if } r < R_{rep} \\ 0 & \text{otherwise} \end{cases}$$
3. Velocity Integration:
   $$\vec{v}_i(t + \Delta t) = \left(\vec{v}_i(t) + \frac{\vec{F}_{spring} + \vec{F}_{rep}}{m} \cdot \Delta t\right) \cdot c$$
   $$\vec{p}_i(t + \Delta t) = \vec{p}_i(t) + \vec{v}_i(t + \Delta t) \cdot \Delta t$$

## 5. Interaction Mechanics
Mouse move updates cursor position vector. Clicks trigger a high-velocity radial impulse wave radiating outward from click origin.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Rasterization: Render text to offscreen canvas using `ctx.fillText()` and extract pixel buffer with `ctx.getImageData()`.
2. Particle Buffer: Pack active particle coordinates into typed arrays `Float32Array` for cache-friendly memory access.
3. Canvas Render Loop: Clear canvas and draw particle paths in a batch using `ctx.arc()` or WebGL instanced point drawing.
4. Resource Cleanup: Cancel `requestAnimationFrame` handle and dispose typed buffers upon unmount.

## 7. Modularity & File Organization
Organized into `ParticleText.tsx` (<110 LoC), `ParticleEngine.ts` (<150 LoC), `rasterizer.ts` (<80 LoC), and `particleTypes.ts` (<50 LoC).
