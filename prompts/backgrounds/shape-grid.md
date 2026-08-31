# Shape Grid (Backgrounds)

## 1. Overview & Visual Behavior
Shape Grid renders a geometric matrix of triangles, hexagons, or diamonds that rotate, scale, and morph dynamically with mouse proximity.

## 2. Props & Configuration Interface
```typescript
interface ShapeGridProps {
  /** Shape geometry (default: 'hexagon') */
  shape?: 'hexagon' | 'triangle' | 'diamond' | 'circle';
  /** Cell spacing in pixels (default: 48) */
  spacing?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Shape rotations update at 60/120 FPS with spring settling ($250\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For shape $(i, j)$ at center $(x_{i,j}, y_{i,j})$:
Distance to mouse $d = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$.
Rotation angle $\theta_{i,j}$:
$$\theta_{i,j} = \theta_0 + \theta_{max} \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$
Hexagon vertex coordinates for radius $R$:
$$V_k = (x_{i,j} + R \cos(k \pi / 3 + \theta), \ y_{i,j} + R \sin(k \pi / 3 + \theta)) \quad \text{for } k \in [0, 5]$$

## 5. Interaction Mechanics
Moving mouse creates dynamic geometric rotation waves across shapes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Batch Polygons: Draw regular polygons using `ctx.lineTo()`.
2. Spatial Partitioning: Optimize distance queries to nearby shapes.
3. Device Pixel Ratio: Sharp vector rendering.
4. Auto Sleeping: Pauses loop when shapes settle.

## 7. Modularity & File Organization
Decompose into `ShapeGrid.tsx` (<120 LoC) and `shapeGridMath.ts` (<60 LoC).
