# Waves (Backgrounds)

## 1. Overview & Visual Behavior
Waves renders a multi-layer ocean wave surface with crest foam highlights, realistic water depth shading, and gentle tidal oscillation.

## 2. Props & Configuration Interface
```typescript
interface WavesProps {
  /** Wave layer count (default: 4) */
  layerCount?: number;
  /** Ocean depth color (default: '#0f172a') */
  deepColor?: string;
  /** Surface crest color (default: '#38bdf8') */
  crestColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous ocean wave simulation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Gerstner Wave Equation for surface point $(x, y)$:
$$x' = x - \sum_{k} \frac{k_x}{k} A_k \sin(\vec{k} \cdot \vec{x} - \omega t)$$
$$y' = y - \sum_{k} \frac{k_y}{k} A_k \sin(\vec{k} \cdot \vec{x} - \omega t)$$
$$z' = \sum_{k} A_k \cos(\vec{k} \cdot \vec{x} - \omega t)$$

## 5. Interaction Mechanics
Mouse movements create localized surface wakes and splash ripples.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / WebGL: Draw Gerstner wave polygon surfaces.
2. Depth Gradient: Multi-stage vertical linear gradients for ocean depth.
3. Foam Highlights: White stroke on top wave crest path.
4. Responsive Fit: Adapts seamlessly to all screen sizes.

## 7. Modularity & File Organization
Decompose into `Waves.tsx` (<120 LoC), `GerstnerWave.ts` (<130 LoC), and `oceanStyles.ts` (<40 LoC).
