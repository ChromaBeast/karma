# Animated List (Components)

## 1. Overview & Visual Behavior
Animated List renders dynamic lists where additions, removals, and reorderings animate smoothly with FLIP (First, Last, Invert, Play) layout animations and zero jumpiness.

## 2. Props & Configuration Interface
```typescript
interface AnimatedListProps<T> {
  /** Array of data items */
  items: T[];
  /** Key extractor function */
  keyExtractor: (item: T) => string;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Animation preset (default: 'fade-slide') */
  variant?: 'fade-slide' | 'scale' | 'pop';
  /** Stagger delay in milliseconds (default: 30) */
  stagger?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
FLIP layout reordering animations execute over $350\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Insertions and deletions take $250\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
FLIP Technique Equations:
1. First: Record bounding rect $R_{first} = (x_1, y_1)$.
2. Last: Update DOM state, record $R_{last} = (x_2, y_2)$.
3. Invert: Compute delta:
   $$\Delta x = x_1 - x_2, \quad \Delta y = y_1 - y_2$$
   Apply `transform: translate3d(\Delta x, \Delta y, 0)`.
4. Play: Transition transform to `translate3d(0, 0, 0)`.
   $$y(t) = \Delta y \cdot (1 - f(\tau))$$

## 5. Interaction Mechanics
Smoothly updates when items are added, filtered, or reordered.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. FLIP Hook: Custom `useFLIP` hook capturing DOM rects before and after render cycles.
2. WAAPI Keyframes: Animate inverse transforms on composite thread.
3. Exit Animation: Hold exiting DOM elements in temporary exit portal until animation finishes.
4. Zero Dependency: Pure native Web Animations API without Framer Motion.

## 7. Modularity & File Organization
Decompose into `AnimatedList.tsx` (<120 LoC), `useFLIP.ts` (<100 LoC), and `listVariants.ts` (<50 LoC).
