# Noise (Animations)

## 1. Overview & Visual Behavior
Noise renders an animated film grain static texture overlay using procedural Simplex/Perlin noise algorithms or optimized canvas noise buffers with blend modes.

## 2. Props & Configuration Interface
```typescript
interface NoiseProps {
  /** Noise opacity [0..1] (default: 0.08) */
  opacity?: number;
  /** Film grain particle scale in pixels (default: 1) */
  scale?: number;
  /** Noise frame rate FPS (default: 24) */
  fps?: number;
  /** CSS mix-blend-mode (default: 'overlay') */
  blendMode?: 'overlay' | 'screen' | 'multiply' | 'soft-light';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Regenerates grain patterns at $24	ext{ FPS}$ (cinematic film grain rate) for authentic texture.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Monochrome white noise generation for pixel $(x, y)$:
$$N(x, y) = \text{randInt}(0, 255)$$
Perlin noise value:
$$P(x, y, t) = \sum_{k=0}^{O-1} \frac{1}{2^k} \text{simplex}(2^k x, 2^k y, \omega t)$$
Blending equation:
$$C_{out} = \text{blend}(C_{base}, N, \alpha)$$

## 5. Interaction Mechanics
Static or animated backdrop overlay with `pointer-events: none`.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas Buffer: Generate $128 \times 128$ pixel noise buffer into `ImageData`.
2. CSS Background Tile: Export small canvas as repeating pattern or tile directly.
3. Animation Loop: Randomize canvas translation offsets `transform: translate(rand, rand)` at 24 FPS.
4. Low Overhead: Consumes $<1\%$ CPU by avoiding per-pixel generation on full viewport.

## 7. Modularity & File Organization
Decompose into `Noise.tsx` (<100 LoC) and `noiseGenerator.ts` (<70 LoC).
