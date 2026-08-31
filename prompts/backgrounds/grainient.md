# Grainient (Backgrounds)

## 1. Overview & Visual Behavior
Grainient blends high-grain textured film static into vibrant fluid multi-color ambient mesh gradients.

## 2. Props & Configuration Interface
```typescript
interface GrainientProps {
  /** Array of mesh gradient colors */
  colors?: string[];
  /** Grain noise intensity [0..1] (default: 0.12) */
  grainIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Mesh gradients drift over period $T = 10\text{s}$. Grain static jitters at 24 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Mesh gradient color interpolation:
$$C(x, y) = \sum_{k=1}^4 w_k(x, y) \cdot C_k, \quad w_k(x, y) = \exp\left(-\frac{\|\vec{p} - \vec{P}_k\|^2}{2\sigma^2}\right)$$
Grain modulation:
$$C_{final}(x, y) = C(x, y) \cdot (1 + \text{noise}(x, y) \cdot I_{grain})$$

## 5. Interaction Mechanics
Pointer position pulls the center anchor of the color mesh.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Radial Mesh: Multiple overlapping absolute radial gradient blobs.
2. SVG Grain Overlay: Inline SVG `<filter id=\"grain\"><feTurbulence\">` with `mix-blend-mode: overlay`.
3. GPU Acceleration: Blob motion driven by CSS keyframe transforms.
4. Zero JavaScript Overhead: 100% CSS and SVG implementation.

## 7. Modularity & File Organization
Organized into `Grainient.tsx` (<100 LoC) and `grainientStyles.ts` (<50 LoC).
