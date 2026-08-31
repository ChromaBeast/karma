# Strands (Animations)

## 1. Overview & Visual Behavior
Strands renders dynamic flowing fibrous spline strands or neon silk ribbons that undulate with trigonometric waves and sway in response to pointer drag.

## 2. Props & Configuration Interface
```typescript
interface StrandsProps {
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
}
```

## 3. Animation Specifications & Timing
Continuous sinusoidal ribbon flow with period $T = 4.0	ext{s}$. Pointer displacement has $400	ext{ms}$ elastic settling time.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For strand $k \in [1, N]$ with base vertical anchor $y_k$:
Wave profile along horizontal coordinate $x \in [0, W]$:
$$y_k(x, t) = y_k + \sum_{m=1}^3 \frac{A}{m} \sin\left(\frac{2\pi m x}{\lambda} + \omega t + k \cdot \phi\right) + \vec{F}_{mouse}(x)$$
Pointer influence:
$$\vec{F}_{mouse}(x) = A_{drag} \cdot \exp\left(-\frac{(x - x_c)^2}{2\sigma^2}\right) \cdot (y_c - y_k)$$

## 5. Interaction Mechanics
Mouse hover creates localized elastic waves propagating along strand fibers.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Draw smooth Bezier curves using `ctx.bezierCurveTo()`.
2. Multi-Color Blending: Render overlapping strands with `globalCompositeOperation: 'screen'`.
3. Auto Resize: Canvas scales dynamically with container width and height.
4. Zero Dependencies: Pure native Canvas 2D API implementation.

## 7. Modularity & File Organization
Organized into `Strands.tsx` (<120 LoC), `StrandEngine.ts` (<130 LoC), and `strandMath.ts` (<60 LoC).
