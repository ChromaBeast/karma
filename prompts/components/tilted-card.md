# Tilted Card (Components)

## 1. Overview & Visual Behavior
Tilted Card creates an interactive 3D perspective card that tilts toward the mouse pointer with multi-layered depth parallax, cast shadows, and floating caption overlays.

## 2. Props & Configuration Interface
```typescript
interface TiltedCardProps {
  /** Image URL */
  imageSrc: string;
  /** Card caption / title */
  captionText?: string;
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Scale on hover (default: 1.05) */
  scale?: number;
  /** Card corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Tilt angles track mouse at 60/120 FPS via exponential lerp ($\alpha = 0.12$). Rebounds to $(0^\circ, 0^\circ)$ in $350\text{ms}$ on mouse leave.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Normalized cursor coordinates $(u, v) \in [-1, 1]$ from card center:
$$u = \frac{2(x_c - X_0)}{W} - 1, \quad v = \frac{2(y_c - Y_0)}{H} - 1$$
Rotation angles:
$$\text{rotateY} = u \cdot \theta_{max}, \quad \text{rotateX} = -v \cdot \theta_{max}$$
Floating caption parallax layer translation:
$$x_{caption} = u \cdot 20\text{px}, \quad y_{caption} = v \cdot 20\text{px}, \quad z_{caption} = 40\text{px}$$

## 5. Interaction Mechanics
3D tilt smoothly responds to mouse hover. Overlay elements lift off card surface along Z-axis.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Card Shell: `transform-style: preserve-3d; perspective: 1000px`.
2. Parallax Layers: Child elements use `transform: translateZ(40px)` to float above background.
3. RAF Smooth Loop: Update CSS variables `--tilt-x`, `--tilt-y` smoothly.
4. Mobile Safe: Degrades to static card on touch screens.

## 7. Modularity & File Organization
Decompose into `TiltedCard.tsx` (<120 LoC) and `tiltedCardStyles.ts` (<50 LoC).
