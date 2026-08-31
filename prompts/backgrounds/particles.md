# Particles (Backgrounds)

## 1. Overview & Visual Behavior
Particles renders an ambient field of floating stardust particles with Brownian motion, cursor repulsion, and connection links.

## 2. Props & Configuration Interface
```typescript
interface ParticlesProps {
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
}
```

## 3. Animation Specifications & Timing
Autonomous particle physics at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For particle $i$ with position $\vec{p}_i$ and cursor $\vec{p}_c$:
$$\vec{p}_i(t + \Delta t) = \vec{p}_i(t) + \vec{v}_i \Delta t + \vec{F}_{rep}$$
$$\vec{F}_{rep} = \begin{cases} \frac{\vec{p}_i - \vec{p}_c}{\|\vec{p}_i - \vec{p}_c\|^2} \cdot G & \text{if } \|\vec{p}_i - \vec{p}_c\| < R \\ \vec{0} & \text{otherwise} \end{cases}$$

## 5. Interaction Mechanics
Mouse repels nearby particles; clicking shoots an explosive radial shockwave.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Rendering: Single canvas layer with flat coordinate arrays.
2. Particle Pool: Reusable particle buffer.
3. Device Pixel Ratio: Auto-scaled to device resolution.
4. Auto Sleep: Pauses RAF loop when tab is hidden.

## 7. Modularity & File Organization
Organized into `Particles.tsx` (<120 LoC), `ParticleEngine.ts` (<120 LoC), and `particleTypes.ts` (<40 LoC).
