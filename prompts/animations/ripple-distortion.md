# Ripple Distortion (Animations)

## 1. Overview & Visual Behavior
Ripple Distortion applies interactive 2D water wave ripples and refractive distortion to underlying images or UI panels using Canvas 2D displacement maps or WebGL normal shaders.

## 2. Props & Configuration Interface
```typescript
interface RippleDistortionProps {
  /** Background image URL to apply ripple distortion to */
  imageSrc: string;
  /** Ripple propagation speed (default: 1.2) */
  speed?: number;
  /** Wave damping / decay factor (default: 0.96) */
  damping?: number;
  /** Refraction displacement intensity (default: 24) */
  refractionIntensity?: number;
  /** Trigger mode (default: 'pointer-move') */
  trigger?: 'pointer-move' | 'click' | 'interval';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Ripples propagate outward at $v = 150	ext{px/s}$ and attenuate exponentially over $1200	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D discrete wave wave equation on grid $(x, y)$:
$$h(x, y, t + 1) = \left(\frac{h(x-1, y, t) + h(x+1, y, t) + h(x, y-1, t) + h(x, y+1, t)}{2} - h(x, y, t-1)\right) \cdot d$$
where $d \in [0.95, 0.99]$ is damping.
Refraction normal vectors:
$$N_x(x, y) = h(x+1, y) - h(x-1, y)$$
$$N_y(x, y) = h(x, y+1) - h(x, y-1)$$
Displaced texture lookup:
$$(u', v') = \left(u + N_x \cdot \frac{I}{W}, \ v + N_y \cdot \frac{I}{H}\right)$$

## 5. Interaction Mechanics
Mouse movements and clicks inject energy impulses $h(x_{click}, y_{click}) = E_0$ into the height field.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Buffer Grid: Maintain two `Int16Array` or `Float32Array` buffers for current and previous heightmaps.
2. Fast Kernel: Process wave propagation step in Web Worker or WebGL fragment shader.
3. Canvas Render: Sample source texture displaced by normal gradient.
4. Auto Sleep: Stop simulation loop when total energy $\sum |h| < \epsilon$.

## 7. Modularity & File Organization
Organized into `RippleDistortion.tsx` (<120 LoC), `WaveGrid.ts` (<150 LoC), and `rippleShader.ts` (<70 LoC).
