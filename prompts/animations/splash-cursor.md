# Splash Cursor (Animations)

## 1. Overview & Visual Behavior
Splash Cursor simulates high-resolution GPU fluid dynamics where pointer drag injects colorful swirling dye plumes that diffuse, advect, and dissipate across the viewport.

## 2. Props & Configuration Interface
```typescript
interface SplashCursorProps {
  /** Fluid simulation grid resolution (default: 128) */
  simResolution?: number;
  /** Fluid dye dissipation rate (default: 0.98) */
  dyeDensityDecay?: number;
  /** Fluid velocity dissipation (default: 0.98) */
  velocityDecay?: number;
  /** Fluid pressure iterations (default: 20) */
  pressureIterations?: number;
  /** Splat radius on click in pixels (default: 0.25) */
  splatRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Runs continuously at 60/120 FPS on WebGL shader pipeline. Dye plumes diffuse over $1500	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Incompressible Navier-Stokes Equations:
$$\frac{\partial \vec{u}}{\partial t} = -(\vec{u} \cdot \nabla)\vec{u} - \frac{1}{\rho}\nabla p + \nu \nabla^2 \vec{u} + \vec{F}$$
$$\nabla \cdot \vec{u} = 0$$
Jacobi Pressure Solve Iteration:
$$p_{i,j}^{(k+1)} = \frac{p_{i-1,j}^{(k)} + p_{i+1,j}^{(k)} + p_{i,j-1}^{(k)} + p_{i,j+1}^{(k)} - (\nabla \cdot \vec{u})_{i,j} \cdot \Delta x^2}{4}$$

## 5. Interaction Mechanics
Pointer motion imparts velocity vectors $ec{F} = ec{v}_{mouse}$ and injects RGB color dye plumes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2 Framebuffers: Ping-pong textures for velocity, pressure, divergence, and dye density.
2. Shader Passes: Advection -> Splat Injection -> Divergence -> Pressure Jacobi Solve -> Gradient Subtraction -> Dye Render.
3. Mobile Scaling: Downgrades simulation resolution to $64 \times 64$ on lower-power GPUs.
4. Zero External Libs: Pure native WebGL GLSL shader pipeline.

## 7. Modularity & File Organization
Organized into `SplashCursor.tsx` (<120 LoC), `FluidSolver.ts` (<160 LoC), `fluidShaders.ts` (<140 LoC), and `glHelper.ts` (<80 LoC).
