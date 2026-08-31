# Falling Text (Text Animations)

## 1. Overview & Visual Behavior
Falling Text simulates rigid-body physics where individual characters detach from their baseline, accelerate downward under gravity, collide with ground/walls, and bounce with angular momentum.

## 2. Props & Configuration Interface
```typescript
interface FallingTextProps {
  /** Text string whose characters fall and collide */
  text: string;
  /** Gravity acceleration in pixels/sec^2 (default: 980) */
  gravity?: number;
  /** Coefficient of restitution / bounciness [0..1] (default: 0.6) */
  restitution?: number;
  /** Trigger mode (default: 'click') */
  trigger?: 'click' | 'hover' | 'mount' | 'scroll';
  /** Floor boundary height in pixels (default: container height) */
  floorY?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Physics simulation runs at 60 FPS until all character bodies reach rest kinetic energy ($E_k < \epsilon$, $\approx 1.8\text{s}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For character $i$ with position $(x_i, y_i)$, velocity $(v_{x,i}, v_{y,i})$, and angle $\theta_i$:
1. Gravity Acceleration:
   $$v_{y,i}(t + \Delta t) = v_{y,i}(t) + g \cdot \Delta t$$
   $$y_i(t + \Delta t) = y_i(t) + v_{y,i}(t + \Delta t) \cdot \Delta t$$
2. Floor Collision ($y_i \ge Y_{floor}$):
   $$y_i = Y_{floor}, \quad v_{y,i} = -e \cdot v_{y,i}$$
   $$v_{x,i} = v_{x,i} \cdot \mu_{friction}, \quad \omega_i = \omega_i \cdot 0.8$$
3. Rotational Orientation:
   $$\theta_i(t + \Delta t) = \theta_i(t) + \omega_i \cdot \Delta t$$

## 5. Interaction Mechanics
Clicking or hovering triggers physics release. Users can drag individual fallen letters with pointer.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Character Extraction: Measure baseline positions of each character before detaching into absolute coordinates.
2. Physics Engine: Run 2D Verlet or Euler integration loop in `requestAnimationFrame`.
3. Transform Updates: Apply `transform: translate3d(x, y, 0) rotate(theta)` to individual character spans.
4. Rest State: Freeze RAF when all letters settle to avoid background battery drain.

## 7. Modularity & File Organization
Organized into `FallingText.tsx` (<120 LoC), `PhysicsWorld.ts` (<150 LoC), and `bodyTypes.ts` (<50 LoC).
