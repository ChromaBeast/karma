# Lanyard (Components)

## 1. Overview & Visual Behavior
Lanyard renders a physics-simulated hanging conference badge or ID lanyard that sways with 2D/3D Verlet particle cloth physics, gravity, pointer drag, and momentum.

## 2. Props & Configuration Interface
```typescript
interface LanyardProps {
  /** ID badge content / profile info */
  badgeContent: React.ReactNode;
  /** Lanyard string length in pixels (default: 200) */
  lanyardLength?: number;
  /** Number of rope segments (default: 8) */
  segments?: number;
  /** Gravity acceleration (default: 980) */
  gravity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Verlet physics runs at 60 FPS. Badge oscillations settle in $\approx 1.5\text{s}$ under air resistance damping.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Verlet Particle Integration for rope node $i$:
$$\vec{p}_i(t + \Delta t) = 2\vec{p}_i(t) - \vec{p}_i(t - \Delta t) + \vec{g} \Delta t^2 \cdot (1 - \text{damping})$$
Distance Constraint Enforcement between adjacent nodes $(i, i+1)$:
$$\vec{\Delta} = \vec{p}_{i+1} - \vec{p}_i, \quad \text{dist} = \|\vec{\Delta}\|$$
$$\text{correction} = \frac{\text{dist} - L_0}{\text{dist}} \cdot 0.5$$
$$\vec{p}_i \leftarrow \vec{p}_i + \vec{\Delta} \cdot \text{correction}, \quad \vec{p}_{i+1} \leftarrow \vec{p}_{i+1} - \vec{\Delta} \cdot \text{correction}$$
Badge 3D rotation angle:
$$\theta_{badge} = \arctan2(\Delta x_{last}, \Delta y_{last})$$

## 5. Interaction Mechanics
Users can grab badge card with mouse and throw it, watching the lanyard string snap and swing.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Verlet Rope Solver: 8-node constrained particle chain pinned at top origin $(x_0, y_0)$.
2. Canvas / SVG String: Draw smooth bezier curve through rope nodes.
3. DOM Badge Card: Pin HTML badge card to final rope node with `transform: translate3d(x, y, 0) rotate(theta)`.
4. Drag Physics: Lock position of final node to cursor coordinates during pointer drag.

## 7. Modularity & File Organization
Decompose into `Lanyard.tsx` (<130 LoC), `VerletRope.ts` (<140 LoC), and `lanyardMath.ts` (<60 LoC).
