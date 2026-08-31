# Text Type (Text Animations)

## 1. Overview & Visual Behavior
Text Type emulates realistic human typewriter mechanics with variable typing cadences, authentic pauses at punctuation marks, simulated backspace deletions, and blinking terminal cursor.

## 2. Props & Configuration Interface
```typescript
interface TextTypeProps {
  /** Array of phrases to type and erase sequentially */
  phrases: string[];
  /** Base typing speed in milliseconds per character (default: 60) */
  typingSpeed?: number;
  /** Base deleting speed in milliseconds per character (default: 30) */
  deletingSpeed?: number;
  /** Dwell pause after completing a phrase in milliseconds (default: 2000) */
  dwellTime?: number;
  /** Natural variance factor for human cadence [0..1] (default: 0.3) */
  variance?: number;
  /** Cursor symbol or blinking element (default: '|') */
  cursor?: string | React.ReactNode;
  /** Loop infinitely (default: true) */
  loop?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Typing cadence per character $i$: $\Delta t_i = \text{typingSpeed} \cdot (1 + \text{random}(-v, v))$. Punctuation marks (., !, ?) inject an extra $250\text{ms}$ pause.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Dynamic character delay calculation:
$$\Delta t = T_{base} \cdot (1 + (2r - 1) \cdot V) + T_{punct}$$
where $r \sim U(0, 1)$, $V$ is variance factor, and:
$$T_{punct} = \begin{cases} 250\text{ms} & \text{if char} \in \{\text{'.', '!', '?', ','}\} \\ 0 & \text{otherwise} \end{cases}$$
Cursor blink cycle:
$$B(t) = \begin{cases} 1 & \text{if } (t \bmod 1000\text{ms}) < 500\text{ms} \\ 0 & \text{otherwise} \end{cases}$$

## 5. Interaction Mechanics
Accessible live text container with `aria-live="polite"`. Respects user pauses or external trigger events.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. State Machine: States: `TYPING`, `DWELLING`, `DELETING`, `PAUSED`.
2. Recursive Timeout: Use `setTimeout` with calculated dynamic delay rather than static `setInterval`.
3. Substring Slice: Slices active string `currentPhrase.slice(0, charIndex)`.
4. Blinking Cursor: CSS animation with `steps(1)` opacity toggle to prevent sub-pixel blurring.

## 7. Modularity & File Organization
Decompose into `TextType.tsx` (<120 LoC), `useTypewriter.ts` (<110 LoC), and `typewriterStyles.ts` (<50 LoC).
