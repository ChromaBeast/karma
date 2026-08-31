# Ghost Cursor (Animations)

## 1. Overview & Visual Behavior
Ghost Cursor leaves a fading ethereal trail of translucent cursor clones that capture historical pointer coordinates with smooth spline interpolation and alpha decay.

## 2. Props & Configuration Interface
```typescript
interface GhostCursorProps {
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
}
```

## 3. Animation Specifications & Timing
Trail updates continuously at 60 FPS. Individual ghost points fade out over $500	ext{ms}$ ($100\% 	o 0\%$ alpha).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Buffer of history points $[P_0, P_1, \dots, P_N]$ sampled at $t_k$:
Point opacity decay:
$$\alpha_k = \left(1 - \frac{k}{N}\right)^{1.5}$$
Point scale shrinkage:
$$S_k = 1 - \frac{k}{N} \cdot 0.6$$
Catmull-Rom spline interpolation between points:
$$P(s) = 0.5 \cdot \left((2P_1) + (-P_0 + P_2)s + (2P_0 - 5P_1 + 4P_2 - P_3)s^2 + (-P_0 + 3P_1 - 3P_2 + P_3)s^3\right)$$

## 5. Interaction Mechanics
Generates fluid smoke-like trail behind fast mouse movements.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Circular History Buffer: Fixed-size ring buffer storing `(x, y, timestamp)`.
2. Canvas / SVG Path: Draw ribbon or connected ghost circles with decreasing opacity.
3. Time-Based Pruning: Remove old points when age exceeds trail duration.
4. Composite Optimization: Pointer events none, composite layer.

## 7. Modularity & File Organization
Organized into `GhostCursor.tsx` (<120 LoC), `useHistoryBuffer.ts` (<80 LoC), and `splineInterpolation.ts` (<60 LoC).
