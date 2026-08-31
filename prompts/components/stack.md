# Stack (Components)

## 1. Overview & Visual Behavior
Stack renders an interactive Tinder-like swipeable card deck where users can drag, flick, swipe left/right to dismiss cards, and cycle through the stack with spring rebound.

## 2. Props & Configuration Interface
```typescript
interface StackProps {
  /** Array of card elements */
  children: React.ReactNode[];
  /** Card dismissal threshold in pixels (default: 120) */
  dragThreshold?: number;
  /** Callback fired when a card is swiped (direction: 'left' | 'right') */
  onSwipe?: (index: number, direction: 'left' | 'right') => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Card drag tracks pointer at 60/120 FPS. Rebound spring settles in $250\text{ms}$. Dismissal throw animation takes $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Drag translation $(x_d, y_d)$ and rotation angle:
$$\theta = \frac{x_d}{W_{card}} \cdot 15^\circ$$
Card throw dismissal velocity:
$$\vec{v}_{throw} = \vec{v}_{pointer} \cdot 1.5$$
Stacked background cards:
$$S_k = 1 - k \cdot 0.05, \quad Y_k = k \cdot 12\text{px}, \quad \alpha_k = 1 - k \cdot 0.2$$

## 5. Interaction Mechanics
Drag to inspect. Swipe past threshold or flick with high velocity to dismiss.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Stack Layering: Top card active with pointer events; background cards inert.
2. Pointer Drag Physics: Measure displacement and rotation in `pointermove`.
3. Spring Rebound: If released before threshold, animate back to $(0,0)$ via spring solver.
4. Touch Swipe: Native touch action handling (`touch-action: none` on top card).

## 7. Modularity & File Organization
Organized into `Stack.tsx` (<130 LoC), `useSwipeableCard.ts` (<110 LoC), and `stackStyles.ts` (<50 LoC).
