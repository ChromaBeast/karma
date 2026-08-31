# Soft Aurora (Backgrounds)

## 1. Overview & Visual Behavior
Soft Aurora renders gentle, pastel Northern Lights curtains that drift and glow with ambient Gaussian blur and gradient hues.

## 2. Props & Configuration Interface
```typescript
interface SoftAuroraProps {
  /** Aurora color stops (e.g. emerald, violet, cyan) */
  colors?: string[];
  /** Drift velocity speed (default: 0.8) */
  speed?: number;
  /** Blur intensity in pixels (default: 80) */
  blurRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous ambient color drift with slow harmonic periods ($T \in [8\text{s}, 16\text{s}]$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Aurora Curtain Heightfield $Y(x, t)$:
$$Y(x, t) = Y_0 + \sum_{k=1}^3 A_k \sin(f_k x + \omega_k t)$$
Multi-stop gradient blending:
$$C(x, y, t) = \text{lerp}(C_1, C_2, 0.5 + 0.5 \sin(\omega t))$$

## 5. Interaction Mechanics
Mouse cursor shifts ambient aurora color temperature.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Blob Mesh: Render organic gradient polygons with `filter: blur(80px)`.
2. GPU Transforms: Animate `translate3d` and `scale` with CSS keyframes.
3. Background Blend: `mix-blend-mode: hard-light` or `screen`.
4. High Performance: Zero repaint cost on composite layer.

## 7. Modularity & File Organization
Organized into `SoftAurora.tsx` (<110 LoC) and `auroraStyles.ts` (<50 LoC).
