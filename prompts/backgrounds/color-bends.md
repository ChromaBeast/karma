# Color Bends (Backgrounds)

## 1. Overview & Visual Behavior
Color Bends renders chromatic ribbon waves that bend and warp through space with holographic prismatic colors and smooth bezier paths.

## 2. Props & Configuration Interface
```typescript
interface ColorBendsProps {
  /** Ribbon band count (default: 8) */
  bands?: number;
  /** Animation speed (default: 1.0) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous chromatic wave phasing at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Ribbon spine curve $y(x, t) = \sum_{m=1}^3 A_m \sin(k_m x + \omega_m t)$.
Color stop gradient:
$$\text{Color}(k) = \text{hsl}\left(\frac{k}{N} \cdot 360^\circ + \omega t, \ 80\%, \ 60\%\right)$$

## 5. Interaction Mechanics
Mouse drag bends ribbon paths dynamically.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / SVG: Multi-layer spline ribbons.
2. Prismatic Blending: `globalCompositeOperation: 'screen'`.
3. Auto Resize: Dynamically matches viewport width.
4. High Performance: Low-poly spline evaluation.

## 7. Modularity & File Organization
Organized into `ColorBends.tsx` (<110 LoC) and `bendMath.ts` (<50 LoC).
