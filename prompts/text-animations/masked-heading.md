# Masked Heading (Text Animations)

## 1. Overview & Visual Behavior
Masked Heading reveals typography using dynamic geometric clip-paths, SVG masks, or radial spotlight gradients that follow pointer coordinates or scroll progress. Delivers high visual contrast between masked and unmasked text layers.

## 2. Props & Configuration Interface
```typescript
interface MaskedHeadingProps {
  /** Heading text content */
  text: string;
  /** HTML semantic heading tag (default: 'h1') */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  /** Mask style: spotlight following pointer, linear wipe, or radial gradient */
  maskType?: 'spotlight' | 'linear-wipe' | 'radial' | 'svg';
  /** Spotlight radius in pixels (default: 160) */
  spotlightRadius?: number;
  /** Reveal progress [0..1] when controlled externally by scroll */
  progress?: number;
  /** Color of exposed highlight text */
  revealColor?: string;
  /** Base background color of unmasked text */
  baseColor?: string;
  /** Custom CSS class names */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Scroll/linear reveals transition over 600ms with cubic-bezier `(0.25, 1, 0.5, 1)`. Pointer tracking spotlight executes at 60/120 FPS with an exponential lerp factor $\alpha = 0.15$ ($16\text{ms}$ lag response).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer coordinates $(x_c, y_c)$ are smoothed via discrete exponential low-pass filter:
$$x_c(t) = x_c(t-1) + \alpha \cdot (x_{target} - x_c(t-1))$$
$$y_c(t) = y_c(t-1) + \alpha \cdot (y_{target} - y_c(t-1))$$
CSS mask-image definition:
$$\text{mask}(x, y) = \text{radial-gradient}(R\text{px at } x_c\text{px } y_c\text{px}, \#fff \ 0\%, \#fff \ 70\%, \text{transparent } 100\%)$$
For linear scroll wipes at angle $\theta$:
$$\text{clip-path: polygon}(0\% \ 0\%, p \cdot 100\% \ 0\%, (p - 0.15) \cdot 100\% \ 100\%, 0\% \ 100\%)$$

## 5. Interaction Mechanics
Attaches `pointermove` to element bounding box. On touch devices, automatically falls back to continuous gentle pulse animation or scroll-driven reveal.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Text Layering: Underlay renders inactive text with `baseColor`; absolute overlay renders highlight text.
2. GPU Masking: Apply `mask-image` or `clip-path` with `will-change: mask-image, transform`.
3. CSS Custom Properties: Update `--mask-x` and `--mask-y` directly on element style inside `requestAnimationFrame` loop.
4. Fallback: Uses `background-clip: text` if CSS masks are unsupported.

## 7. Modularity & File Organization
Divided into `MaskedHeading.tsx` (<120 LoC), `usePointerMask.ts` (<80 LoC), and `maskCalculations.ts` (<60 LoC).
