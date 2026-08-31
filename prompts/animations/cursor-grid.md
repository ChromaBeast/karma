# Cursor Grid (Animations)

## 1. Overview & Visual Behavior
Cursor Grid renders an interactive matrix of grid cells, crosshairs, or dot nodes that illuminate, orient, and scale dynamically as the cursor sweeps across the viewport.

## 2. Props & Configuration Interface
```typescript
interface CursorGridProps {
  /** Grid cell spacing in pixels (default: 40) */
  cellSize?: number;
  /** Cursor influence radius in pixels (default: 160) */
  radius?: number;
  /** Cell highlight color */
  highlightColor?: string;
  /** Base grid border/dot color */
  baseColor?: string;
  /** Indicator type (default: 'crosshair') */
  variant?: 'crosshair' | 'dot' | 'square' | 'line';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Cell illumination rises instantly ($<16	ext{ms}$) and decays exponentially over $500	ext{ms}$ after pointer passes.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For cell $(i, j)$ at center $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Distance:
$$d_{i,j} = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$$
Normalized brightness:
$$B_{i,j}(t) = \max\left(B_{i,j}(t-1) \cdot \lambda, \ \text{clamp}\left(1 - \frac{d_{i,j}}{R}, 0, 1\right)\right)$$
where $\lambda = 0.92$ is decay coefficient per frame.
Orientation angle towards cursor:
$$\theta_{i,j} = \arctan2(y_c - y_{i,j}, \ x_c - x_{i,j})$$

## 5. Interaction Mechanics
Real-time mouse tracking over viewport. Clicking fires a bright shockwave propagating across grid cells.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas / SVG Grid: Single `<canvas>` layer spanning container width and height.
2. Fast Distance Loop: Iterate only cells within cursor bounding square $(x_c \pm R, y_c \pm R)$.
3. Device Pixel Ratio: Scale canvas by `window.devicePixelRatio` for razor-sharp crosshairs.
4. Auto Idle: Pause RAF loop when brightness values across all cells decay to zero.

## 7. Modularity & File Organization
Decompose into `CursorGrid.tsx` (<120 LoC), `GridRenderer.ts` (<110 LoC), and `gridTypes.ts` (<40 LoC).
