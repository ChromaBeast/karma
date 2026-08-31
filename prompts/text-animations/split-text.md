# Split Text (Text Animations)

## 1. Overview & Visual Behavior
Split Text parses strings into individual character, word, or line spans, enabling granular staggered entrance reveals, 3D rotations, and clipping mask unmasking.

## 2. Props & Configuration Interface
```typescript
interface SplitTextProps {
  /** Text to split and animate */
  text: string;
  /** Split granularity mode (default: 'chars') */
  splitBy?: 'chars' | 'words' | 'lines';
  /** Stagger delay between sequential elements in milliseconds (default: 30) */
  stagger?: number;
  /** Animation duration per element in milliseconds (default: 600) */
  duration?: number;
  /** Preset animation effect (default: 'slide-up') */
  animation?: 'slide-up' | 'slide-down' | 'fade' | 'rotate-x' | 'scale';
  /** Custom easing curve (default: 'cubic-bezier(0.16, 1, 0.3, 1)') */
  easing?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Individual tokens animate over $600\text{ms}$ with staggered offsets $\Delta t_i = i \cdot 30\text{ms}$. Total sequence time $T = T_{duration} + N \cdot \Delta t$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For token index $i \in [0, N-1]$, animation start time $t_{start, i} = t_0 + i \cdot \text{stagger}$:
$$\tau_i(t) = \text{clamp}\left(\frac{t - t_{start, i}}{T_{duration}}, 0, 1\right)$$
$$y_i(\tau_i) = y_{initial} \cdot (1 - f(\tau_i))$$
$$\theta_{x, i}(\tau_i) = \theta_{initial} \cdot (1 - f(\tau_i))$$
where $f(\tau) = 1 - (1 - \tau)^4$ (quartic ease-out).

## 5. Interaction Mechanics
Triggers on scroll view entry using IntersectionObserver. Preserves whitespace and line wraps flawlessly.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Tokenizer: Split string while respecting Unicode grapheme clusters and spaces (`&nbsp;`).
2. Wrapper Overflow: Wrap each character/word in `inline-block overflow-hidden` container.
3. CSS Variables: Inject `--delay: ${i * stagger}ms` into inline styles.
4. Screen Reader: Render hidden full text in `aria-hidden="false"` span with split spans marked `aria-hidden="true"`.

## 7. Modularity & File Organization
Organized into `SplitText.tsx` (<120 LoC), `splitTokenizer.ts` (<80 LoC), and `splitVariants.ts` (<70 LoC).
