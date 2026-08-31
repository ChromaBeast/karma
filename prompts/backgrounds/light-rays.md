# Light Rays (Backgrounds)

## 1. Overview & Visual Behavior
Light Rays renders animated 3D volumetric god rays radiating outward from a central focal sun/portal with dust motes and atmospheric haze.

## 2. Props & Configuration Interface
```typescript
interface LightRaysProps {
  /** Ray count (default: 16) */
  rayCount?: number;
  /** Ray color */
  color?: string;
  /** Rotation speed (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous rotational sweep over period $T = 20\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Ray angle $\theta_k(t) = \left(\frac{2\pi k}{N} + \omega t\right) \bmod 2\pi$.
Conic Gradient Approximation:
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg}, \text{repeating stops of } C_{ray} \text{ and transparent})$$

## 5. Interaction Mechanics
Mouse movement shifts the central ray origin point with parallax.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Conic Gradient Disk: CSS `conic-gradient` with radial fade mask.
2. GPU Keyframe Spin: Animate transform `rotate(360deg)` via CSS keyframes.
3. Blur Bloom: Outer wrapper with `backdrop-filter` or `filter: blur(24px)`.
4. Zero JavaScript Overhead: Driven entirely by pure CSS animations.

## 7. Modularity & File Organization
Organized into `LightRays.tsx` (<100 LoC) and `rayStyles.ts` (<40 LoC).
