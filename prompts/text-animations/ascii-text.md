# ASCII Text (Text Animations)

## 1. Overview & Visual Behavior
ASCII Text rasterizes text or vector shapes into an animated monospace ASCII character density matrix, mapping pixel luminance to character glyph palettes in real-time.

## 2. Props & Configuration Interface
```typescript
interface AsciiTextProps {
  /** Text to render in ASCII art */
  text: string;
  /** ASCII character density palette (default: ' .:-=+*#%@') */
  charset?: string;
  /** Font size in pixels (default: 12) */
  fontSize?: number;
  /** Monospace font family (default: 'monospace') */
  fontFamily?: string;
  /** Color of ASCII characters */
  color?: string;
  /** Animate wave or glitch distortions (default: true) */
  animated?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
ASCII frame updates at 30 FPS. Wave distortion phase progresses continuously with period $T = 2.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For offscreen canvas pixel $(x, y)$ with luminance $Y$:
$$Y(x, y) = 0.299R + 0.587G + 0.114B$$
Wave perturbation:
$$Y'(x, y, t) = Y(x, y) \cdot (1 + 0.3 \cdot \sin(0.1x + 0.1y + 2\pi t / T))$$
ASCII character index:
$$idx = \left\lfloor \frac{Y'(x, y, t)}{255} \cdot (|\text{charset}| - 1) \right\rfloor$$
$$\text{glyph} = \text{charset}[idx]$$

## 5. Interaction Mechanics
Mouse cursor creates ripple distortions in ASCII luminance field.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Offscreen Render: Draw source text onto low-resolution offscreen canvas (e.g. $80 \times 24$ pixels).
2. Luminance Scan: Read `ctx.getImageData()` pixels and map luminance values to ASCII characters.
3. Matrix Output: Format character lines into `<pre>` tag or render via monospace canvas text.
4. Animation Loop: Apply wave math to luminance values before character lookup.

## 7. Modularity & File Organization
Organized into `AsciiText.tsx` (<130 LoC), `asciiConverter.ts` (<100 LoC), and `asciiCharsets.ts` (<50 LoC).
