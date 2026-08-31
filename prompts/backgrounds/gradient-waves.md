# Gradient Waves (Backgrounds)

## 1. Overview & Visual Behavior
Gradient Waves renders layered sinusoidal ribbons of shifting color gradients that ebb, flow, and overlap with translucent wave crests and mouse reactivity.

## 2. Props & Configuration Interface
```typescript
interface GradientWavesProps {
  /** Number of wave layers (default: 4) */
  layers?: number;
  /** Wave color palette stops */
  colors?: string[];
  /** Wave oscillation speed (default: 1.0) */
  speed?: number;
  /** Wave height amplitude in pixels (default: 60) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous wave undulation with harmonically related periods $T_k = \frac{T_0}{k}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For wave layer $k \in [1, N]$ at horizontal coordinate $x \in [0, W]$:
$$y_k(x, t) = Y_{base, k} + A_k \sin\left(\frac{2\pi x}{\lambda_k} + \omega_k t + \phi_k\right) + \frac{A_k}{2} \cos\left(\frac{4\pi x}{\lambda_k} - 0.5 \omega_k t\right)$$
Area fill polygon:
$$\text{path} = [(0, H), (0, y_k(0, t)), \dots, (W, y_k(W, t)), (W, H)]$$

## 5. Interaction Mechanics
Pointer height modulates wave amplitude $A_k$ in real-time.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Area Fills: Render bezier curves across sampled wave peaks.
2. Gradient Linear Fills: Apply vertical `createLinearGradient()` on each layer.
3. Layer Blend: Overlapping translucent layers with `globalAlpha = 0.6`.
4. Dynamic Resizing: Auto-measures canvas bounding rect.

## 7. Modularity & File Organization
Organized into `GradientWaves.tsx` (<120 LoC), `WaveLayer.ts` (<110 LoC), and `waveMath.ts` (<50 LoC).
