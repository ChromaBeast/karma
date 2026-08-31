# Metallic Paint (Animations)

## 1. Overview & Visual Behavior
Metallic Paint renders fluid, reflective liquid metal strokes that ripple with specular chrome reflections, dynamic fresnel highlights, and mouse-directed lighting.

## 2. Props & Configuration Interface
```typescript
interface MetallicPaintProps {
  /** Background image or metallic texture URL */
  textureSrc?: string;
  /** Chrome reflectivity index [0..1] (default: 0.85) */
  reflectivity?: number;
  /** Fluid viscosity factor (default: 0.92) */
  viscosity?: number;
  /** Specular light color (default: '#ffffff') */
  lightColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Real-time WebGL/Canvas fluid simulation running at 60 FPS with smooth specular highlight response.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Blinn-Phong Specular Reflection for normal $\vec{N}$ and light vector $\vec{L}$:
$$\vec{H} = \frac{\vec{L} + \vec{V}}{\|\vec{L} + \vec{V}\|}$$
$$I_{spec} = k_s \cdot (\vec{N} \cdot \vec{H})^\alpha$$
Fresnel approximation (Schlick's):
$$F(R) = F_0 + (1 - F_0)(1 - \vec{V} \cdot \vec{N})^5$$
Fluid Navier-Stokes advection step:
$$\vec{u}(t + \Delta t) = \vec{u}(t) - (\vec{u} \cdot \nabla)\vec{u} \Delta t + \nu \nabla^2 \vec{u} \Delta t$$

## 5. Interaction Mechanics
Pointer drags fluid metallic ripples across surface. Tilting device shifts environment map reflection.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2.0 Shader: Fragment shader implementing Blinn-Phong + environment cubemap reflection.
2. Fluid Simulation Texture: Ping-pong FBOs simulating velocity and pressure fields.
3. Canvas Fallback: CSS SVG filter `<feSpecularLighting>` with `<fePointLight>` tracking cursor.
4. Auto Resolution: Renders at $0.5\times$ resolution with bilinear upscaling for high performance.

## 7. Modularity & File Organization
Organized into `MetallicPaint.tsx` (<120 LoC), `FluidShader.ts` (<150 LoC), and `glUtils.ts` (<70 LoC).
