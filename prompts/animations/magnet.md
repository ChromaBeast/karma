# Magnet (Animations)

## 1. Overview & Visual Behavior
Magnet attaches physical magnetic attraction to interactive buttons, badges, or icons, pulling the element smoothly toward the cursor when within magnetic proximity.

## 2. Props & Configuration Interface
```typescript
interface MagnetProps {
  /** Interactive element to magnetize */
  children: React.ReactNode;
  /** Maximum magnetic translation displacement in pixels (default: 30) */
  magnetStrength?: number;
  /** Magnetic trigger radius in pixels (default: 120) */
  activeRadius?: number;
  /** Spring return stiffness (default: 0.15) */
  springTension?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pointer tracking updates at 60/120 FPS. Rebound spring settles within $350	ext{ms}$ upon pointer leave.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For element center $(x_0, y_0)$ and cursor $(x_c, y_c)$:
Displacement vector:
$$\vec{d} = (x_c - x_0, \ y_c - y_0), \quad r = \|\vec{d}\|$$
Magnetic pull displacement $\vec{\Delta}$:
$$\vec{\Delta} = \begin{cases} \frac{\vec{d}}{r} \cdot \text{magnetStrength} \cdot \left(1 - \frac{r}{R}\right)^{0.8} & \text{if } r < R \\ \vec{0} & \text{otherwise} \end{cases}$$
Smooth spring update:
$$\vec{p}(t) = \vec{p}(t-1) + \alpha \cdot (\vec{\Delta} - \vec{p}(t-1))$$

## 5. Interaction Mechanics
Attracts element towards cursor when mouse enters influence radius $R$. Snaps back to $(0,0)$ when mouse exits.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Bounding Box Cache: Measure element center on mount and scroll.
2. Pointer Listener: Global or container-level `pointermove` listener.
3. Transform Update: Apply `transform: translate3d(x, y, 0)` via CSS variables.
4. Spring Return: Run smooth spring physics animation loop upon mouse leave.

## 7. Modularity & File Organization
Decompose into `Magnet.tsx` (<110 LoC) and `useMagnetPhysics.ts` (<90 LoC).
