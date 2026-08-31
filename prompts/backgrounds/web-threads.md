# Web Threads (Backgrounds)

## 1. Overview & Visual Behavior
Web Threads renders a complex network of constellation nodes and interconnected thread lines that form, break, and stretch with proximity distance thresholds.

## 2. Props & Configuration Interface
```typescript
interface WebThreadsProps {
  /** Particle node count (default: 60) */
  nodeCount?: number;
  /** Maximum connection distance in pixels (default: 130) */
  maxDistance?: number;
  /** Line stroke color (default: 'rgba(255, 255, 255, 0.2)') */
  lineColor?: string;
  /** Node particle color */
  nodeColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Autonomous 2D Brownian node drift at 60 FPS. Thread opacity updates instantaneously with node distance.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For node pair $(i, j)$ at positions $\vec{p}_i, \vec{p}_j$:
Distance $d_{ij} = \|\vec{p}_i - \vec{p}_j\|$.
Connection line opacity:
$$\alpha_{ij} = \begin{cases} \alpha_0 \cdot \left(1 - \frac{d_{ij}}{D_{max}}\right) & \text{if } d_{ij} < D_{max} \\ 0 & \text{otherwise} \end{cases}$$
Node velocity update:
$$\vec{p}_i(t + \Delta t) = \vec{p}_i(t) + \vec{v}_i \Delta t$$

## 5. Interaction Mechanics
A special invisible node is attached to mouse cursor, spinning connection threads to adjacent nodes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Particle Buffer: Flat `Float32Array` holding `[x, y, vx, vy]` per node.
2. Pairwise Distance Check: Optimized spatial partitioning for $O(N)$ connection queries.
3. Canvas Batch Lines: Single `ctx.beginPath()` rendering all active thread segments.
4. Boundary Bounce: Reverses node velocity when colliding with canvas edges.

## 7. Modularity & File Organization
Decompose into `WebThreads.tsx` (<120 LoC), `ThreadEngine.ts` (<130 LoC), and `threadMath.ts` (<50 LoC).
