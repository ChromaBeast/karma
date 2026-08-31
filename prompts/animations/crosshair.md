# Crosshair (Animations)

## 1. Overview & Visual Behavior
Crosshair renders full-screen horizontal and vertical laser alignment lines following mouse pointer coordinates with coordinate readouts and magnetic grid alignment.

## 2. Props & Configuration Interface
```typescript
interface CrosshairProps {
  /** Crosshair line color (default: 'rgba(255, 255, 255, 0.3)') */
  color?: string;
  /** Line thickness in pixels (default: 1) */
  lineWidth?: number;
  /** Show live coordinate text badge (default: true) */
  showCoordinates?: boolean;
  /** Container ref to restrict crosshair boundaries */
  containerRef?: React.RefObject<HTMLElement>;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Zero-latency pointer tracking updated directly via pointer events at 60/120 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer coordinate state $(x_p, y_p)$:
Horizontal line geometry:
$$y = y_p, \quad x \in [0, W]$$
Vertical line geometry:
$$x = x_p, \quad y \in [0, H]$$
Coordinate readout formatting:
$$\text{text} = \text{\"X: \"} + \lfloor x_p \rfloor + \text{\" | Y: \"} + \lfloor y_p \rfloor$$

## 5. Interaction Mechanics
Follows pointer seamlessly. Snaps to grid lines or interactive element centers when nearby.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Fixed Overlay: Overlay container with `pointer-events: none`.
2. Direct CSS Variable Updates: Update `--cx` and `--cy` directly on pointer move.
3. GPU Lines: Absolute divs positioned with `transform: translate3d(0, var(--cy), 0)`.
4. Snapping Logic: Check nearby DOM bounds and clamp crosshair coordinates.

## 7. Modularity & File Organization
Decompose into `Crosshair.tsx` (<110 LoC) and `useCrosshairSnap.ts` (<80 LoC).
