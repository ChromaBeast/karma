# Card Swap (Components)

## 1. Overview & Visual Behavior
Card Swap executes a physical 3D card shuffling animation where top cards lift, slide outward, flip to the back of the deck, and tuck into place.

## 2. Props & Configuration Interface
```typescript
interface CardSwapProps {
  /** Array of card elements */
  children: React.ReactNode[];
  /** Auto-shuffle interval in milliseconds (0 to disable, default: 3500) */
  interval?: number;
  /** Card swap animation duration in milliseconds (default: 600) */
  duration?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Card swap executes over $600\text{ms}$ with `cubic-bezier(0.34, 1.3, 0.64, 1)`. Idle dwell between shuffles is $3500\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Normalized swap progress $\tau \in [0, 1]$:
Phase 1 (Lift & Slide Out $\tau \in [0, 0.5]$):
$$x(\tau) = W_{card} \cdot \sin(\pi \tau), \quad z(\tau) = 50\text{px} \cdot \sin(\pi \tau)$$
$$\text{rotZ}(\tau) = 15^\circ \cdot \sin(\pi \tau)$$
Phase 2 (Drop to Back $\tau \in [0.5, 1.0]$):
$$\text{zIndex} \leftarrow \text{back}, \quad x(\tau) \to 0, \quad z(\tau) \to -N \cdot 10\text{px}$$

## 5. Interaction Mechanics
Clicking card deck triggers manual card swap. Pauses on hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Stack Container: `transform-style: preserve-3d; perspective: 800px`.
2. Staggered Z-Index: Maintain card depth indices $[0, 1, \dots, N-1]$.
3. WAAPI Sequence: Animate top card through keyframe bezier trajectory.
4. ARIA Deck: Announce active card to screen readers.

## 7. Modularity & File Organization
Organized into `CardSwap.tsx` (<120 LoC), `useCardSwap.ts` (<90 LoC), and `cardSwapStyles.ts` (<50 LoC).
