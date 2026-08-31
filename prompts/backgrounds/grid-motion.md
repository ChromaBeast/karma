# Grid Motion (Backgrounds)

## 1. Overview & Visual Behavior
Grid Motion renders high-speed moving 2D/3D grid floor perspective lines, creating an endless retro synthwave highway illusion.

## 2. Props & Configuration Interface
```typescript
interface GridMotionProps {
  /** Grid travel velocity (default: 150) */
  speed?: number;
  /** Grid line color (default: '#ec4899') */
  color?: string;
  /** Horizon height percentage (default: 50) */
  horizonY?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous grid perspective translation at $V = 150\text{px/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Perspective Grid Lines:
Horizontal grid line $k$ depth $z_k(t) = (z_{0,k} - V t) \bmod Z_{max}$.
Screen Y coordinate:
$$y_k(t) = Y_{horizon} + \frac{H_{eye} \cdot d_{cam}}{z_k(t)}$$
Vertical perspective lines radiating from $(X_{vanish}, Y_{horizon})$:
$$x_k(y) = X_{vanish} + (k \cdot W_{spacing}) \cdot \left(\frac{y - Y_{horizon}}{H - Y_{horizon}}\right)$$

## 5. Interaction Mechanics
Mouse steering shifts horizon vanishing point horizontally.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / CSS 3D: Batch draw perspective grid lines.
2. Horizon Gradient: Dark synthwave sunset gradient at horizon.
3. Neon Glow: Layered stroke drawing with `globalCompositeOperation: 'screen'`.
4. Lightweight: Pure mathematical rendering with zero memory allocations.

## 7. Modularity & File Organization
Organized into `GridMotion.tsx` (<120 LoC) and `gridMotionMath.ts` (<50 LoC).
