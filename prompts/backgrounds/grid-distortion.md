# Grid Distortion (Backgrounds)

## 1. Overview & Visual Behavior
Grid Distortion applies real-time magnetic and gravitational lens warping to an underlying image or video grid based on cursor position.

## 2. Props & Configuration Interface
```typescript
interface GridDistortionProps {
  /** Image URL */
  imageSrc: string;
  /** Grid mesh resolution (default: 32) */
  gridResolution?: number;
  /** Distortion strength (default: 0.3) */
  strength?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Mesh distortion updates in real-time at 60/120 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For mesh vertex $(u, v)$ and mouse $(u_c, v_c)$:
Distance vector $\vec{d} = (u - u_c, \ v - v_c), \ r = \|\vec{d}\|$.
Displaced UV coordinates $(u', v')$:
$$(u', v') = (u, v) + \frac{\vec{d}}{r} \cdot \text{strength} \cdot \exp\left(-\frac{r^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Moving mouse across image warps and magnifies underlying content like a gravitational lens.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL 2.0 Vertex Grid: Deform vertex positions in vertex shader or texture UVs in fragment shader.
2. Canvas 2D Fallback: Draw triangular mesh with affine texture mapping.
3. Spring Solver: Smoothly rebounds mesh to neutral on mouse leave.
4. Auto Resize: Matches container aspect ratio.

## 7. Modularity & File Organization
Organized into `GridDistortion.tsx` (<120 LoC), `DistortionShader.ts` (<130 LoC), and `meshMath.ts` (<50 LoC).
