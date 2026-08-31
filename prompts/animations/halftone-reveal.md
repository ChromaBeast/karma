# Halftone Reveal (Animations)

## 1. Overview & Visual Behavior
Halftone Reveal transitions images or UI panels using a dynamic CMYK/monochrome halftone dot raster screen where dot radii expand according to underlying luminance and cursor proximity.

## 2. Props & Configuration Interface
```typescript
interface HalftoneRevealProps {
  /** Target image or element to reveal */
  imageSrc: string;
  /** Halftone dot grid spacing in pixels (default: 8) */
  dotSize?: number;
  /** Dot pattern rotation angle in degrees (default: 45) */
  angle?: number;
  /** Reveal progress [0..1] (default: 0) */
  progress?: number;
  /** Halftone color mode (default: 'monochrome') */
  mode?: 'monochrome' | 'cmyk' | 'duotone';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Reveal transition executes over $800	ext{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Dot radii scale smoothly from $0$ to $\sqrt{2} \cdot 	ext{dotSize}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For grid coordinate $(u, v)$ rotated by angle $\theta$:
$$x' = x \cos\theta - y \sin\theta, \quad y' = x \sin\theta + y \cos\theta$$
Sampled pixel luminance $L(x, y) \in [0, 1]$:
$$L(x, y) = 0.299R + 0.587G + 0.114B$$
Maximum dot radius $R_{max} = \frac{\text{dotSize}}{\sqrt{2}}$.
Effective dot radius at reveal progress $P \in [0, 1]$:
$$R_{dot}(x, y) = R_{max} \cdot \text{clamp}(L(x, y) \cdot P \cdot 1.5, 0, 1)$$

## 5. Interaction Mechanics
Pointer position creates localized magnification of halftone dots. Hover reveals full underlying image.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Offscreen Canvas Sampling: Sample image luminance grid into Uint8ClampedArray.
2. SVG/Canvas Dot Array: Render circle grid with radii linked to computed $R_{dot}$.
3. WebGL Fragment Shader: Shader implementation computes dot SDF for 60 FPS performance.
4. CSS Fallback: CSS `mask-image` with repeating radial gradient pattern.

## 7. Modularity & File Organization
Decompose into `HalftoneReveal.tsx` (<120 LoC), `HalftoneShader.ts` (<110 LoC), and `halftoneMath.ts` (<60 LoC).
