# Depth Text (Text Animations)

## 1. Overview & Visual Behavior
Depth Text generates pseudo-3D layered extruded typography using multi-layered directional text-shadows, lighting specular highlights, and real-time mouse parallax tilt.

## 2. Props & Configuration Interface
```typescript
interface DepthTextProps {
  /** Text content */
  text: string;
  /** Extrusion depth in pixels (default: 12) */
  depth?: number;
  /** Direction angle of extrusion in degrees (default: 45) */
  angle?: number;
  /** Front face color */
  frontColor?: string;
  /** Shadow extrusion base color */
  shadowColor?: string;
  /** Enable mouse tilt parallax (default: true) */
  interactive?: number | boolean;
  /** Parallax intensity scale (default: 1.0) */
  intensity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Mouse parallax tilt responds via critically damped spring with settling time $\approx 300\text{ms}$ and damping ratio $\zeta = 0.85$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For extrusion depth $D$ and angle $\theta$:
$$S_n = \sum_{k=1}^D (k \cdot \cos(\theta))\text{px } (k \cdot \sin(\theta))\text{px } 0\text{px } \text{color}(k)$$
where $\text{color}(k) = \text{lerpColor}(\text{baseShadow}, \text{darkShadow}, k / D)$.
3D perspective rotation from cursor offset $(\Delta x, \Delta y)$:
$$\text{rotateX} = -\frac{\Delta y}{H} \cdot \theta_{max}, \quad \text{rotateY} = \frac{\Delta x}{W} \cdot \theta_{max}$$

## 5. Interaction Mechanics
Tracks pointer offset relative to component center $(x - x_0, y - y_0)$ to compute directional lighting and perspective tilt.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dynamic Style Generation: Compute comma-separated `text-shadow` layers inside a memoized hook.
2. Perspective Wrapper: Container with `perspective: 800px; transform-style: preserve-3d`.
3. Spring Lerp: Update CSS variables `--tilt-x`, `--tilt-y` smoothly via `requestAnimationFrame`.
4. Performance: Avoid layout thrashing by updating transforms only on composite layer.

## 7. Modularity & File Organization
Decompose into `DepthText.tsx` (<120 LoC), `depthShadows.ts` (<80 LoC), and `useTiltSpring.ts` (<80 LoC).
