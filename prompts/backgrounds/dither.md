# Dither (Backgrounds)

## 1. Overview & Visual Behavior
Dither applies ordered 8x8 Bayer matrix dithering, retro palette quantization, and monochrome 1-bit pixel shading to underlying graphics.

## 2. Props & Configuration Interface
```typescript
interface DitherProps {
  /** Bayer matrix size (default: 4 for 4x4, 8 for 8x8) */
  matrixSize?: 4 | 8;
  /** Color palette preset (default: 'monochrome') */
  palette?: 'monochrome' | 'gameboy' | 'cga' | 'cyberpunk';
  /** Pixel block size in pixels (default: 2) */
  pixelSize?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Real-time post-processing filter running at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Normalized $4 \times 4$ Bayer Matrix $M_4$:
$$M_4 = \frac{1}{16} \begin{pmatrix} 0 & 8 & 2 & 10 \\ 12 & 4 & 14 & 6 \\ 3 & 11 & 1 & 9 \\ 15 & 7 & 13 & 5 \end{pmatrix}$$
Threshold comparison for pixel $(x, y)$ with luminance $L(x, y) \in [0, 1]$:
$$L_{dither} = L(x, y) + (M[x \bmod N, \ y \bmod N] - 0.5) \cdot \text{spread}$$
$$\text{Color} = \arg\min_{C \in \text{palette}} \|C - L_{dither}\|$$

## 5. Interaction Mechanics
Mouse position can adjust dither contrast threshold dynamically.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Samples source texture and evaluates Bayer matrix threshold.
2. Palette Texture: 1D palette lookup texture for instantaneous quantization.
3. Pixelation Scale: Integer pixel scaling step to maintain crisp retro aesthetics.
4. CSS Fallback: High-contrast monochrome SVG matrix filter.

## 7. Modularity & File Organization
Decompose into `Dither.tsx` (<110 LoC), `DitherShader.ts` (<130 LoC), and `ditherPalettes.ts` (<50 LoC).
