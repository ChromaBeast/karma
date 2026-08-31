# Card Nav (Components)

## 1. Overview & Visual Behavior
Card Nav renders an expandable navigation menu composed of stacked micro-cards that fan out into a grid of navigation destinations on click with staggered spring physics.

## 2. Props & Configuration Interface
```typescript
interface CardNavProps {
  /** Array of navigation card items */
  items: { id: string; title: string; icon?: React.ReactNode; href?: string; description?: string }[];
  /** Menu open state */
  isOpen?: boolean;
  /** On toggle callback */
  onToggle?: (open: boolean) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Cards fan out over $450\text{ms}$ with spring overshoot `(0.34, 1.3, 0.64, 1)`. Stagger delay is $35\text{ms}$ per card.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For card $k \in [0, N-1]$:
Collapsed state:
$$\text{translate3d}(0, k \cdot 4\text{px}, -k \cdot 10\text{px}) \text{ scale}(1 - k \cdot 0.04)$$
Expanded grid position $(x_k, y_k)$:
$$x_k = (k \bmod C) \cdot (W_{card} + \text{gap}), \quad y_k = \lfloor k / C \rfloor \cdot (H_{card} + \text{gap})$$
Interpolation progress:
$$\vec{p}_k(t) = \text{lerp}(\vec{p}_{collapsed, k}, \vec{p}_{expanded, k}, f(\tau_k))$$

## 5. Interaction Mechanics
Clicking trigger fans out cards into full navigation menu. Hovering cards elevates them.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Fixed / Sticky Menu Root: Positioned at navigation bar header.
2. WAAPI Fan Out: Staggered animation of `transform` and `opacity`.
3. Keyboard Trapping: Focus trapped within open card menu with Escape to close.
4. Responsive Grid: Adapts column count from 1 (mobile) to 3 (desktop).

## 7. Modularity & File Organization
Decompose into `CardNav.tsx` (<130 LoC), `NavCardItem.tsx` (<90 LoC), and `cardNavMath.ts` (<50 LoC).
