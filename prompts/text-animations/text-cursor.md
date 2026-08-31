# Text Cursor (Text Animations)

## 1. Overview & Visual Behavior
Text Cursor renders custom dynamic typography directly attached to the mouse pointer, displaying contextual labels, trailing status badges, or rotating text rings following pointer velocity.

## 2. Props & Configuration Interface
```typescript
interface TextCursorProps {
  /** Text string displayed inside floating cursor badge */
  text: string;
  /** Lag smoothing factor [0..1] (default: 0.18) */
  smoothing?: number;
  /** Cursor badge background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Hide native system cursor (default: true) */
  hideNativeCursor?: boolean;
  /** Scale factor on hoverable elements (default: 1.5) */
  hoverScale?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pointer follower executes at 60/120 FPS with exponential lerp response lag $\Delta t \approx 16\text{ms}$. Scale transition on interactive hover is $200\text{ms}$ `ease-out`.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Cursor coordinates $(x_t, y_t)$ smoothed via lerp:
$$x(t) = x(t-1) + \alpha \cdot (x_{mouse} - x(t-1))$$
$$y(t) = y(t-1) + \alpha \cdot (y_{mouse} - y(t-1))$$
Velocity vector for tilt/squash distortion:
$$v_x = x(t) - x(t-1), \quad v_y = y(t) - y(t-1)$$
$$\text{tiltAngle} = \arctan2(v_y, v_x)$$
$$\text{scaleX} = 1 + \min\left(\frac{\|\vec{v}\|}{50}, 0.4\right), \quad \text{scaleY} = 1 - \min\left(\frac{\|\vec{v}\|}{100}, 0.2\right)$$

## 5. Interaction Mechanics
Follows pointer globally. Automatically detects hovering over `<a>`, `<button>`, or `[data-cursor]` to swap text label or expand scale.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Global Event Listener: Attach `pointermove` to `window` and store coordinates in mutable refs.
2. Portal Overlay: Render fixed overlay with `pointer-events: none; z-index: 9999`.
3. WAAPI / Transforms: Update cursor badge `transform: translate3d(x, y, 0)` on composite thread.
4. Touch Device Guard: Automatically hide text cursor on touch/mobile devices via `@media (hover: hover)`.

## 7. Modularity & File Organization
Decompose into `TextCursor.tsx` (<120 LoC), `usePointerVelocity.ts` (<90 LoC), and `cursorStyles.ts` (<50 LoC).
