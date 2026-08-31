# Infinite Menu (Components)

## 1. Overview & Visual Behavior
Infinite Menu renders a seamless 2D circular menu ring that rotates infinitely, keeping menu items oriented upright with depth scaling and active selection.

## 2. Props & Configuration Interface
```typescript
interface InfiniteMenuProps {
  /** Menu items */
  items: { id: string; title: string; icon?: React.ReactNode; link?: string }[];
  /** Radius of circular menu in pixels (default: 200) */
  radius?: number;
  /** Selection change callback */
  onSelect?: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Inertial rotation decelerates over $600\text{ms}$ ($\mu = 0.94$). Active item snap animation takes $250\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ items with angular spacing $\Delta\theta = \frac{2\pi}{N}$:
Item $k$ position at continuous angle $\theta_k(t)$:
$$x_k = R \cdot \sin(\theta_k(t)), \quad y_k = R \cdot \cos(\theta_k(t))$$
Billboard compensation angle to keep text horizontal:
$$\text{transform: translate3d}(x_k, y_k, 0) \text{ rotate}(0\text{deg})$$

## 5. Interaction Mechanics
Drag or scroll wheel spins menu ring. Clicking any item snaps it to the active 12 o'clock anchor.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Ring Stage: Absolute positioning of items around origin $(0, 0)$.
2. Inertial Drag Hook: Compute angular deltas on pointer drag.
3. Snap Solver: Smoothly interpolates angle to closest item on release.
4. Keyboard Accessible: Arrow keys cycle through menu items.

## 7. Modularity & File Organization
Organized into `InfiniteMenu.tsx` (<120 LoC), `useRingRotation.ts` (<90 LoC), and `ringMath.ts` (<50 LoC).
