# Laser Flow (Animations)

## 1. Overview & Visual Behavior
Laser Flow renders high-speed glowing laser energy beams coursing through circuit board traces, wireframe borders, or connection lines with intense neon bloom.

## 2. Props & Configuration Interface
```typescript
interface LaserFlowProps {
  /** SVG path d string defining the laser circuit */
  pathD: string;
  /** Laser beam color (default: '#00ffff') */
  laserColor?: string;
  /** Beam length in pixels (default: 80) */
  beamLength?: number;
  /** Travel speed in pixels/second (default: 400) */
  speed?: number;
  /** Glow intensity blur in pixels (default: 8) */
  glowBlur?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Laser packet travels continuously along path with high linear velocity $V = 400	ext{px/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For path length $L$:
Laser head position:
$$s_{head}(t) = (V \cdot t) \bmod L$$
Stroke dasharray definition:
$$\text{stroke-dasharray} = [L_{beam}, L]$$
$$\text{stroke-dashoffset} = -s_{head}(t)$$
Glow intensity falloff:
$$I(d) = I_0 \cdot \exp\left(-\frac{d^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Laser speed accelerates and sparks when hovering over connected circuit nodes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual SVG Paths: Base muted trace path plus layered glowing laser overlay path.
2. Dashoffset Animation: Update `stroke-dashoffset` in `requestAnimationFrame` or CSS keyframe.
3. Multi-Layer Glow: 3 stroke layers with increasing width and decreasing opacity.
4. Path Cache: Pre-calculate path length via `SVGPathElement.getTotalLength()`.

## 7. Modularity & File Organization
Organized into `LaserFlow.tsx` (<120 LoC), `LaserPath.tsx` (<90 LoC), and `laserUtils.ts` (<50 LoC).
