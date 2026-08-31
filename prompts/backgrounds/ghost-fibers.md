# Ghost Fibers (Backgrounds)

## 1. Overview & Visual Behavior
Ghost Fibers renders flowing translucent optical fibers that wave rhythmically like underwater bioluminescent sea anemones or silk filaments.

## 2. Props & Configuration Interface
```typescript
interface GhostFibersProps {
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
}
```

## 3. Animation Specifications & Timing
Continuous wave undulation with fundamental period $T = 5.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For fiber $k$ with anchor $(x_{0,k}, y_{0,k})$:
Parametric spine curve $\vec{P}(s, t)$ for arc length $s \in [0, L]$:
$$x(s, t) = x_{0,k} + \sum_{m=1}^3 A_m \left(\frac{s}{L}\right)^{1.5} \sin(\omega_m t + k \phi_m)$$
$$y(s, t) = y_{0,k} + s$$
Tip opacity glow:
$$\alpha(s) = \left(\frac{s}{L}\right)^2$$

## 5. Interaction Mechanics
Mouse movement repels adjacent fiber tips with spring elasticity.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Render smooth cubic Bézier curves through spine control points.
2. Gradient Strokes: Apply linear stroke gradients fading from dark root to luminous tip.
3. Symplectic Integration: Update fiber tip positions with spring return forces.
4. Low CPU: Limits path rendering to single RAF pass.

## 7. Modularity & File Organization
Decompose into `GhostFibers.tsx` (<120 LoC), `FiberEngine.ts` (<130 LoC), and `fiberMath.ts` (<50 LoC).
