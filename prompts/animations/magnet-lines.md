# Magnet Lines (Animations)

## 1. Overview & Visual Behavior
Magnet Lines displays an array of directional tick marks or vector lines that rotate synchronously to point directly at the mouse cursor like iron filings in a magnetic field.

## 2. Props & Configuration Interface
```typescript
interface MagnetLinesProps {
  /** Grid columns count (default: 20) */
  columns?: number;
  /** Grid rows count (default: 12) */
  rows?: number;
  /** Line segment length in pixels (default: 24) */
  lineLength?: number;
  /** Line color (default: 'rgba(255, 255, 255, 0.4)') */
  color?: string;
  /** Line thickness in pixels (default: 2) */
  lineWidth?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Vector angles update in real-time at 60/120 FPS. Lines smoothly return to default horizontal orientation when pointer leaves.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For line at grid position $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Target magnetic orientation angle:
$$\theta_{target}(i, j) = \arctan2(y_c - y_{i,j}, \ x_c - x_{i,j})$$
Angle smoothing via angular lerp:
$$\theta(t) = \theta(t-1) + \alpha \cdot \text{shortestAngleDiff}(\theta_{target}, \theta(t-1))$$
Color brightness boost based on proximity:
$$I_{i,j} = \text{clamp}\left(1 - \frac{d_{i,j}}{R_{max}}, 0.2, 1.0\right)$$

## 5. Interaction Mechanics
Lines follow pointer orientation across entire screen, creating realistic electromagnetic field visualization.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Rendering: Single canvas layer rendering all line segments in batch.
2. Fast Matrix Transforms: Use `ctx.setTransform()` or direct trigonometry `x1, y1 -> x2, y2`.
3. Auto Idle: Stop rendering loop when mouse is stationary and angles have settled.
4. Responsive Resizing: Recompute grid cell coordinates on viewport resize.

## 7. Modularity & File Organization
Decompose into `MagnetLines.tsx` (<120 LoC), `MagnetCanvas.ts` (<110 LoC), and `vectorMath.ts` (<60 LoC).
