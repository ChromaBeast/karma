# Balatro (Backgrounds)

## 1. Overview & Visual Behavior
Balatro replicates the psychedelic swirling hypnotic card background from Balatro, featuring rotating spiral vortex distortion, CRT scanline overlay, and dynamic palette cycling.

## 2. Props & Configuration Interface
```typescript
interface BalatroProps {
  /** Color palette preset (default: 'spectral-red') */
  palette?: 'spectral-red' | 'cosmic-blue' | 'joker-purple' | 'gold-seal';
  /** Swirl rotation speed (default: 1.0) */
  speed?: number;
  /** Vortex swirl frequency (default: 4.0) */
  swirlFrequency?: number;
  /** CRT scanline overlay (default: true) */
  crtScanlines?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous psychedelic vortex rotation at 60 FPS on WebGL fragment shader.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Balatro Swirling Polar Vortex Equation in centered normalized coordinates $(u, v) \in [-1, 1]$:
$$r = \sqrt{u^2 + v^2}, \quad \theta = \arctan2(v, u)$$
Twisted angular coordinate:
$$\theta' = \theta + k_{swirl} \cdot \sin(r \cdot f_{freq} - \omega t)$$
Deformed spatial coordinates:
$$x' = r \cdot \cos(\theta'), \quad y' = r \cdot \sin(\theta')$$
Hypnotic Color Index:
$$I(x', y', t) = \sin(x' \cdot 6.0 + \omega t) \cdot \cos(y' \cdot 6.0 - \omega t)$$
Palette lookup with smooth sine modulation:
$$\text{Color}(I) = \text{paletteLUT}\left(0.5 + 0.5 \cdot I\right)$$
CRT Scanline Function:
$$S(y) = 1.0 - 0.15 \cdot \sin^2(y \cdot \text{resolution}_y \cdot \pi)$$

## 5. Interaction Mechanics
Mouse cursor acts as a localized vortex attractor, pulling swirl centers and increasing distortion frequency.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2.0 Fragment Shader: Full-screen quad evaluating polar swirl and palette LUT in single pass.
2. Palette Swapping: Uniform array `vec3 u_palette[4]` dynamically updated on prop change.
3. CRT Scanline Filter: Fragment shader scanline and vignette pass.
4. Canvas 2D Fallback: Layered rotating spiral canvases with blend modes for non-WebGL environments.

## 7. Modularity & File Organization
Decompose into `Balatro.tsx` (<120 LoC), `BalatroShader.ts` (<150 LoC), and `balatroPalettes.ts` (<60 LoC).
