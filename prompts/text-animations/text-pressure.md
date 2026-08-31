# Text Pressure (Text Animations)

## 1. Overview & Visual Behavior
Text Pressure dynamically alters variable font axes (weight `wght`, width `wdth`, optical size `opsz`, and slant `slnt`) based on cursor proximity, pointer velocity, or click compression.

## 2. Props & Configuration Interface
```typescript
interface TextPressureProps {
  /** Text content */
  text: string;
  /** Variable font family supporting wght/wdth axes */
  fontFamily?: string;
  /** Minimum and maximum font weight [min, max] (default: [100, 900]) */
  weightRange?: [number, number];
  /** Minimum and maximum font width [min, max] (default: [75, 125]) */
  widthRange?: [number, number];
  /** Cursor influence radius in pixels (default: 200) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Variable font axes interpolate per-frame at 60/120 FPS via critically damped spring ($16\text{ms}$ update).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For character $i$ at position $(x_i, y_i)$ and cursor $(x_c, y_c)$:
Euclidean distance:
$$d_i = \sqrt{(x_i - x_c)^2 + (y_i - y_c)^2}$$
Normalized proximity factor $P_i \in [0, 1]$:
$$P_i = \text{clamp}\left(1 - \frac{d_i}{R}, 0, 1\right)$$
Variable font weight calculation:
$$\text{wght}_i = W_{min} + P_i \cdot (W_{max} - W_{min})$$
$$\text{wdth}_i = Wd_{min} + P_i \cdot (Wd_{max} - Wd_{min})$$
CSS property: `font-variation-settings: 'wght' wght_i, 'wdth' wdth_i;`

## 5. Interaction Mechanics
Tracks cursor position over container. Compresses adjacent letters when mouse button is pressed.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Character Spans: Render each character in a separate `span` with cached bounding rectangle.
2. Font Variation Settings: Update `style.fontVariationSettings` per character inside RAF loop.
3. Variable Font Loader: Ensure variable font with `fvar` table is preloaded.
4. Performance: Batch DOM style updates to avoid layout reflows.

## 7. Modularity & File Organization
Organized into `TextPressure.tsx` (<130 LoC), `useFontPressure.ts` (<100 LoC), and `fontVariationUtils.ts` (<60 LoC).
