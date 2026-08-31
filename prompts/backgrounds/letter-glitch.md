# Letter Glitch (Backgrounds)

## 1. Overview & Visual Behavior
Letter Glitch fills the entire background with a dynamic matrix grid of animated ASCII characters and hexadecimal glyphs that glitch and scramble.

## 2. Props & Configuration Interface
```typescript
interface LetterGlitchProps {
  /** Glyph character pool (default: '0123456789ABCDEF$#@%&*') */
  characters?: string;
  /** Grid font size in pixels (default: 14) */
  fontSize?: number;
  /** Glitch update speed in milliseconds (default: 50) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Glyphs scramble at $50\text{ms}$ intervals with sporadic column glitch cascades.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For grid cell $(i, j)$ at step $t$:
Glyph selection:
$$G_{i,j}(t) = \begin{cases} \text{charset}[\text{randInt}(N)] & \text{if rand}() < P_{glitch} \\ G_{i,j}(t-1) & \text{otherwise} \end{cases}$$
Pointer proximity luminance:
$$\alpha_{i,j} = \alpha_{base} + \alpha_{boost} \cdot \exp\left(-\frac{d_{i,j}^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Hovering mouse illuminates adjacent glyphs in vibrant neon colors.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Monospace Matrix: Draw character grid via `ctx.fillText()`.
2. Glyph State Buffer: `Uint16Array` storing character indices.
3. Proximity Glow: Draw cursor spotlight behind active characters.
4. Responsive Resizing: Recomputes row and column counts on window resize.

## 7. Modularity & File Organization
Decompose into `LetterGlitch.tsx` (<120 LoC), `GlitchEngine.ts` (<120 LoC), and `glitchTypes.ts` (<40 LoC).
