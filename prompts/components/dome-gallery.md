# Dome Gallery (Components)

## 1. Overview & Visual Behavior
Dome Gallery maps gallery thumbnails or video clips onto an interactive geodesic 3D dome hemisphere, allowing users to orbit and inspect cards in hemispherical space.

## 2. Props & Configuration Interface
```typescript
interface DomeGalleryProps {
  /** Array of media cards */
  items: { id: string; title: string; image: string }[];
  /** Dome radius in pixels (default: 500) */
  domeRadius?: number;
  /** Number of latitude rings (default: 4) */
  latitudeRings?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Inertial 3D dome rotation at 60 FPS. Card focus transition takes $500\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Spherical Coordinates on Dome Hemisphere $(\theta \in [0, 2\pi], \phi \in [0, \pi/2])$:
$$x = R \cdot \sin\phi \cos\theta$$
$$y = R \cdot \cos\phi$$
$$z = R \cdot \sin\phi \sin\theta$$
Rotation matrix $R_x(\alpha) R_y(\beta)$ applied to each vertex point:
$$\vec{p}_{rot} = R_y(\beta) R_x(\alpha) \vec{p}$$
Perspective projection:
$$x_{screen} = \frac{x_{rot} \cdot d}{z_{rot} + d}, \quad y_{screen} = \frac{y_{rot} \cdot d}{z_{rot} + d}$$

## 5. Interaction Mechanics
Click and drag rotates the 3D dome freely. Clicking a card spins it to the front focal point.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Transform Pipeline: Pure CSS 3D transforms or WebGL 2D/3D point billboarding.
2. Spherical Fibonacci Distribution: Uniform distribution of cards over hemisphere.
3. Inertial Physics: Pointer velocity tracker applies spherical rotational friction.
4. Auto Billboard: Orient card faces to look toward dome center.

## 7. Modularity & File Organization
Organized into `DomeGallery.tsx` (<130 LoC), `useDomeRotation.ts` (<110 LoC), and `sphericalMath.ts` (<60 LoC).
