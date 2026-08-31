# Scroll Reveal (Text Animations)

## 1. Overview & Visual Behavior
Scroll Reveal exposes paragraphs, sentences, or characters word-by-word synchronously tied to window scroll depth using opacity masking and wipe thresholds.

## 2. Props & Configuration Interface
```typescript
interface ScrollRevealProps {
  /** Text or React children to reveal on scroll */
  children: string;
  /** Reveal granularity (default: 'words') */
  mode?: 'words' | 'characters' | 'lines';
  /** Inactive base opacity (default: 0.15) */
  baseOpacity?: number;
  /** Active revealed opacity (default: 1.0) */
  activeOpacity?: number;
  /** Scroll trigger start offset from bottom of viewport (default: '80%') */
  startOffset?: string;
  /** Scroll trigger end offset (default: '20%') */
  endOffset?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Scroll-coupled continuous mapping. Progress smoothly updates per scroll pixel without fixed time duration.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ words and container scroll progress $P \in [0, 1]$:
Word $k \in [0, N-1]$ activation threshold:
$$t_k = \frac{k}{N}, \quad w_k = \frac{1}{N}$$
Word reveal progress $p_k \in [0, 1]$:
$$p_k = \text{clamp}\left(\frac{P - t_k}{w_k}, 0, 1\right)$$
Word opacity and color:
$$\alpha_k = \alpha_{base} + p_k \cdot (\alpha_{active} - \alpha_{base})$$

## 5. Interaction Mechanics
Directly linked to user scroll position. Scrolling up reverses reveal state predictably.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Word Span Wrapping: Split text into word spans with inline styles.
2. Scroll Tracking: Calculate element bounding client rect relative to window inner height.
3. CSS Custom Properties: Assign `--word-progress` to dynamically tint text.
4. Performance: Passive scroll event listener with `requestAnimationFrame` debounce.

## 7. Modularity & File Organization
Decompose into `ScrollReveal.tsx` (<120 LoC), `useScrollReveal.ts` (<90 LoC), and `revealUtils.ts` (<50 LoC).
