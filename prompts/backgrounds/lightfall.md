# Lightfall (Backgrounds)

## 1. Overview & Visual Behavior
Lightfall generates a vertical cascade of luminous light meteors, glowing fiber rain, and trailing neon particles falling gently down the viewport.

## 2. Props & Configuration Interface
```typescript
interface LightfallProps {
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
}
```

## 3. Animation Specifications & Timing
Continuous particle fall at 60 FPS with randomized speed variations.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For falling light streak $k$:
Position:
$$y_k(t) = (y_{0,k} + V_k \cdot t) \bmod (H + L_{trail})$$
$$x_k(t) = x_{0,k} + A \sin(\omega t + \phi_k)$$
Trail stroke linear gradient:
$$\text{gradient} = [(x_k, y_k - L_{trail}) \to (x_k, y_k)], \quad \alpha(s) = \left(\frac{s}{L_{trail}}\right)^2$$

## 5. Interaction Mechanics
Moving mouse creates air turbulence, deflecting falling light streams horizontally.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Rain: Batch draw vertical line gradients with `ctx.createLinearGradient()`.
2. Particle Pool: Fixed array of 100 particle objects avoiding allocations.
3. Wind Turbulence: Add horizontal mouse velocity vector to particle positions.
4. Auto Sleep: Pauses when browser tab is inactive.

## 7. Modularity & File Organization
Organized into `Lightfall.tsx` (<120 LoC), `RainEngine.ts` (<120 LoC), and `rainTypes.ts` (<40 LoC).
