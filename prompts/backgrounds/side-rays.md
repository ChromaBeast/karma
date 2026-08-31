# Side Rays (Backgrounds)

## 1. Overview & Visual Behavior
Side Rays casts dramatic diagonal volumetric god rays and sunbeams streaming in from the corner or side edge of the viewport.

## 2. Props & Configuration Interface
```typescript
interface SideRaysProps {
  /** Ray origin corner (default: 'top-left') */
  origin?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Ray color (default: 'rgba(255, 255, 255, 0.15)') */
  color?: string;
  /** Number of discrete rays (default: 8) */
  rayCount?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Volumetric ray angles rotate and breathe gently over period $T = 8.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For ray $k \in [0, N-1]$ originating from $(X_0, Y_0)$:
Ray angle $\theta_k(t)$:
$$\theta_k(t) = \theta_0 + k \cdot \Delta\theta + A \sin(\omega t + k \phi)$$
Ray cone polygon:
$$\text{polygon} = [(X_0, Y_0), \ (X_0 + R \cos(\theta_k - w/2), Y_0 + R \sin(\theta_k - w/2)), \ (X_0 + R \cos(\theta_k + w/2), Y_0 + R \sin(\theta_k + w/2))]$$

## 5. Interaction Mechanics
Pointer coordinates attract and aim the primary spotlight sunbeam.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG / Canvas Cones: Render radial fan of translucent linear-gradient polygons.
2. Blend Mode: `mix-blend-mode: screen` for realistic volumetric light stacking.
3. Soft Edge Blur: Container with `filter: blur(16px)`.
4. Tailwind Integration: Pure utility classes with CSS variables.

## 7. Modularity & File Organization
Decompose into `SideRays.tsx` (<110 LoC) and `sideRayStyles.ts` (<50 LoC).
