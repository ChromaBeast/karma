# Decay Card (Components)

## 1. Overview & Visual Behavior
Decay Card renders an interactive card that deconstructs into disintegrating particle dust or pixel fragments when swiped or dragged across a threshold.

## 2. Props & Configuration Interface
```typescript
interface DecayCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Disintegration particle count (default: 60) */
  particleCount?: number;
  /** Trigger mode (default: 'hover') */
  trigger?: 'hover' | 'click' | 'swipe';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Decay particle explosion executes over $700\text{ms}$ with exponential particle deceleration.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For decay particle $k \in [0, N-1]$ at origin $(x_{0,k}, y_{0,k})$:
Velocity vector $\vec{v}_k = (V_{max} \cos\theta_k, \ V_{max} \sin\theta_k)$.
Position over time $t$:
$$\vec{p}_k(t) = \vec{p}_{0,k} + \vec{v}_k \cdot t \cdot e^{-t / \tau} + \frac{1}{2} \vec{g} t^2$$
Particle opacity & size:
$$\alpha_k(t) = 1 - \frac{t}{T}, \quad S_k(t) = S_0 \cdot \left(1 - \frac{t}{T}\right)$$

## 5. Interaction Mechanics
Dragging or hovering over card triggers particle disintegration and dissolves card face.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas Overlay: Capture card snapshot and spawn particle coordinate array.
2. Particle Simulation: Update particle positions in RAF loop with gravity and wind.
3. Card Fade: Fade base card element synchronously with particle explosion.
4. Auto Reset: Restore card when pointer exits.

## 7. Modularity & File Organization
Organized into `DecayCard.tsx` (<120 LoC), `DecayParticleEngine.ts` (<130 LoC), and `decayTypes.ts` (<40 LoC).
