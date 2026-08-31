# Swarm Cursor (Animations)

## 1. Overview & Visual Behavior
Swarm Cursor generates a dynamic flock of autonomous boid particles that swirl, flock, and swarm around the mouse pointer following Craig Reynolds' Boids flocking rules.

## 2. Props & Configuration Interface
```typescript
interface SwarmCursorProps {
  /** Total count of swarm boids (default: 40) */
  count?: number;
  /** Maximum boid velocity in pixels/second (default: 300) */
  maxSpeed?: number;
  /** Maximum steering force (default: 0.15) */
  maxForce?: number;
  /** Swarm particle color or color array */
  color?: string | string[];
  /** Flocking attraction radius to cursor in pixels (default: 250) */
  cursorAttractRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous autonomous flocking at 60 FPS with organic emergent behavior and dynamic formation shifts.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Reynolds Flocking Rules for boid $i$:
1. Separation (avoid crowding neighbors):
   $$\vec{F}_{sep} = \sum_{j \ne i, r_{ij} < d_{sep}} \frac{\vec{p}_i - \vec{p}_j}{r_{ij}^2}$$
2. Alignment (steer towards average heading):
   $$\vec{F}_{ali} = \frac{1}{K} \sum_{j \in N} \vec{v}_j - \vec{v}_i$$
3. Cohesion (steer towards center of mass):
   $$\vec{F}_{coh} = \frac{1}{K} \sum_{j \in N} \vec{p}_j - \vec{p}_i$$
4. Cursor Target Attraction:
   $$\vec{F}_{target} = \text{steer}(\vec{p}_i, \vec{p}_{cursor})$$
$$\vec{F}_{total} = w_s \vec{F}_{sep} + w_a \vec{F}_{ali} + w_c \vec{F}_{coh} + w_t \vec{F}_{target}$$

## 5. Interaction Mechanics
Boids flock closely around cursor when still, and stretch into aerodynamic trailing streams during rapid pointer motion.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Particle Array: Store position, velocity, acceleration in flat `Float32Array`.
2. Spatial Partitioning: Use simple 2D spatial grid for $O(N)$ neighbor queries.
3. Canvas 2D Drawing: Draw oriented triangles pointing along velocity vectors $\theta = \arctan2(v_y, v_x)$.
4. Frame Throttling: Pause simulation when pointer is outside window or tab is hidden.

## 7. Modularity & File Organization
Organized into `SwarmCursor.tsx` (<110 LoC), `BoidFlock.ts` (<150 LoC), and `boidMath.ts` (<70 LoC).
