# Dot Field (Backgrounds)

## 1. Overview & Visual Behavior
Dot Field renders a 3D perspective field of glowing dot matrix nodes that wave with sinusoidal undulation and react to pointer distance.

## 2. Props & Configuration Interface
```typescript
interface DotFieldProps {
  /** Dot grid columns (default: 30) */
  columns?: number;
  /** Dot grid rows (default: 20) */
  rows?: number;
  /** Dot radius in pixels (default: 2) */
  dotRadius?: number;
  /** Dot color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous 3D wave undulation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For grid dot $(i, j)$ with rest position $(x_{i,j}, y_{i,j})$:
Elevation wave:
$$z(i, j, t) = A \sin(0.3i + \omega t) \cos(0.3j + \omega t)$$
Perspective Scale:
$$\text{scale}_{i,j} = \frac{d_{cam}}{d_{cam} + z(i, j, t)}$$
Rendered dot radius $R = R_0 \cdot \text{scale}_{i,j}$.
Proximity displacement from mouse:
$$\Delta z = A_{mouse} \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Mouse cursor depresses or elevates adjacent 3D dot nodes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Points: Draw circular dots with `ctx.arc()` in batch.
2. Perspective Depth Sorting: Render dots from back to front.
3. Variable Opacity: Alpha scales with perspective depth.
4. Auto Resize: Centers dot matrix on window resize.

## 7. Modularity & File Organization
Organized into `DotField.tsx` (<110 LoC) and `dotFieldMath.ts` (<60 LoC).
