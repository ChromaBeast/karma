# Curved Loop (Text Animations)

## 1. Overview & Visual Behavior
Curved Loop moves continuous text strings along complex sinusoidal curves, infinity symbols, or custom SVG spline paths in an endless flowing marquee ribbon.

## 2. Props & Configuration Interface
```typescript
interface CurvedLoopProps {
  /** Text string to repeat along curve */
  text: string;
  /** SVG path d string defining the curve */
  pathD?: string;
  /** Animation speed in pixels per second (default: 50) */
  speed?: number;
  /** Repeat count of text string along curve (default: 4) */
  repeatCount?: number;
  /** Invert motion direction (default: false) */
  reverse?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous marquee offset progresses infinitely. Speed $V = 50\text{px/s}$ translates `startOffset` across SVG path length $L$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For total path length $L = \text{path.getTotalLength()}$:
Normalized path offset:
$$\text{startOffset}(t) = (t \cdot V) \bmod L$$
Local coordinates $(x(s), y(s))$ and normal vector $\vec{n}(s)$ at arc length $s$:
$$\vec{t}(s) = \frac{d\vec{r}}{ds}, \quad \vec{n}(s) = (-t_y(s), t_x(s))$$

## 5. Interaction Mechanics
Pause or accelerate loop speed on hover. Dragging scrubs offset forward or backward.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG textPath: Bind `<textPath href="#curved-path" startOffset="...">`.
2. Offset Loop: Update `startOffset` attribute in `requestAnimationFrame` loop.
3. String Concatenation: Repeat string with bullet separators to cover $2 \times L$.
4. Path Cache: Pre-measure path length once on mount and window resize.

## 7. Modularity & File Organization
Decompose into `CurvedLoop.tsx` (<120 LoC), `useCurvedPath.ts` (<80 LoC), and `curvePresets.ts` (<60 LoC).
