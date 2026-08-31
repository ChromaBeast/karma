# Elastic Mesh (Animations)

## 1. Overview & Visual Behavior
Elastic Mesh renders an interactive grid mesh of interconnected nodes and spring constraints that deform elastically under pointer drag and rebound with authentic harmonic oscillation.

## 2. Props & Configuration Interface
```typescript
interface ElasticMeshProps {
  /** Grid column count (default: 16) */
  columns?: number;
  /** Grid row count (default: 10) */
  rows?: number;
  /** Spring stiffness coefficient k (default: 0.12) */
  stiffness?: number;
  /** Velocity damping coefficient c (default: 0.90) */
  damping?: number;
  /** Pointer deformation radius in pixels (default: 140) */
  influenceRadius?: number;
  /** Mesh line stroke color */
  strokeColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Physics simulation runs at 60 FPS. Elastic deformations settle within $800	ext{ms}$ upon pointer release.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For mesh vertex $(i, j)$ with position $\vec{p}_{i,j}$ and rest position $\vec{p}_{0,i,j}$:
1. Anchor Spring Force:
   $$\vec{F}_{anchor} = -k_{anchor} \cdot (\vec{p}_{i,j} - \vec{p}_{0,i,j})$$
2. Neighbor Constraint Springs (Hooke's law for $N \in \text{neighbors}$):
   $$\vec{F}_{neighbor} = \sum_{N} -k_{struct} \cdot \left(\|\vec{p}_{i,j} - \vec{p}_N\| - L_0\right) \frac{\vec{p}_{i,j} - \vec{p}_N}{\|\vec{p}_{i,j} - \vec{p}_N\|}$$
3. Symplectic Verlet Integration:
   $$\vec{p}(t + \Delta t) = \vec{p}(t) + (\vec{p}(t) - \vec{p}(t - \Delta t)) \cdot c + \frac{\vec{F}_{total}}{m} \Delta t^2$$

## 5. Interaction Mechanics
Dragging pointer across mesh creates rubbery elastic indentation. Releasing pointer generates propagating tension waves.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Mesh Topology: Generate 2D array of vertices and structural spring edges.
2. Physics Loop: Solve spring constraints using Verlet integration inside `requestAnimationFrame`.
3. Canvas Rendering: Draw deformed grid quad lines with `ctx.beginPath()`, `ctx.moveTo()`, and `ctx.lineTo()`.
4. Boundary Pinning: Pin outer edge vertices $(\vec{p} = \vec{p}_0)$ to maintain stable borders.

## 7. Modularity & File Organization
Decompose into `ElasticMesh.tsx` (<120 LoC), `MeshPhysics.ts` (<150 LoC), and `meshTypes.ts` (<50 LoC).
