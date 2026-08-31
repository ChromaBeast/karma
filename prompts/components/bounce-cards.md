# Bounce Cards (Components)

## 1. Overview & Visual Behavior
Bounce Cards renders a stack of image cards that explode outward in playful randomized directions with bouncy physics on hover and snap back on leave.

## 2. Props & Configuration Interface
```typescript
interface BounceCardsProps {
  /** Array of card images */
  images: string[];
  /** Maximum scatter distance in pixels (default: 80) */
  scatterDistance?: number;
  /** Card dimensions [width, height] in pixels (default: [160, 220]) */
  cardSize?: [number, number];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Cards scatter in $400\text{ms}$ with bouncy spring overshoot `(0.34, 1.56, 0.64, 1)`. Return snap takes $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For card $k \in [0, N-1]$:
Collapsed state:
$$x_k = 0, \quad y_k = 0, \quad \theta_k = (k - 1) \cdot 4^\circ$$
Scattered target coordinates:
$$x_{target, k} = D \cdot \cos\left(\frac{2\pi k}{N}\right), \quad y_{target, k} = D \cdot \sin\left(\frac{2\pi k}{N}\right)$$
$$\theta_{target, k} = \theta_k + \text{rand}(-15^\circ, 15^\circ)$$

## 5. Interaction Mechanics
Hovering container scatters cards outward in a vibrant fan explosion. Cards return to neat stack on mouse leave.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Relative Stack: Container with centered absolute card stack.
2. WAAPI Transform: Animate `translate3d(x, y, 0) rotate(theta)` on hover state toggle.
3. Shadow Flare: Drop shadow expands during scatter phase.
4. Touch Tap: Toggles scatter state on mobile tap.

## 7. Modularity & File Organization
Organized into `BounceCards.tsx` (<120 LoC), `BounceCardItem.tsx` (<80 LoC), and `bounceMath.ts` (<50 LoC).
