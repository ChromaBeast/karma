# Echo Text (Text Animations)

## 1. Overview & Visual Behavior
Echo Text renders trailing translucent typography clones that follow pointer motion or scroll velocity with decaying opacity, chromatic color shifts, and staggered elastic spring delays.

## 2. Props & Configuration Interface
```typescript
interface EchoTextProps {
  /** Text content */
  text: string;
  /** Number of echo ghost clones (default: 5) */
  echoCount?: number;
  /** Spring lag delay between successive echoes in milliseconds (default: 40) */
  lagMs?: number;
  /** Opacity decay factor per echo layer (default: 0.6) */
  opacityDecay?: number;
  /** Chromatic aberration color offset array */
  colorPalette?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Echo clones follow lead element with a series of 1st-order lag filters ($	au_k = k \cdot 40	ext{ms}$). Settles within $400	ext{ms}$ after motion stops.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For echo layer $k \in [1, N]$ at time $t$:
$$ec{p}_k(t) = ec{p}_k(t - \Delta t) + rac{\Delta t}{	au_k} \cdot (ec{p}_{k-1}(t) - ec{p}_k(t - \Delta t))$$
where $ec{p}_0(t)$ is cursor/scroll target coordinate.
Echo layer opacity:
$$lpha_k = lpha_0 \cdot (	ext{opacityDecay})^k$$
Scale reduction:
$$s_k = 1 - k \cdot 0.03$$

## 5. Interaction Mechanics
Continuously reacts to pointer movement across viewport or scroll deltas. Disables trailing on touch devices to conserve battery.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Ghost Array: Maintain buffer of past positions $[(x_1, y_1), \dots, (x_N, y_N)]$.
2. Layer Stack: Absolute positioning with pointer-events: none and mix-blend-mode: screen.
3. GPU Acceleration: Apply `transform: translate3d(x, y, 0) scale(s)`.
4. Loop: Single `requestAnimationFrame` updates all echo positions simultaneously.

## 7. Modularity & File Organization
Decompose into `EchoText.tsx` (<130 LoC), `useEchoTrail.ts` (<100 LoC), and `echoStyles.ts` (<50 LoC).
