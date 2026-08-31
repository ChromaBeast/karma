# Circular Text (Text Animations)

## 1. Overview & Visual Behavior
Circular Text bends typography along a complete $360^\circ$ radial circle with uniform angular spacing, rotational alignment, and continuous spin or mouse-driven rotational drag physics.

## 2. Props & Configuration Interface
```typescript
interface CircularTextProps {
  /** Text string to distribute around circle */
  text: string;
  /** Radius of circular path in pixels (default: 100) */
  radius?: number;
  /** Continuous rotation speed in RPM or seconds per rotation (default: 15s) */
  spinDuration?: number;
  /** Direction of rotation (default: 'clockwise') */
  direction?: 'clockwise' | 'counter-clockwise';
  /** Rotate on pointer drag (default: true) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous rotation completes one full revolution ($2\pi\text{ rad}$) every $15\text{s}$ linearly (`linear` easing, infinite loop). Inertial drag decays over $800\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ characters, the angular step between character $i \in [0, N-1]$ is:
$$\Delta \theta = \frac{2\pi}{N}$$
$$\theta_i(t) = \theta_0(t) + i \cdot \Delta \theta$$
Cartesian coordinates for character $i$:
$$x_i = R \cdot \cos(\theta_i(t)), \quad y_i = R \cdot \sin(\theta_i(t))$$
Character rotation angle:
$$\phi_i = \theta_i(t) + \frac{\pi}{2}$$

## 5. Interaction Mechanics
Pointer down + drag computes angular delta $\Delta \theta = \arctan2(y_2, x_2) - \arctan2(y_1, x_1)$, imparting rotational angular velocity $\omega$.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Path or CSS Transforms: Position characters using `transform: rotate(calc(var(--angle))) translateY(calc(-1 * var(--radius)))`.
2. Animation Loop: Rotate root container or increment base angle `--rot` in `requestAnimationFrame`.
3. Inertial Physics: Apply damping $\omega(t + \Delta t) = \omega(t) \cdot 0.95$ when pointer is released.
4. Center Anchor: Support optional centered icon or logo inside circular perimeter.

## 7. Modularity & File Organization
Organized into `CircularText.tsx` (<130 LoC), `useAngularDrag.ts` (<100 LoC), and `circularMath.ts` (<60 LoC).
