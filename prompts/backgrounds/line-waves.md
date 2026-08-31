# Line Waves (Backgrounds)

## 1. Overview & Visual Behavior
Line Waves renders a sleek array of horizontal vector lines that ripple with traveling sine wave crests and mouse displacement.

## 2. Props & Configuration Interface
```typescript
interface LineWavesProps {
  /** Line count (default: 24) */
  lineCount?: number;
  /** Line stroke color */
  lineColor?: string;
  /** Wave amplitude in pixels (default: 30) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous wave propagation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For line $k \in [0, N-1]$ at vertical base $y_k$:
$$y_k(x, t) = y_k + A \sin\left(\frac{2\pi x}{\lambda} + \omega t + k \phi\right) + \Delta y_{mouse}(x)$$

## 5. Interaction Mechanics
Mouse cursor acts as a wave ripple generator across adjacent lines.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Batch draw path segments with `ctx.lineTo()`.
2. Responsive Lines: Scales line spacing based on container height.
3. GPU Composite: Single RAF render pass.
4. Zero Memory Churn: Reuses coordinate arrays.

## 7. Modularity & File Organization
Organized into `LineWaves.tsx` (<110 LoC) and `waveLineMath.ts` (<50 LoC).
