# Scrambled Text (Text Animations)

## 1. Overview & Visual Behavior
Scrambled Text creates an interactive hacker text decipher effect that scrambles character glyphs upon hover or click before restoring the original string with staggered resolve.

## 2. Props & Configuration Interface
```typescript
interface ScrambledTextProps {
  /** Original text string */
  text: string;
  /** Character pool used for scrambling */
  scrambleChars?: string;
  /** Delay before scrambling settles in milliseconds (default: 600) */
  duration?: number;
  /** Scramble change speed in milliseconds (default: 40) */
  speed?: number;
  /** Trigger mode (default: 'hover') */
  trigger?: 'hover' | 'click' | 'auto';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Scramble animation runs for $600\text{ms}$ total with character substitutions every $40\text{ms}$. Resolves progressively over final $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For index $i$ in string:
Resolution progress $\tau(t) = \frac{t - t_0}{T}$:
$$\text{isResolved}(i, t) = \tau(t) > \left(\frac{i}{N}\right)^{1.2}$$
$$\text{char}_i(t) = \begin{cases} \text{text}[i] & \text{if isResolved}(i, t) \\ \text{scrambleChars}[\text{randInt}(M)] & \text{otherwise} \end{cases}$$

## 5. Interaction Mechanics
Hovering triggers instant scramble burst. Supports keyboard focus trigger.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. State Hook: Manage active text state string.
2. RAF Timer: Update scrambler state using timestamp delta logic.
3. Preserved Spacing: Keep whitespace and punctuation stable during scramble.
4. Accessibility: Maintain original text in hidden ARIA node for screen reader clarity.

## 7. Modularity & File Organization
Decompose into `ScrambledText.tsx` (<110 LoC) and `useScrambleEffect.ts` (<90 LoC).
