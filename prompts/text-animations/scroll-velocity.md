# Scroll Velocity (Text Animations)

## 1. Overview & Visual Behavior
Scroll Velocity powers high-speed bidirectional marquee ribbons whose horizontal translation velocity scales proportionally with window scrolling speed and direction.

## 2. Props & Configuration Interface
```typescript
interface ScrollVelocityProps {
  /** Text content repeated in marquee */
  text: string;
  /** Base translation velocity in pixels/second (default: 100) */
  baseVelocity?: number;
  /** Scroll acceleration multiplier (default: 5.0) */
  scrollMultiplier?: number;
  /** Number of text repetitions for seamless loop (default: 4) */
  numCopies?: number;
  /** Invert scroll direction influence (default: false) */
  reverse?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Velocity responds instantaneously to scroll events ($<16\text{ms}$) and decays back to base velocity over $600\text{ms}$ via exponential friction.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Horizontal translation velocity $V(t)$:
$$V(t) = V_{base} + M \cdot V_{scroll}(t)$$
where $V_{scroll}(t) = \frac{\Delta Y_{scroll}}{\Delta t}$.
Velocity smoothing via exponential decay:
$$V_{smooth}(t) = V_{smooth}(t-1) + \alpha \cdot (V(t) - V_{smooth}(t-1))$$
Marquee offset:
$$X(t) = (X(t-1) + V_{smooth}(t) \cdot \Delta t) \bmod L_{content}$$

## 5. Interaction Mechanics
Scrolling down accelerates marquee to the right/left; scrolling up reverses direction.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Track Marquee: Render duplicated content ribbons inside `overflow-hidden` container.
2. Scroll Velocity Tracker: Measure scroll deltas using passive window scroll listener.
3. Transform Loop: Update `transform: translate3d(x, 0, 0)` in `requestAnimationFrame`.
4. Wrap-Around Math: Reset offset seamlessly when $X > L_{copy}$ to maintain infinite loop.

## 7. Modularity & File Organization
Organized into `ScrollVelocity.tsx` (<130 LoC), `useScrollVelocity.ts` (<100 LoC), and `velocityMath.ts` (<50 LoC).
