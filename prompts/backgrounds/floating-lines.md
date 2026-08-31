# Floating Lines (Backgrounds)

## 1. Overview & Visual Behavior
Floating Lines renders geometric wireframe spline lines drifting in 3D space with depth fading and gentle parallax rotation.

## 2. Props & Configuration Interface
```typescript
interface FloatingLinesProps {
  /** Line count (default: 12) */
  lineCount?: number;
  /** Line color */
  color?: string;
  /** Drift velocity (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous 3D line floating at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For 3D spline line $k$ with control points $[\vec{P}_0, \vec{P}_1, \vec{P}_2, \vec{P}_3]$:
$$\vec{P}_j(t) = \vec{P}_{0,j} + \vec{A}_j \sin(\vec{\omega}_j t + \vec{\phi}_j)$$
Perspective projection to 2D screen coordinates:
$$x_s = \frac{x \cdot d}{z + d}, \quad y_s = \frac{y \cdot d}{z + d}$$

## 5. Interaction Mechanics
Mouse movement rotates the 3D viewing angle of the floating lines.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Draw smooth cubic Bézier curves through projected points.
2. Depth Fading: Line alpha scales proportionally with Z depth.
3. Clean Loop: Single RAF loop updating control points.
4. Lightweight: $<1\%$ CPU utilization.

## 7. Modularity & File Organization
Organized into `FloatingLines.tsx` (<110 LoC) and `lineMath.ts` (<60 LoC).
