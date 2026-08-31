# Scroll Stack (Components)

## 1. Overview & Visual Behavior
Scroll Stack pins a sequence of cards into a sticky viewport deck as the user scrolls, scaling down and stacking preceding cards with realistic depth shadows.

## 2. Props & Configuration Interface
```typescript
interface ScrollStackProps {
  /** Array of card elements to stack */
  children: React.ReactNode[];
  /** Scale reduction factor per stacked card (default: 0.05) */
  scaleStep?: number;
  /** Top offset distance between stacked cards in pixels (default: 20) */
  offsetStep?: number;
  /** Sticky top anchor in pixels or CSS value (default: '80px') */
  topOffset?: string | number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous scroll-driven progress mapping without fixed time durations. Spring smoothing prevents scroll jitter.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For card $k \in [0, N-1]$ with sticky trigger scroll threshold $Y_k$:
Scroll progress $p_k \in [0, 1]$ after reaching sticky top:
$$p_k = \text{clamp}\left(\frac{Y_{scroll} - Y_k}{H_{card}}, 0, 1\right)$$
Stacked scale:
$$\text{scale}_k = 1 - k \cdot \text{scaleStep} \cdot p_k$$
Top stacking offset:
$$\text{top}_k = \text{topOffset} + k \cdot \text{offsetStep} \cdot p_k$$
Drop shadow darkening:
$$\text{shadowOpacity}_k = k \cdot 0.15 \cdot p_k$$

## 5. Interaction Mechanics
Scroll binds directly to sticky card stacking. Smooth unstacking when scrolling upward.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Sticky Containers: Each card wrapped in a container with `sticky top-[80px]`.
2. Scroll Progress Observer: Calculate individual card progress relative to viewport.
3. Transform Matrix: Apply `transform: scale(calc(var(--scale)))` on card bodies.
4. Layout Isolation: Content retains independent scrollability if needed.

## 7. Modularity & File Organization
Organized into `ScrollStack.tsx` (<120 LoC), `ScrollStackCard.tsx` (<90 LoC), and `stackScrollMath.ts` (<50 LoC).
