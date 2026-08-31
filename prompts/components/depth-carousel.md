# Depth Carousel (Components)

## 1. Overview & Visual Behavior
Depth Carousel renders a 3D cylindrical or hyperbolic carousel where active cards sit in sharp foreground focus while adjacent items recede along depth axes with perspective scaling and dynamic lighting.

## 2. Props & Configuration Interface
```typescript
interface DepthCarouselProps {
  /** Array of carousel items */
  items: React.ReactNode[];
  /** Radius of carousel cylinder in pixels (default: 400) */
  radius?: number;
  /** Card width in pixels (default: 300) */
  cardWidth?: number;
  /** Card height in pixels (default: 400) */
  cardHeight?: number;
  /** Auto-play rotation interval in milliseconds (0 to disable, default: 0) */
  autoPlayInterval?: number;
  /** Active card change callback */
  onIndexChange?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Transitions between active cards execute over $500\text{ms}$ with quintic bezier curve `(0.16, 1, 0.3, 1)`. Inertial drag settles within $450\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ carousel cards with angular separation $\Delta\theta = \frac{2\pi}{N}$:
Card $i \in [0, N-1]$ angle:
$$\theta_i(t) = \theta_{rot}(t) + i \cdot \Delta\theta$$
3D Transform Matrix:
$$x_i = R \cdot \sin(\theta_i), \quad z_i = R \cdot (\cos(\theta_i) - 1)$$
$$\text{transform: translate3d}(x_i\text{px}, 0, z_i\text{px}) \text{ rotateY}(\theta_i\text{ rad})$$
Card opacity and brightness:
$$\alpha_i = 0.4 + 0.6 \cdot \left(\frac{\cos(\theta_i) + 1}{2}\right)$$
$$\text{filter: brightness}\left(0.5 + 0.5 \cdot \cos(\theta_i)\right)$$

## 5. Interaction Mechanics
Horizontal drag scrubs carousel angle. Left/Right arrow keys navigate sequentially. Direct clicks select cards.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Stage: Container with `perspective: 1000px; transform-style: preserve-3d`.
2. Inertial Tracker: Pointer tracker computes drag velocity and snaps to nearest $\Delta\theta$ increment.
3. Accessible Nav: Support tab navigation and screen reader live region announcements.
4. Responsive Scale: Adjust radius $R$ and card dimensions based on container width.

## 7. Modularity & File Organization
Decompose into `DepthCarousel.tsx` (<130 LoC), `useCarouselDrag.ts` (<100 LoC), and `depthCarouselStyles.ts` (<50 LoC).
