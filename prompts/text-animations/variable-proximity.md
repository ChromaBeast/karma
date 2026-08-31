# Variable Proximity (Text Animations)

## 1. Overview & Visual Behavior
Variable Proximity dynamically modulates variable font weight, optical size, slant, and letter spacing based on Euclidean distance to the mouse pointer.

## 2. Props & Configuration Interface
```typescript
interface VariableProximityProps {
  /** Text content */
  text: string;
  /** Target variable font family */
  fontFamily?: string;
  /** Radius of pointer influence in pixels (default: 180) */
  radius?: number;
  /** Min and max font weight range (default: [200, 800]) */
  weightRange?: [number, number];
  /** Min and max slant range in degrees (default: [-10, 10]) */
  slantRange?: [number, number];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Variable font axes update smoothly at 60/120 FPS with zero noticeable frame lag.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For character $k$ at center $(x_k, y_k)$ and pointer $(x_c, y_c)$:
$$d_k = \sqrt{(x_k - x_c)^2 + (y_k - y_c)^2}$$
Normalized proximity factor:
$$p_k = \max\left(0, 1 - \frac{d_k}{R}\right)$$
Gaussian falloff alternative:
$$p_k = \exp\left(-\frac{d_k^2}{2\sigma^2}\right)$$
Font variation settings:
$$\text{wght}_k = W_{min} + p_k \cdot (W_{max} - W_{min})$$
$$\text{slnt}_k = S_{min} + p_k \cdot (S_{max} - S_{min})$$

## 5. Interaction Mechanics
Mouse hover creates dynamic wave of typographic expansion and weight modulation.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Character Spans: Wrap each character in inline span and pre-calculate bounding boxes.
2. Pointer Coordinates: Track container mouse coordinates in RAF loop.
3. Font Variations: Write `font-variation-settings` directly to character style.
4. Debounce Resize: Re-measure character bounding boxes on window resize.

## 7. Modularity & File Organization
Decompose into `VariableProximity.tsx` (<120 LoC), `useVariableProximity.ts` (<100 LoC), and `fontProximityMath.ts` (<60 LoC).
