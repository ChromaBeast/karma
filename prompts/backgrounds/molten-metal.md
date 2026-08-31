# Molten Metal (Backgrounds)

## 1. Overview & Visual Behavior
Molten Metal renders glowing liquid gold, liquid mercury, or molten lava flows with volumetric specular highlights, heat distortion, and fluid eddies.

## 2. Props & Configuration Interface
```typescript
interface MoltenMetalProps {
  /** Metal type preset (default: 'gold') */
  preset?: 'gold' | 'chrome' | 'copper' | 'lava';
  /** Fluid flow speed (default: 1.0) */
  flowSpeed?: number;
  /** Surface bump map intensity (default: 0.8) */
  bumpIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Fluid Navier-Stokes simulation running continuously at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Fractal Brownian Motion (fBm) Heightmap $H(x, y, t)$:
$$H(x, y, t) = \sum_{k=0}^{O-1} \frac{1}{2^k} \text{simplex}(2^k x + \vec{u} t, \ 2^k y + \vec{v} t)$$
Surface Normal Gradient:
$$\vec{N} = \text{normalize}\left(-\frac{\partial H}{\partial x}, \ -\frac{\partial H}{\partial y}, \ 1\right)$$
Blinn-Phong Specular Luminance:
$$I = k_d (\vec{N} \cdot \vec{L}) + k_s (\vec{N} \cdot \vec{H})^\alpha$$

## 5. Interaction Mechanics
Mouse drag stirs dynamic vortices into the molten liquid metal field.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2.0 Fragment Shader: Calculates fBm noise and Blinn-Phong lighting per pixel.
2. Color Palettes: Metallic gradients mapped via custom 1D lookup textures.
3. Low-Res Buffer: $0.5\times$ resolution framebuffer with bilinear filtering.
4. Auto Sleep: Pauses when offscreen.

## 7. Modularity & File Organization
Decompose into `MoltenMetal.tsx` (<120 LoC), `MoltenShader.ts` (<140 LoC), and `metalPalettes.ts` (<50 LoC).
