# Fuzzy Text (Text Animations)

## 1. Overview & Visual Behavior
Fuzzy Text simulates analog CRT static, fuzzy neon vibration, and chromatic dispersion using canvas noise displacement maps and particle jitter.

## 2. Props & Configuration Interface
```typescript
interface FuzzyTextProps {
  /** Text content */
  text: string;
  /** Noise jitter intensity in pixels (default: 3) */
  fuzziness?: number;
  /** Font size in pixels (default: 64) */
  fontSize?: number;
  /** Font family (default: 'sans-serif') */
  fontFamily?: string;
  /** Text color (default: '#ffffff') */
  color?: string;
  /** Enable chromatic RGB channel splitting (default: true) */
  chromaticAberration?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Noise field re-evaluates at 30/60 FPS with stochastic displacement $\delta \sim N(0, \sigma^2)$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Displacement vector for pixel coordinate $(x, y)$:
$$\Delta x = \text{fuzziness} \cdot (2 \cdot \text{noise}(x, y, t) - 1)$$
$$\Delta y = \text{fuzziness} \cdot (2 \cdot \text{noise}(x + 100, y + 100, t) - 1)$$
Chromatic dispersion:
$$R(x, y) = I(x + \Delta x + \delta_r, y + \Delta y)$$
$$G(x, y) = I(x + \Delta x, y + \Delta y)$$
$$B(x, y) = I(x + \Delta x - \delta_b, y + \Delta y)$$

## 5. Interaction Mechanics
Fuzziness increases dramatically when pointer approaches or hovers over text.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Offscreen Canvas: Draw sharp text on offscreen 2D canvas buffer.
2. Pixel Manipulation: Iterate `ImageData.data` buffer and apply stochastic displacement to RGB channels.
3. Blit: Draw modified pixel buffer to main canvas using `ctx.putImageData()`.
4. Throttle: Limit render tick to 30 FPS for authentic retro CRT feel.

## 7. Modularity & File Organization
Organized into `FuzzyText.tsx` (<120 LoC), `noiseEngine.ts` (<100 LoC), and `fuzzyCanvas.ts` (<80 LoC).
