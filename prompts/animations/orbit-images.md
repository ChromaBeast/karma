# Orbit Images (Animations)

## 1. Overview & Visual Behavior
Orbit Images arranges image badges, avatar chips, or technology logos in elliptical 3D orbits around a central focal node, featuring realistic depth scaling, z-index layering, and interactive pause.

## 2. Props & Configuration Interface
```typescript
interface OrbitImagesProps {
  /** Array of image URLs or nodes to orbit */
  items: (string | { src: string; alt?: string; label?: string })[];
  /** Central focal element or avatar */
  centerContent?: React.ReactNode;
  /** Horizontal orbital radius in pixels (default: 180) */
  radiusX?: number;
  /** Vertical orbital radius in pixels (default: 80) */
  radiusY?: number;
  /** Orbit revolution duration in seconds (default: 12s) */
  duration?: number;
  /** 3D tilt angle in degrees (default: 15) */
  tiltAngle?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous orbital revolution over period $T = 12	ext{s}$ with smooth linear angular velocity $\omega = rac{2\pi}{T}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For item $i \in [0, N-1]$:
$$\theta_i(t) = \left(\omega t + \frac{2\pi i}{N}\right) \bmod 2\pi$$
Planar coordinates before tilt:
$$x_i = R_x \cdot \cos\theta_i(t), \quad y_i = R_y \cdot \sin\theta_i(t)$$
Depth scale and z-index based on vertical position:
$$\text{scale}_i = 1 + 0.35 \cdot \sin\theta_i(t)$$
$$\text{opacity}_i = 0.5 + 0.5 \cdot \left(\frac{\sin\theta_i(t) + 1}{2}\right)$$
$$\text{z-index}_i = \lfloor 100 \cdot (1 + \sin\theta_i(t)) \rfloor$$

## 5. Interaction Mechanics
Pointer hover pauses orbit. Dragging rotates the orbital system with spring inertia.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Orbital Container: Relative flex center container.
2. Item Positioning: Absolute positioning with `transform: translate3d(x, y, 0) scale(s)`.
3. Z-Index Management: Dynamically sort items so foreground items render above center node.
4. Mobile Scaling: Proportionally scale radii $R_x, R_y$ on smaller screens.

## 7. Modularity & File Organization
Decompose into `OrbitImages.tsx` (<130 LoC), `useOrbitPhysics.ts` (<100 LoC), and `orbitMath.ts` (<60 LoC).
