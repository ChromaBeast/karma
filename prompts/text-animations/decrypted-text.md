# Decrypted Text (Text Animations)

## 1. Overview & Visual Behavior
Decrypted Text simulates cyberpunk cryptographic decryption where characters rapidly scramble through randomized glyph sets, progressively revealing and locking into plaintext characters.

## 2. Props & Configuration Interface
```typescript
interface DecryptedTextProps {
  /** The plaintext string to decrypt and reveal */
  text: string;
  /** Speed of glyph change interval in milliseconds (default: 50) */
  speed?: number;
  /** Maximum number of scramble iterations per character (default: 10) */
  maxIterations?: number;
  /** Characters used during scrambling (default: '0123456789ABCDEF!@#$%^&*') */
  characters?: string;
  /** Decryption reveal direction (default: 'forward') */
  revealDirection?: 'forward' | 'backward' | 'center' | 'random';
  /** Trigger animation on hover or view entry (default: 'hover') */
  animateOn?: 'hover' | 'view';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Total decryption takes $600\text{ms}$ to $1200\text{ms}$. Scramble glyphs cycle at $50\text{ms}$ intervals with sequential locking every $40\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For character index $k$ in string of length $L$:
Reveal index mapping for direction 'forward':
$$r_k = k$$
Lock iteration count:
$$N_{lock, k} = \text{maxIterations} + k \cdot 2$$
Current glyph $C_k(i)$ at iteration step $i$:
$$C_k(i) = \begin{cases} \text{charset}[\text{randInt}(|\text{charset}|)] & \text{if } i < N_{lock, k} \\ \text{text}[k] & \text{if } i \ge N_{lock, k} \end{cases}$$

## 5. Interaction Mechanics
Triggers decryption on hover or scroll view entry. Accessible text is preserved for screen readers via `aria-label`.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Scramble Loop: Driven by `setInterval` or `requestAnimationFrame` with timestamp delta.
2. Character Array: Store state array of active characters and their lock statuses.
3. Monospace Alignment: Use `font-mono` or tabular figures to eliminate horizontal jitter.
4. Cleanup: Clear active timer handles on unmount or re-trigger.

## 7. Modularity & File Organization
Organized into `DecryptedText.tsx` (<120 LoC), `useDecryption.ts` (<100 LoC), and `decryptionCharsets.ts` (<50 LoC).
