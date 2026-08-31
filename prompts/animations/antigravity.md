# Antigravity (Animations)

## 1. Overview & Visual Behavior
Antigravity creates an interactive physics playground where floating UI chips, icon spheres, or cards float with zero gravity, bouncing off walls and repelling each other with spring collisions.

## 2. Props & Configuration Interface
```typescript
interface AntigravityProps {
  /** Array of items/icons to float in antigravity */
  items: React.ReactNode[];
  /** Friction damping factor (default: 0.98) */
  friction?: number;
  /** Maximum floating velocity in pixels/sec (default: 60) */
  maxSpeed?: number;
  /** Particle repulsion distance in pixels (default: 80) */
  collisionRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous Newtonian physics simulation at 60 FPS. Collisions resolve elastically in a single frame tick.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For particle $i$ with position $\vec{p}_i$, velocity $\vec{v}_i$, and mass $m_i$:
1. Continuous Brownian Drift:
   $$\vec{v}_i(t + \Delta t) = \vec{v}_i(t) \cdot \mu + \vec{\eta}(t)$$
   where $\vec{\eta} \sim N(0, \sigma^2)$.
2. Elastic Wall Bounce ($x_i \le R$ or $x_i \ge W - R$):
   $$v_{x,i} = -e \cdot v_{x,i}$$
3. Inter-Particle Collision Resolution ($d_{ij} < 2R$):
   $$\vec{v}_i' = \vec{v}_i - \frac{2m_j}{m_i + m_j} \frac{\langle \vec{v}_i - \vec{v}_j, \vec{p}_i - \vec{p}_j \rangle}{\|\vec{p}_i - \vec{p}_j\|^2} (\vec{p}_i - \vec{p}_j)$$

## 5. Interaction Mechanics
Users can grab, throw, and flick floating elements with pointer drag inertia.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Physics Engine: Pure TypeScript 2D physics solver running in `requestAnimationFrame`.
2. Pointer Drag: Spring anchor attaches to grabbed particle during drag events.
3. DOM Render: Position child items with `transform: translate3d(x, y, 0)`.
4. Boundary Clamping: Prevent items from escaping container bounds.

## 7. Modularity & File Organization
Organized into `Antigravity.tsx` (<120 LoC), `AntigravityEngine.ts` (<150 LoC), and `physicsTypes.ts` (<50 LoC).
