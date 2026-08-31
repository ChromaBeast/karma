# Gradient Blinds (Backgrounds)

## 1. Overview & Visual Behavior
Gradient Blinds renders vertical or horizontal Venetian blinds with staggered gradient fills that rotate and flip to reveal new color states.

## 2. Props & Configuration Interface
```typescript
interface GradientBlindsProps {
  /** Number of blind slats (default: 16) */
  slatCount?: number;
  /** Slat rotation angle in degrees (default: 45) */
  angle?: number;
  /** Color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Slats rotate in $600\text{ms}$ with staggered offsets ($30\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For blind slat $k \in [0, N-1]$:
Rotation angle:
$$\theta_k(t) = \theta_0 + \theta_{max} \cdot f(\tau_k)$$
where $\tau_k = \text{clamp}\left(\frac{t - k \cdot \text{stagger}}{T}, 0, 1\right)$.

## 5. Interaction Mechanics
Mouse movement across blinds rotates individual slats dynamically.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. DOM Slat Strips: Flex container with $N$ slats with `transform-style: preserve-3d`.
2. CSS 3D Transforms: `rotateX` / `rotateY` with perspective.
3. Gradient Backgrounds: Multi-stop linear gradients on front and back faces.
4. Tailwind Integration: Pure Tailwind CSS classes.

## 7. Modularity & File Organization
Decompose into `GradientBlinds.tsx` (<110 LoC) and `blindStyles.ts` (<50 LoC).
