# Ferrofluid (Backgrounds)

## 1. Overview & Visual Behavior
Ferrofluid simulates magnetic liquid spike physics where black magnetic fluid bristles with sharp organic spikes, conforms to magnetic field lines, and coalesces.

## 2. Props & Configuration Interface
```typescript
interface FerrofluidProps {
  /** Fluid blob radius in pixels (default: 120) */
  radius?: number;
  /** Magnetic spike count (default: 18) */
  spikeCount?: number;
  /** Spike height amplitude in pixels (default: 50) */
  spikeHeight?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Magnetic spike deformation updates at 60 FPS with spring settling response ($300\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Ferrofluid boundary contour in polar coordinates $(r(\theta), \theta)$:
$$r(\theta) = R_0 + \sum_{k=1}^{N_{spikes}} A_k \cdot \exp\left(-\frac{(\theta - \theta_k)^2}{2\sigma^2}\right) \cdot \frac{1}{1 + d_{mouse, k} / R_{mag}}$$
Spike alignment toward external magnetic cursor vector $\vec{B} = (x_c - X_0, \ y_c - Y_0)$:
$$\theta_{spike} \leftarrow \theta_{spike} + \alpha \cdot (\theta_{\vec{B}} - \theta_{spike})$$

## 5. Interaction Mechanics
Cursor acts as a powerful neodymium magnet, attracting and pulling ferrofluid spikes toward the pointer.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Draw smooth closed contour passing through deformed spike tips.
2. Metallic Gloss Shading: Deep obsidian black radial gradient fill with bright specular highlight.
3. Physics Hook: Spring integration solves spike height oscillation.
4. WebGL Alternative: Raymarched metaballs with magnetic directional deformation.

## 7. Modularity & File Organization
Decompose into `Ferrofluid.tsx` (<130 LoC), `MagneticSolver.ts` (<140 LoC), and `ferroMath.ts` (<50 LoC).
