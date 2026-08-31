# Gradual Blur (Animations)

## 1. Overview & Visual Behavior
Gradual Blur generates progressive layered depth-of-field blur gradients across container edges or hero backdrops using multi-layered backdrop filter slices.

## 2. Props & Configuration Interface
```typescript
interface GradualBlurProps {
  /** Content behind blur gradient */
  children?: React.ReactNode;
  /** Direction of blur progression (default: 'bottom') */
  direction?: 'top' | 'bottom' | 'left' | 'right';
  /** Total gradient height/width in pixels (default: 120) */
  size?: number;
  /** Maximum blur radius in pixels (default: 16) */
  maxBlur?: number;
  /** Number of discrete blur slices (default: 8) */
  slices?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Static GPU-accelerated backdrop blur layer. Zero runtime CPU overhead during scrolling.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For slice $k \in [1, N]$:
Blur radius:
$$B_k = \text{maxBlur} \cdot \left(\frac{k}{N}\right)^2$$
Slice mask geometry:
$$\text{mask-image} = \text{linear-gradient}(\text{to direction}, \text{transparent } \frac{k-1}{N} \cdot 100\%, \text{black } \frac{k}{N} \cdot 100\%)$$
Slice backdrop filter:
$$\text{backdrop-filter: blur}(B_k\text{px})$$

## 5. Interaction Mechanics
Silky-smooth glass blur underlay as page contents scroll beneath navigation bars or footers.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Layered DOM Slices: Render $N$ absolutely positioned overlay strips.
2. Backdrop Filter: Apply progressive `backdrop-filter: blur(Xpx)` and `mask-image` to each strip.
3. GPU Acceleration: Use `transform: translateZ(0)` on each slice.
4. Fallback: Solid linear gradient overlay for browsers lacking backdrop-filter support.

## 7. Modularity & File Organization
Decompose into `GradualBlur.tsx` (<110 LoC) and `blurSliceMath.ts` (<50 LoC).
