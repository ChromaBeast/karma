# True Focus (Text Animations)

## 1. Overview & Visual Behavior
True Focus creates a camera depth-of-field focus effect where active or hovered words/phrases remain sharp and brightly illuminated while surrounding text falls into a soft Gaussian blur.

## 2. Props & Configuration Interface
```typescript
interface TrueFocusProps {
  /** Array of words or sentence to display */
  sentence: string;
  /** Blur radius for out-of-focus words in pixels (default: 5) */
  blurAmount?: number;
  /** Border color of the animated focus frame (default: '#00df8f') */
  borderColor?: string;
  /** Glow color behind focused word (default: 'rgba(0, 223, 143, 0.3)') */
  glowColor?: string;
  /** Transition duration between focus targets in seconds (default: 0.5) */
  animationDuration?: number;
  /** Pause duration on each word in auto mode (default: 2000ms) */
  pauseBetweenAnimations?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Focus box transitions between target words over $500\text{ms}$ with `cubic-bezier(0.25, 1, 0.5, 1)`. Non-focused words blur over $350\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Focus bounding box interpolation $(x(t), y(t), w(t), h(t))$:
$$x(t) = \text{lerp}(x_0, x_1, f(\tau)), \quad w(t) = \text{lerp}(w_0, w_1, f(\tau))$$
where $f(\tau) = 1 - (1 - \tau)^3$.
Word blur and opacity functions:
$$\text{filter: blur}(\text{if focus then } 0\text{px else } B\text{px})$$
$$\text{opacity: if focus then } 1.0\text{ else } 0.45$$

## 5. Interaction Mechanics
Hovering over any word snaps focus box directly to that word. Auto-cycles sequentially when idle.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Word Measurements: Measure DOM rects of each word span via `getBoundingClientRect()`.
2. Absolute Focus Box: Render floating border frame with SVG corners and `transition: transform, width, height`.
3. Filter Transitions: Apply `filter: blur(...)` to sibling word spans via CSS classes.
4. Auto Cycle: Interval switches `focusedIndex = (focusedIndex + 1) % words.length` when pointer is not hovering.

## 7. Modularity & File Organization
Decompose into `TrueFocus.tsx` (<130 LoC), `FocusBox.tsx` (<80 LoC), and `useFocusTracker.ts` (<80 LoC).
