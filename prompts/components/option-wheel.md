# Option Wheel (Components)

## 1. Overview & Visual Behavior
Option Wheel renders a rotating radial menu / selector wheel with physics inertia, haptic click snapping, center action badge, and directional selection.

## 2. Props & Configuration Interface
```typescript
interface OptionWheelProps {
  /** Array of menu options */
  options: { id: string; label: string; icon?: React.ReactNode }[];
  /** Selected option ID */
  selectedId?: string;
  /** Radius of wheel in pixels (default: 140) */
  radius?: number;
  /** Callback fired when an option is selected */
  onSelect?: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Snaps to selected option angle over $300\text{ms}$ with spring curve `(0.18, 0.9, 0.3, 1)`. Inertial drag settling time $\approx 500\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ options with angular slice $\Delta\theta = \frac{2\pi}{N}$:
Option $k$ angle:
$$\theta_k = k \cdot \Delta\theta$$
Cartesian coordinates on wheel:
$$x_k = R \cdot \cos(\theta_k + \theta_{rot}), \quad y_k = R \cdot \sin(\theta_k + \theta_{rot})$$
Nearest snap angle index:
$$k_{snap} = \left\lfloor \frac{-\theta_{rot} + \Delta\theta/2}{\Delta\theta} \right\rfloor \bmod N$$

## 5. Interaction Mechanics
Pointer dragging spins wheel. Wheel snaps cleanly to closest option upon release. Arrow keys rotate wheel step-by-step.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG / DOM Circle: Absolute positioned option chips around central pivot.
2. Angular Drag: Calculate `atan2(dy, dx)` deltas on pointer move.
3. Inertial Deceleration: Physics hook applies rotational friction.
4. Screen Reader: Standard radio group ARIA markup (`role=\"radiogroup\"`).

## 7. Modularity & File Organization
Organized into `OptionWheel.tsx` (<130 LoC), `useWheelPhysics.ts` (<100 LoC), and `wheelMath.ts` (<50 LoC).
