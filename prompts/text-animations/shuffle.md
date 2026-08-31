# Shuffle (Text Animations)

## 1. Overview & Visual Behavior
Shuffle generates dynamic random character permutation cascades where glyphs rapidly scramble through alphanumeric characters and symbols before sequentially locking into the final target string.

## 2. Props & Configuration Interface
```typescript
interface ShuffleProps {
  /** Target text to resolve to */
  text: string;
  /** Character set for scramble iterations (default: alphanumeric + symbols) */
  charset?: string;
  /** Total shuffle duration in milliseconds (default: 800) */
  duration?: number;
  /** Frame interval between glyph shuffles in milliseconds (default: 35) */
  interval?: number;
  /** Stagger delay across string length (default: true) */
  sequentialLock?: boolean;
  /** Trigger animation on hover (default: false) */
  triggerOnHover?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Total duration $T = 800\text{ms}$. Scramble iterations update glyphs every $35\text{ms}$. Character positions lock left-to-right from $t = 0.3T$ to $t = T$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For character index $k \in [0, N-1]$ in string of length $N$:
Lock timestamp:
$$t_{lock, k} = T_{start} + T_{total} \cdot \left(0.3 + 0.7 \cdot \frac{k}{N}\right)$$
Displayed glyph $G_k(t)$:
$$G_k(t) = \begin{cases} \text{charset}[\text{randInt}(|\text{charset}|)] & \text{if } t < t_{lock, k} \\ \text{text}[k] & \text{if } t \ge t_{lock, k} \end{cases}$$

## 5. Interaction Mechanics
Re-shuffles on cursor hover or on programmatic prop updates. Screen readers receive the static final text immediately via `aria-label`.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Scramble Engine: Single interval or `requestAnimationFrame` loop maintaining random glyph buffer array.
2. Progressive Resolution: Iterate indices and lock resolved characters in-place.
3. Charset Presets: Support matrix, hexadecimal, alphabetic, and symbolic glyph sets.
4. Zero Layout Shift: Monospace font styling or fixed character widths (`ch` units).

## 7. Modularity & File Organization
Organized into `Shuffle.tsx` (<120 LoC), `useShuffleScramble.ts` (<90 LoC), and `shuffleCharsets.ts` (<60 LoC).
