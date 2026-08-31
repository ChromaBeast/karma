# Glitch Text (Text Animations)

## 1. Overview & Visual Behavior
Glitch Text creates cyberpunk digital distortion with chromatic RGB channel separation, horizontal slice displacement keyframes (`clip-path: inset()`), and sporadic noise pulses.

## 2. Props & Configuration Interface
```typescript
interface GlitchTextProps {
  /** Text content */
  text: string;
  /** Glitch effect intensity scale (default: 1.0) */
  intensity?: number;
  /** Trigger mode (default: 'continuous') */
  mode?: 'continuous' | 'hover' | 'sporadic';
  /** Primary RGB split colors (default: ['#ff0055', '#00ffff']) */
  splitColors?: [string, string];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Glitch bursts occur sporadically every $2\text{s}$ to $4\text{s}$ for a duration of $200\text{ms}$ to $400\text{ms}$. Slice keyframes update at 20 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
RGB channel displacement vectors:
$$\vec{d}_{red} = (-2 \cdot \text{intensity}, 0)\text{px}, \quad \vec{d}_{cyan} = (2 \cdot \text{intensity}, 0)\text{px}$$
Random horizontal slice clip-path for slice $k$:
$$\text{clip-path: inset}(y_k\% \ 0 \ (100 - y_k - h_k)\% \ 0)$$
where $y_k = \text{rand}(0, 100)$, $h_k = \text{rand}(5, 25)$.
Jitter transform:
$$\Delta x = \text{rand}(-4, 4) \cdot \text{intensity}\text{px}$$

## 5. Interaction Mechanics
Triggers high-intensity glitch burst on mouse enter or click.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Triple Layer Stack: Render base text layer plus two pseudo-elements/spans with `mix-blend-mode: screen`.
2. Dynamic Clip Paths: Generate random slice clip paths in CSS `@keyframes glitch-anim`.
3. Sporadic Scheduler: Use randomized `setTimeout` to fire glitch bursts intermittently.
4. Accessible DOM: Screen readers read only single primary layer (`aria-hidden` on clones).

## 7. Modularity & File Organization
Decompose into `GlitchText.tsx` (<120 LoC), `useGlitchLoop.ts` (<90 LoC), and `glitchStyles.ts` (<60 LoC).
