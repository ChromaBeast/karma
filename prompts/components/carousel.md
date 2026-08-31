# Carousel (Components)

## 1. Overview & Visual Behavior
Carousel provides a high-performance touch-enabled slider with smooth spring drag inertia, pagination indicators, autoplay controls, and zero layout shift.

## 2. Props & Configuration Interface
```typescript
interface CarouselProps {
  /** Slide elements */
  children: React.ReactNode[];
  /** Auto-play interval in milliseconds (0 to disable, default: 4000) */
  autoplayInterval?: number;
  /** Show pagination dots (default: true) */
  showPagination?: boolean;
  /** Show prev/next arrow buttons (default: true) */
  showArrows?: boolean;
  /** Active slide change callback */
  onSlideChange?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Slide transition duration $450\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Drag drag-release settles via spring solver in $350\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For slide index $k \in [0, N-1]$:
Track displacement $X(t)$:
$$X(t) = -(k \cdot 100\% + X_{drag})$$
Spring recovery if released before threshold ($|X_{drag}| < X_{thresh}$):
$$X_{drag}(t) = X_{drag}(0) \cdot e^{-\zeta \omega_n t} \cos(\omega_d t)$$

## 5. Interaction Mechanics
Touch swipe and mouse drag with rubber-band resistance at boundaries. Full keyboard arrow navigation.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Track Container: `overflow-hidden w-full relative flex`.
2. GPU Sliding: `transform: translate3d(X, 0, 0)` applied to slide ribbon track.
3. Autoplay Timer: Pauses on pointer hover or focus-visible.
4. ARIA Carousel: Implements WAI-ARIA Carousel Design Pattern.

## 7. Modularity & File Organization
Organized into `Carousel.tsx` (<130 LoC), `CarouselTrack.tsx` (<90 LoC), and `useCarouselAutoplay.ts` (<70 LoC).
