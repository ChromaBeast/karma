# Infinite Spiral (Components)

## 1. Overview & Visual Behavior
Infinite Spiral arranges image cards or project nodes in a continuous logarithmic 3D spiral helix that users can scrub, spin, and zoom through infinitely with inertia and depth scaling.

## 2. Props & Configuration Interface
```typescript
interface InfiniteSpiralProps {
  /** Array of items rendered along the spiral */
  items: { id: string | number; title: string; image?: string; link?: string; content?: React.ReactNode }[];
  /** Radius growth factor per revolution (default: 1.2) */
  spiralGrowth?: number;
  /** Vertical pitch height between spiral loops in pixels (default: 300) */
  pitch?: number;
  /** Number of visible items along spiral path (default: 24) */
  visibleCount?: number;
  /** Rotation speed damping factor (default: 0.94) */
  damping?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Inertial scrolling and pointer dragging decelerate via exponential decay with settling time $\approx 800\text{ms}$. Item scale and opacity transitions update per-frame at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Logarithmic Archimedean Spiral in cylindrical coordinates $(r, \theta, z)$:
$$r(\theta) = R_0 \cdot e^{a \theta}, \quad z(\theta) = \frac{\text{pitch}}{2\pi} \cdot \theta$$
Cartesian conversion for card $k$ at continuous spiral angle $\theta_k(t) = \theta_0(t) + k \cdot \Delta\theta$:
$$x_k = r(\theta_k) \cdot \cos(\theta_k), \quad y_k = z(\theta_k), \quad z_k = r(\theta_k) \cdot \sin(\theta_k)$$
3D perspective scale and depth projection:
$$\text{scale}_k = \frac{d_{cam}}{d_{cam} + z_k}, \quad \alpha_k = \text{clamp}\left(1 - \frac{|z_k|}{Z_{max}}, 0, 1\right)$$

## 5. Interaction Mechanics
Vertical mouse wheel and pointer drag rotate the spiral along its central axis. Clicking any item smoothly animates it to the foreground focal anchor.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Cylindrical 3D Container: `perspective: 1200px; transform-style: preserve-3d`.
2. Dynamic Caching: Maintain index window $[k_{min}, k_{max}]$ around current focus angle to avoid rendering out-of-view items.
3. Transform Matrices: Apply `translate3d(x, y, z) rotateY(theta)` to card elements on composite layer.
4. Touch Gestures: Multi-touch drag and pinch-to-zoom support.

## 7. Modularity & File Organization
Organized into `InfiniteSpiral.tsx` (<130 LoC), `useSpiralPhysics.ts` (<100 LoC), and `spiralMath.ts` (<70 LoC).
