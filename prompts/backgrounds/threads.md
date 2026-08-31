# Threads (Backgrounds)

## 1. Overview & Visual Behavior
Threads renders a complex woven tapestry of multi-colored glowing threads that vibrate with harmonic resonance and sway with cursor drag.

## 2. Props & Configuration Interface
```typescript
interface ThreadsProps {
  /** Thread count (default: 20) */
  threadCount?: number;
  /** Color palette */
  colors?: string[];
  /** Wave amplitude in pixels (default: 35) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous wave vibration at 60 FPS with harmonic periods.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For thread $k \in [0, N-1]$:
$$y_k(x, t) = Y_{0,k} + \sum_{m=1}^3 \frac{A}{m} \sin\left(\frac{2\pi m x}{\lambda_k} + \omega_k t + k \phi\right)$$

## 5. Interaction Mechanics
Mouse drag plucks adjacent threads like guitar strings, causing high-frequency vibration.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Splines: Draw smooth cubic Bézier curves.
2. Damped Harmonic Pluck: Spring vibration solver decays plucked thread amplitude over $800\text{ms}$.
3. Luminous Glow: Overlapping translucent threads with screen blend mode.
4. Auto Resize: Responsive viewport scaling.

## 7. Modularity & File Organization
Organized into `Threads.tsx` (<120 LoC), `ThreadSolver.ts` (<120 LoC), and `threadStyles.ts` (<40 LoC).
