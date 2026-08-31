# Grid Scan (Backgrounds)

## 1. Overview & Visual Behavior
Grid Scan renders an isometric or 2D tactical HUD grid with pulsing laser scan waves, coordinate crosshairs, and data packets.

## 2. Props & Configuration Interface
```typescript
interface GridScanProps {
  /** Grid cell spacing in pixels (default: 40) */
  gridSize?: number;
  /** Scan line sweep speed (default: 1.0) */
  speed?: number;
  /** Grid stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous grid scan sweep at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Grid Scan Wavefront:
$$W(x, y, t) = \exp\left(-\frac{(x + y - V t)^2}{2\sigma^2}\right)$$
Grid line illumination:
$$I_{line}(x, y, t) = I_{base} + I_{pulse} \cdot W(x, y, t)$$

## 5. Interaction Mechanics
Hovering illuminates specific grid coordinates and crosshair lines.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / SVG Grid: Single canvas drawing grid paths.
2. Wave Gradient: Dynamic linear gradient sweep along diagonal.
3. Coordinate Tooltip: Live mouse grid coordinate readout.
4. Low CPU: Static grid cached into offscreen canvas.

## 7. Modularity & File Organization
Decompose into `GridScan.tsx` (<120 LoC) and `gridScanMath.ts` (<50 LoC).
