# Blur Text (Text Animations)

## 1. Overview & Visual Behavior
Blur Text executes high-fidelity typographic entrance reveals by transitioning characters or words from a heavy Gaussian blur with vertical offset and zero opacity to sharp, crystal-clear text.

## 2. Props & Configuration Interface
```typescript
interface BlurTextProps {
  /** Text content */
  text: string;
  /** Granularity of blur stagger (default: 'words') */
  splitBy?: 'words' | 'chars';
  /** Initial blur radius in pixels (default: 12) */
  blurRadius?: number;
  /** Initial vertical translation offset in pixels (default: 20) */
  offsetY?: number;
  /** Animation duration per element in milliseconds (default: 700) */
  duration?: number;
  /** Stagger delay between tokens in milliseconds (default: 40) */
  stagger?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Each word/char transitions over $700\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)` with $40\text{ms}$ stagger interval.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For token index $i$, normalized time $\tau_i$:
$$\text{filter: blur}(B_i\text{px}), \quad B_i(\tau_i) = B_{initial} \cdot (1 - f(\tau_i))$$
$$y_i(\tau_i) = Y_{initial} \cdot (1 - f(\tau_i))$$
$$\alpha_i(\tau_i) = f(\tau_i)$$
where $f(\tau) = 1 - (1 - \tau)^3$ (cubic ease-out).

## 5. Interaction Mechanics
Scroll-activated via IntersectionObserver with threshold $0.2$. Reversible on viewport exit if desired.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Token Spans: Wrap each token with `inline-block will-change: filter, transform, opacity`.
2. WAAPI Keyframes: Animate `filter: blur(12px) translateY(20px) opacity(0)` to `blur(0px) translateY(0px) opacity(1)`.
3. Fallback: On low-power devices, degrade `filter: blur` to simple opacity fade.
4. Layout Safety: Maintain standard whitespace flow without breaking flex/grid layouts.

## 7. Modularity & File Organization
Decompose into `BlurText.tsx` (<120 LoC), `useBlurTransition.ts` (<80 LoC), and `blurStyles.ts` (<50 LoC).
