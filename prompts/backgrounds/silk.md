# Silk (Backgrounds)

## 1. Overview & Visual Behavior
Silk renders luxurious satin or silk cloth waving, folding, and draping with authentic specular sheen and soft fluid physics.

## 2. Props & Configuration Interface
```typescript
interface SilkProps {
  /** Silk tint color */
  color?: string;
  /** Cloth wave amplitude (default: 40) */
  amplitude?: number;
  /** Flow animation speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous cloth wave motion at 60 FPS with harmonic oscillation.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Silk Cloth Heightfield $Z(x, y, t)$:
$$Z(x, y, t) = A_1 \sin(k_1 x + \omega_1 t) \cos(k_2 y + \omega_2 t) + A_2 \sin(k_3(x + y) - \omega_3 t)$$
Anisotropic Specular Highlight (Ward model):
$$I_{spec} = \frac{1}{\sqrt{\cos\theta_i \cos\theta_r}} \exp\left(-\frac{\tan^2\theta_h}{\alpha_x^2}\right)$$

## 5. Interaction Mechanics
Pointer dragging creates ripples and folds across the silk fabric surface.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas Mesh: 2D vertex grid deformed by trigonometric wave functions.
2. Anisotropic Shading: Computes satin/silk specular sheen across cloth normals.
3. Responsive Grid: Auto-scales mesh resolution to screen size.
4. CSS Fallback: Animated multi-layer gradient blend.

## 7. Modularity & File Organization
Decompose into `Silk.tsx` (<120 LoC), `SilkShader.ts` (<130 LoC), and `silkMath.ts` (<50 LoC).
