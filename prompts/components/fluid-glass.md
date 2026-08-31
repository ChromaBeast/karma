# Fluid Glass (Components)

## 1. Overview & Visual Behavior
Fluid Glass renders a liquid glass surface with dynamic chromatic aberration, refractive distortion, liquid ripple physics, and frosted glass background blur.

## 2. Props & Configuration Interface
```typescript
interface FluidGlassProps {
  /** Content rendered inside glass container */
  children: React.ReactNode;
  /** Backdrop blur radius in pixels (default: 20) */
  blurRadius?: number;
  /** Glass refraction index [1.0..1.5] (default: 1.15) */
  refractionIndex?: number;
  /** Glass tint color (default: 'rgba(255, 255, 255, 0.08)') */
  tintColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous background refractive distortion at 60 FPS. Glass ripple impulse decays over $800\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Snell's Law Refraction at glass boundary:
$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$
Chromatic separation lookup offsets for RGB channels:
$$\vec{d}_R = \vec{N} \cdot (\eta_R - 1), \quad \vec{d}_G = \vec{N} \cdot (\eta_G - 1), \quad \vec{d}_B = \vec{N} \cdot (\eta_B - 1)$$
where $\eta_R = 1.14, \eta_G = 1.15, \eta_B = 1.16$.

## 5. Interaction Mechanics
Pointer movement creates localized fluid ripples and refractive lens magnification across glass.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Glassmorphic Wrapper: `backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15)`.
2. SVG Displacement Filter: Optional `<feDisplacementMap>` creating authentic lens refraction.
3. Specular Lighting: Dynamic radial highlight tracking cursor position.
4. High Performance: Pure CSS backdrop-filter fallback for low-power devices.

## 7. Modularity & File Organization
Decompose into `FluidGlass.tsx` (<120 LoC) and `fluidGlassStyles.ts` (<60 LoC).
