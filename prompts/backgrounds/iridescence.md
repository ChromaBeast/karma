# Iridescence (Backgrounds)

## 1. Overview & Visual Behavior
Iridescence renders a dynamic soap bubble thin-film interference background with shifting rainbow hues, soap bubble swirls, and glossy specular sheen.

## 2. Props & Configuration Interface
```typescript
interface IridescenceProps {
  /** Thin film thickness in nanometers (default: 400) */
  filmThickness?: number;
  /** Color flow speed (default: 0.8) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous thin-film interference color shifting at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Thin-Film Optical Interference for wavelength $\lambda$:
$$2 n d \cos\theta_{refr} = \left(m + \frac{1}{2}\right) \lambda \quad (\text{constructive interference})$$
RGB Reflection Intensities:
$$I_R = \cos^2\left(\frac{2\pi n d}{\lambda_R}\right), \quad I_G = \cos^2\left(\frac{2\pi n d}{\lambda_G}\right), \quad I_B = \cos^2\left(\frac{2\pi n d}{\lambda_B}\right)$$

## 5. Interaction Mechanics
Mouse drag creates swirling soap film eddies and variable thickness ripples.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Calculates thin-film interference equations per pixel.
2. Simplex Noise Film: Film thickness modulated by low-frequency noise.
3. High Performance: Single full-screen quad shader.
4. CSS Fallback: Animated multi-stop conic gradient.

## 7. Modularity & File Organization
Organized into `Iridescence.tsx` (<110 LoC), `IridescentShader.ts` (<130 LoC), and `filmMath.ts` (<50 LoC).
