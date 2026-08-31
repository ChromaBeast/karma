# Prism (Backgrounds)

## 1. Overview & Visual Behavior
Prism refracts incoming light into a brilliant rainbow dispersion spectrum with caustic reflections, angular dispersion, and dynamic glass facet geometry.

## 2. Props & Configuration Interface
```typescript
interface PrismProps {
  /** Dispersion strength (default: 0.8) */
  dispersion?: number;
  /** Prism facet rotation speed (default: 0.5) */
  rotationSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Prism facets rotate continuously over period $T = 12\text{s}$. Rainbow caustics update at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Cauchy's Dispersion Formula for wavelength $\lambda$:
$$n(\lambda) = A + \frac{B}{\lambda^2}$$
Refraction angle for color channel $\lambda$:
$$\theta_{refr}(\lambda) = \arcsin\left(\frac{\sin\theta_{inc}}{n(\lambda)}\right)$$
Caustic intensity mapping:
$$I(x, y) = I_0 \cdot \det\left(\frac{\partial \vec{x}_{screen}}{\partial \vec{u}_{prism}}\right)^{-1}$$

## 5. Interaction Mechanics
Mouse angle shifts the incident light vector, rotating the refracted rainbow spectrum.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas Caustics: Render multi-layer refractive rainbow gradients.
2. Chromatic Split: Render separate R, G, B passes with varying refraction indices.
3. Blend Mode: Additive screen blending for luminous caustics.
4. Zero Dependency: Pure mathematical shader implementation.

## 7. Modularity & File Organization
Organized into `Prism.tsx` (<120 LoC), `PrismEngine.ts` (<130 LoC), and `prismMath.ts` (<60 LoC).
