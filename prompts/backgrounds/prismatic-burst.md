# Prismatic Burst (Backgrounds)

## 1. Overview & Visual Behavior
Prismatic Burst renders expanding geometric rainbow bursts, prismatic light flares, and kaleidoscope refraction patterns radiating from the center.

## 2. Props & Configuration Interface
```typescript
interface PrismaticBurstProps {
  /** Prism burst ray count (default: 24) */
  rayCount?: number;
  /** Expansion speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous kaleidoscope rotation and radial expansion at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Kaleidoscope Fold Angle $\theta_k = \frac{\pi}{N_{folds}}$:
$$\theta' = |\text{mod}(\theta, 2\theta_k) - \theta_k|$$
Prismatic color stop mapping:
$$C(r, \theta') = \text{hsl}(r \cdot 360^\circ / R_{max} + \omega t, \ 90\%, \ 60\%)$$

## 5. Interaction Mechanics
Mouse drag rotates the kaleidoscope prism symmetry axes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas 2D: Renders radial fan of symmetric triangle facets.
2. Additive Blend: High luminosity screen blending.
3. Auto Scaled Viewport: Full screen responsiveness.
4. Lightweight Loop: Low-poly mathematical rendering.

## 7. Modularity & File Organization
Decompose into `PrismaticBurst.tsx` (<110 LoC) and `burstMath.ts` (<60 LoC).
