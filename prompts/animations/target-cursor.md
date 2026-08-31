# Target Cursor (Animations)

## 1. Overview & Visual Behavior
Target Cursor transforms the mouse cursor into a tactical sci-fi HUD targeting reticle with expanding crosshair brackets, locking on interactive elements with spring snapping.

## 2. Props & Configuration Interface
```typescript
interface TargetCursorProps {
  /** Reticle size in pixels (default: 32) */
  size?: number;
  /** Target lock-on expansion scale (default: 1.6) */
  lockScale?: number;
  /** Reticle stroke color (default: '#00f0ff') */
  color?: string;
  /** Reticle spin speed on lock in seconds (default: 4s) */
  spinSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Snaps to target element bounds within $180	ext{ms}$ using `cubic-bezier(0.2, 0.9, 0.3, 1)`. Reticle spins continuously when locked.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Reticle coordinates $(x_r, y_r)$ interpolate to mouse or target center:
$$(x_r(t), y_r(t)) = \text{lerp}((x_r(t-1), y_r(t-1)), (x_{target}, y_{target}), 0.25)$$
Reticle corner bracket offsets for size $S$:
$$TL = (-S/2, -S/2), \quad TR = (S/2, -S/2), \quad BL = (-S/2, S/2), \quad BR = (S/2, S/2)$$
Lock scale expansion:
$$S(t) = S_0 \cdot (1 + 0.6 \cdot \text{isLocked})$$

## 5. Interaction Mechanics
Detects `[data-target]` or `<a>`, `<button>` elements, locking HUD reticle onto element center with bounding box brackets.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Fixed Portal: Render fixed reticle layer at top z-index with pointer-events: none.
2. Mutation/Hover Observer: Check hovered element tag on `pointermove`.
3. SVG Reticle: 4 SVG bracket corners with center crosshair dot.
4. Touch Guard: Hide automatically on mobile devices.

## 7. Modularity & File Organization
Organized into `TargetCursor.tsx` (<120 LoC), `useTargetLock.ts` (<90 LoC), and `reticleSvg.ts` (<60 LoC).
