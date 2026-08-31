# Hyperspeed (Backgrounds)

## 1. Overview & Visual Behavior
Hyperspeed renders a high-velocity sci-fi starfield / highway light streak tunnel with relativistic perspective stretching and acceleration.

## 2. Props & Configuration Interface
```typescript
interface HyperspeedProps {
  /** Star / streak particle count (default: 300) */
  count?: number;
  /** Warp travel speed (default: 600) */
  speed?: number;
  /** Light streak color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous high-speed warp drive translation at $V = 600\text{px/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For star $k$ with 3D position $(x_k, y_k, z_k)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{max}$$
Perspective Projection:
$$x_{screen} = \frac{x_k \cdot d}{z_k}, \quad y_{screen} = \frac{y_k \cdot d}{z_k}$$
Relativistic Light Streak:
$$\text{Line from } \left(\frac{x_k d}{z_k + \Delta z}, \ \frac{y_k d}{z_k + \Delta z}\right) \text{ to } (x_{screen}, y_{screen})$$

## 5. Interaction Mechanics
Mouse coordinates steer the vanishing point of hyperspace star streaks.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / WebGL: Batch draw streak lines radiating from vanishing point.
2. Z-Wrap Buffer: Star positions recycle to $Z_{max}$ when passing camera plane.
3. Velocity Flare: Accelerate warp speed on mouse down.
4. Low CPU: Highly optimized point projection loop.

## 7. Modularity & File Organization
Decompose into `Hyperspeed.tsx` (<120 LoC), `WarpEngine.ts` (<130 LoC), and `warpMath.ts` (<50 LoC).
