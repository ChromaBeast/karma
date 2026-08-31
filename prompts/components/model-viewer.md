# Model Viewer (Components)

## 1. Overview & Visual Behavior
Model Viewer renders interactive 3D GLTF/GLB models or wireframe geometry with orbit controls, auto-rotation, lighting environment maps, and stage shadows.

## 2. Props & Configuration Interface
```typescript
interface ModelViewerProps {
  /** 3D model asset URL (GLTF / GLB / JSON mesh) */
  modelSrc: string;
  /** Auto-rotation speed (0 to disable, default: 0.5) */
  autoRotateSpeed?: number;
  /** Camera field of view in degrees (default: 45) */
  fov?: number;
  /** Stage shadow opacity (default: 0.3) */
  shadowOpacity?: number;
  /** Background environment color */
  backgroundColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Orbit controls respond with zero latency. Auto-rotation progresses at constant angular velocity $\omega = \text{speed} \cdot 0.01\text{ rad/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Orbit Camera Spherical Coordinates $(\rho, \theta, \phi)$:
$$x_{cam} = \rho \sin\phi \sin\theta$$
$$y_{cam} = \rho \cos\phi$$
$$z_{cam} = \rho \sin\phi \cos\theta$$
Look-At View Matrix:
$$\vec{z}_{view} = \frac{\vec{eye} - \vec{target}}{\|\vec{eye} - \vec{target}\|}, \quad \vec{x}_{view} = \frac{\vec{up} \times \vec{z}_{view}}{\|\vec{up} \times \vec{z}_{view}\|}, \quad \vec{y}_{view} = \vec{z}_{view} \times \vec{x}_{view}$$

## 5. Interaction Mechanics
Pointer drag orbits camera around model. Scroll wheel zooms in/out. Double click resets view.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Context: Native WebGL 2.0 or Three.js mini canvas pipeline.
2. Orbit Controller: Pointer drag updates polar angles $\theta, \phi$.
3. Mesh Buffer: Stream vertex, normal, and UV buffers efficiently.
4. Loading Skeleton: Graceful animated spinner while model downloads.

## 7. Modularity & File Organization
Organized into `ModelViewer.tsx` (<130 LoC), `OrbitCamera.ts` (<120 LoC), and `modelRenderer.ts` (<140 LoC).
