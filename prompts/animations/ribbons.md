# Ribbons (Animations)

## 1. Overview & Visual Behavior
Ribbons generates 3D undulating polygon ribbons that twist, fold, and flow through space using parametric Bézier splines and WebGL/Canvas shading.

## 2. Props & Configuration Interface
```typescript
interface RibbonsProps {
  /** Number of ribbon streams (default: 5) */
  ribbonCount?: number;
  /** Ribbon width in pixels (default: 30) */
  ribbonWidth?: number;
  /** Flow velocity speed (default: 1.0) */
  speed?: number;
  /** Color palette array */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous 3D flow with ribbon traveling speed $V = 100	ext{px/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Ribbon centerline curve $\vec{C}(s, t)$ for arc length $s \in [0, 1]$:
$$\vec{C}(s, t) = \left(s \cdot W, \ \frac{H}{2} + A \sin(k s + \omega t), \ B \cos(k s + \omega t)\right)$$
Ribbon edge vertices using normal $\vec{N}(s)$ and binormal $\vec{B}(s)$:
$$\vec{V}_{left}(s) = \vec{C}(s) - \frac{w}{2} \vec{B}(s), \quad \vec{V}_{right}(s) = \vec{C}(s) + \frac{w}{2} \vec{B}(s)$$

## 5. Interaction Mechanics
Mouse drag rotates ribbon view angle in 3D space.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / WebGL: Draw triangle strip mesh along parameterized spine curve.
2. Dynamic Lighting: Shade triangle faces based on surface normal dot light vector.
3. Curve Interpolation: Evaluate Catmull-Rom or cubic spline across control points.
4. Auto Resize: Automatically adjust viewport buffers on window resize.

## 7. Modularity & File Organization
Decompose into `Ribbons.tsx` (<120 LoC), `RibbonEngine.ts` (<140 LoC), and `ribbonMath.ts` (<60 LoC).
