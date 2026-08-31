# Acid Squares (Backgrounds)

## 1. Overview & Visual Behavior
Acid Squares generates dynamic psychedelic concentric squares that pulse, rotate, and cycle through vibrant 90s acid-house neon color palettes.

## 2. Props & Configuration Interface
```typescript
interface AcidSquaresProps {
  /** Number of concentric square layers (default: 14) */
  layers?: number;
  /** Rotation speed (default: 1.0) */
  speed?: number;
  /** Zoom pulse scale amplitude (default: 0.2) */
  pulseScale?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous rotation and zoom pulse cycle with period $T = 4.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For concentric square layer $k \in [0, N-1]$:
Scale factor:
$$S_k(t) = \left(1 - \frac{k}{N}\right) \cdot (1 + A \sin(\omega t - k \phi))$$
Rotation angle:
$$\theta_k(t) = (-1)^k \cdot \omega_{rot} t + k \cdot 15^\circ$$
Neon Hue cycling:
$$\text{Hue}_k(t) = (\omega_{color} t + k \cdot 25^\circ) \bmod 360^\circ$$

## 5. Interaction Mechanics
Pointer position modulates rotation direction and zoom pulse frequency.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / SVG: Render nested rotated rectangles centered at $(W/2, H/2)$.
2. Additive Color Blending: `mix-blend-mode: screen` or `globalCompositeOperation: 'screen'`.
3. Neon Glow: Layered stroke drawing with decreasing alpha.
4. Auto Resize: Centers geometry automatically on container resize.

## 7. Modularity & File Organization
Decompose into `AcidSquares.tsx` (<120 LoC) and `acidSquareMath.ts` (<60 LoC).
