# Warp Text (Text Animations)

## 1. Overview & Visual Behavior
Warp Text deforms and animates typography along dynamic cubic Bezier curves, parametric sine waves, or interactive vector paths using SVG `<textPath>` or Canvas 2D matrix warping with real-time curvature control.

## 2. Props & Configuration Interface
```typescript
interface WarpTextProps {
  /** Text content to warp */
  text: string;
  /** Warping geometry curve type */
  curveType?: 'arch' | 'wave' | 'circle' | 'flag' | 'bezier';
  /** Curvature amplitude in pixels or percentage (default: 50) */
  amplitude?: number;
  /** Wave frequency count across text length (default: 2) */
  frequency?: number;
  /** Speed of continuous wave animation (0 = static, default: 1.0) */
  speed?: number;
  /** SVG viewBox width (default: 600) */
  width?: number;
  /** SVG viewBox height (default: 200) */
  height?: number;
  /** Custom CSS classes */
  className?: string;
  /** Text fill color */
  fill?: string;
}
```

## 3. Animation Specifications & Timing
Continuous wave phase $\phi(t)$ oscillates with period $T = \frac{2\pi}{\omega \cdot \text{speed}}$. Interactive hover transitions interpolate curvature with spring duration $350\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Parametric curve definition $P(s) = (x(s), y(s))$ for normalized arc length $s \in [0, 1]$:
$$x(s) = s \cdot W$$
$$y(s) = \frac{H}{2} + A \cdot \sin(2\pi \cdot f \cdot s + \omega t)$$
For cubic Bezier path interpolation:
$$B(s) = (1-s)^3 P_0 + 3(1-s)^2 s P_1 + 3(1-s) s^2 P_2 + s^3 P_3$$
Local tangent angle $\theta(s)$ for letter orientation:
$$\theta(s) = \arctan\left(\frac{y'(s)}{x'(s)}\right) = \arctan(2\pi f A \cdot \cos(2\pi f s + \omega t) / W)$$

## 5. Interaction Mechanics
Mouse movement shifts control points $P_1, P_2$ dynamically, warping text toward cursor position.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG TextPath: Render `<path id="warp-curve" d="...">` and bind `<text><textPath href="#warp-curve">`.
2. Animation Loop: Update path `d` attribute string or CSS transform in `requestAnimationFrame`.
3. Font Metrics: Calculate `textLength` and `startOffset` for precise centering.
4. Optimization: Use vector path caching to minimize DOM string parsing overhead.

## 7. Modularity & File Organization
Decompose into `WarpText.tsx` (<130 LoC), `bezierCurves.ts` (<90 LoC), and `useWarpAnimation.ts` (<80 LoC).
