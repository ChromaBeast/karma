# Circular Gallery (Components)

## 1. Overview & Visual Behavior
Circular Gallery arranges photographic cards or portfolio showcases along a 3D curved spherical ring, allowing users to scroll and drag through items with radial perspective.

## 2. Props & Configuration Interface
```typescript
interface CircularGalleryProps {
  /** Array of gallery images */
  items: { id: string; title: string; image: string }[];
  /** Cylinder radius in pixels (default: 600) */
  radius?: number;
  /** Card width in pixels (default: 240) */
  cardWidth?: number;
  /** Card height in pixels (default: 320) */
  cardHeight?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Drag rotation responds instantly. Momentum scroll decelerates over $700\text{ms}$ ($\mu = 0.94$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ items with angular separation $\Delta\theta = \frac{2\pi}{N}$:
Item $i$ position:
$$\theta_i(t) = \theta_0(t) + i \cdot \Delta\theta$$
$$\text{transform: rotateY}(\theta_i\text{ rad}) \text{ translateZ}(R\text{px})$$
Depth fog and opacity:
$$\alpha_i = \text{clamp}(\cos(\theta_i), 0, 1)$$

## 5. Interaction Mechanics
Horizontal dragging spins gallery. Inertia momentum allows free flick navigation.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Scene: `perspective: 1000px; transform-style: preserve-3d; overflow: hidden`.
2. GPU Transforms: Position cards with `rotateY` and `translateZ`.
3. Inertial Hook: Track velocity on pointer up and decay via RAF loop.
4. Touch Swipe: Native touch gesture binding with passive listeners.

## 7. Modularity & File Organization
Decompose into `CircularGallery.tsx` (<120 LoC), `useGalleryRotation.ts` (<90 LoC), and `galleryMath.ts` (<50 LoC).
