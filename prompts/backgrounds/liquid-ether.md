# Liquid Ether (Backgrounds)

## 1. Overview & Visual Behavior
Liquid Ether renders a dreamy, volumetric Navier-Stokes fluid background where glowing ethereal gas clouds swirl, diffuse, and react to pointer drag.

## 2. Props & Configuration Interface
```typescript
interface LiquidEtherProps {
  /** Color palette (default: pastel neon) */
  colors?: string[];
  /** Fluid viscosity (default: 0.95) */
  viscosity?: number;
  /** Fluid velocity dissipation (default: 0.98) */
  dissipation?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Real-time WebGL fluid simulation running at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Incompressible Navier-Stokes Fluid Advection:
$$\frac{\partial \vec{u}}{\partial t} = -(\vec{u} \cdot \nabla)\vec{u} - \frac{1}{\rho}\nabla p + \nu \nabla^2 \vec{u} + \vec{F}_{pointer}$$
Vorticity Confinement to prevent numerical diffusion:
$$\vec{f}_{vort} = \epsilon (\nabla |\vec{\omega}| \times \vec{\omega}) \Delta x$$

## 5. Interaction Mechanics
Dragging pointer injects swirling dye plumes and turbulent fluid velocity.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2.0 Shader Pipeline: Advection, Divergence, Jacobi Pressure Solve, Gradient Subtraction.
2. Low-Resolution Grid: $128 \times 128$ fluid grid with bilinear hardware upscaling.
3. High Performance: Single WebGL context with ping-pong FBOs.
4. Fallback: Smooth CSS radial gradient drift on unsupported browsers.

## 7. Modularity & File Organization
Decompose into `LiquidEther.tsx` (<120 LoC), `EtherSolver.ts` (<150 LoC), and `etherShaders.ts` (<140 LoC).
