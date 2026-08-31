# Dot Grid (Backgrounds)

## 1. Overview & Visual Behavior
Dot Grid renders an interactive planar 2D matrix of dots that illuminate, scale, and displace dynamically as the mouse moves across.

## 2. Props & Configuration Interface
```typescript
interface DotGridProps {
  /** Dot spacing in pixels (default: 24) */
  spacing?: number;
  /** Base dot radius in pixels (default: 1.5) */
  baseRadius?: number;
  /** Max illuminated dot radius in pixels (default: 4) */
  maxRadius?: number;
  /** Active hover color */
  activeColor?: string;
  /** Base inactive color */
  baseColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Dot scaling responds at 60/120 FPS with zero latency. Decay takes $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For dot at $(x_k, y_k)$ and mouse $(x_c, y_c)$:
Distance $d_k = \sqrt{(x_k - x_c)^2 + (y_k - y_c)^2}$.
Dot radius:
$$R_k = R_{base} + (R_{max} - R_{base}) \cdot \text{clamp}\left(1 - \frac{d_k}{R_{infl}}, 0, 1\right)^2$$
Color interpolation:
$$C_k = \text{lerpColor}(C_{base}, C_{active}, (R_k - R_{base}) / (R_{max} - R_{base}))$$

## 5. Interaction Mechanics
Mouse movement lights up an organic radial ripple of enlarged glowing dots.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Batch Render: Single canvas layer iterating visible grid coordinates.
2. Bounding Box Optimization: Only calculate distances for dots within mouse bounding square.
3. Device Pixel Ratio: Scaled for high-DPI displays.
4. Zero Dependencies: Pure Canvas 2D implementation.

## 7. Modularity & File Organization
Decompose into `DotGrid.tsx` (<110 LoC) and `dotGridMath.ts` (<50 LoC).
