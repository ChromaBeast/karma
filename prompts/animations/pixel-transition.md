# Pixel Transition (Animations)

## 1. Overview & Visual Behavior
Pixel Transition morphs cards, images, or modal dialogs through an animated pixelated mosaic grid where blocks scale and stagger to reveal new content.

## 2. Props & Configuration Interface
```typescript
interface PixelTransitionProps {
  /** Front primary content */
  firstContent: React.ReactNode;
  /** Secondary content revealed on transition */
  secondContent: React.ReactNode;
  /** Pixel grid resolution (e.g. 10 for 10x10 grid, default: 8) */
  gridSize?: number;
  /** Transition animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Stagger delay across grid in milliseconds (default: 20) */
  stagger?: number;
  /** Pixel block color */
  pixelColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Total transition takes $600	ext{ms}$. Pixel blocks scale up to $1.0$ then back down over two $200	ext{ms}$ sub-phases.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For pixel at grid cell $(r, c)$ in $R \times C$ grid:
Distance from activation origin $(r_0, c_0)$:
$$d = \sqrt{(r - r_0)^2 + (c - c_0)^2}$$
Start delay:
$$t_{start}(r, c) = d \cdot \text{stagger}$$
Pixel block scale $S(\tau) \in [0, 1]$:
$$S(\tau) = \sin(\pi \cdot \tau) \quad \text{for } \tau = \text{clamp}\left(\frac{t - t_{start}}{T_{block}}, 0, 1\right)$$

## 5. Interaction Mechanics
Triggers on mouse hover, card click, or state change.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Overlay Grid: Absolute overlay containing $N \times M$ `<div>` block elements.
2. Staggered WAAPI: Animate `scale` and `opacity` of each tile with computed delays.
3. Content Swap: Switch visible DOM child at peak grid opacity ($S = 1$).
4. Clean DOM: Discard grid DOM nodes when idle to preserve memory.

## 7. Modularity & File Organization
Organized into `PixelTransition.tsx` (<120 LoC), `PixelGridOverlay.tsx` (<100 LoC), and `pixelStagger.ts` (<60 LoC).
