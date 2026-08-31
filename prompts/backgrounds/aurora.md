# Aurora (Backgrounds)

## 1. Overview & Visual Behavior
Aurora renders vibrant, high-intensity Northern Lights with dynamic ray curtains, solar wind ripples, and shimmering polar sky colors.

## 2. Props & Configuration Interface
```typescript
interface AuroraProps {
  /** Primary aurora colors (default: ['#00ff87', '#60efff', '#ff007f']) */
  colors?: string[];
  /** Aurora wave amplitude (default: 80) */
  amplitude?: number;
  /** Speed of solar wind (default: 1.2) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Solar wind wave cycle runs continuously at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Aurora Ray Intensity $I(x, y, t)$:
$$I(x, y, t) = \sum_{k=0}^2 \frac{1}{2^k} \text{simplex}(2^k x \cdot f + \omega t, \ 2^k y \cdot f) \cdot \exp\left(-\frac{(y - Y_{aurora}(x))^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Mouse interaction creates electromagnetic flares in aurora curtains.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Raymarched aurora curtain density with atmospheric scattering.
2. Canvas 2D Fallback: Multi-layer sine ribbons with heavy vertical blur.
3. Color Lookup Texture: Seamless palette cycling.
4. Auto Sleep: Pauses when hidden.

## 7. Modularity & File Organization
Decompose into `Aurora.tsx` (<120 LoC), `AuroraShader.ts` (<130 LoC), and `auroraMath.ts` (<50 LoC).
