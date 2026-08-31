# Pixel Snow (Backgrounds)

## 1. Overview & Visual Behavior
Pixel Snow renders a peaceful retro 8-bit snowfall with square pixel snowflakes drifting, fluttering with wind turbulence, and accumulating on boundaries.

## 2. Props & Configuration Interface
```typescript
interface PixelSnowProps {
  /** Snowflake count (default: 100) */
  flakeCount?: number;
  /** Snowflake size in pixels (default: 4) */
  flakeSize?: number;
  /** Fall speed (default: 60) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous snowfall at 60 FPS with harmonic wind fluttering.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For snowflake $k$:
$$y_k(t) = (y_{0,k} + V_y \cdot t) \bmod H$$
$$x_k(t) = x_{0,k} + A \sin(\omega t + \phi_k) + V_{wind}(t)$$

## 5. Interaction Mechanics
Mouse movement generates localized wind gusts, blowing snow particles.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Rendering: Batch draw square pixels with `ctx.fillRect()`.
2. Particle Array: Flat `Float32Array` holding snowflake states.
3. Wind Turbulence: Global wind vector modulated by mouse velocity.
4. Auto Resize: Adapts particle count to screen dimensions.

## 7. Modularity & File Organization
Decompose into `PixelSnow.tsx` (<110 LoC) and `SnowEngine.ts` (<110 LoC).
