# Stroke Text (Text Animations)

## 1. Overview & Visual Behavior
Stroke Text renders hollow outlined typography with animated SVG stroke drawing paths (`stroke-dashoffset`), glowing neon vector contours, dynamic gradient fills, and synchronized fill-in transitions.

## 2. Props & Configuration Interface
```typescript
interface StrokeTextProps {
  /** Text to render with animated stroke outlines */
  text: string;
  /** Stroke outline color */
  strokeColor?: string;
  /** Stroke width in pixels (default: 2) */
  strokeWidth?: number;
  /** Delay before drawing begins in milliseconds (default: 200) */
  delay?: number;
  /** Duration of path stroke draw in milliseconds (default: 1800) */
  drawDuration?: number;
  /** Duration of subsequent fill-in fade in milliseconds (default: 600) */
  fillDuration?: number;
  /** Fill color revealed after stroke completion */
  fillColor?: string;
  /** Glow blur radius in pixels (0 for sharp outline, default: 0) */
  glowRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Stroke drawing phase takes $T_{stroke} = 1800\text{ms}$ with `cubic-bezier(0.65, 0, 0.35, 1)`, followed by fill fade-in over $T_{fill} = 600\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For an SVG path segment with total path length $L$:
$$\text{stroke-dasharray} = L$$
$$\text{stroke-dashoffset}(\tau) = L \cdot (1 - f(\tau))$$
where $f(\tau) = \tau^2 (3 - 2\tau)$ (Hermite smoothstep).
Fill opacity ramp:
$$\alpha_{fill}(t) = \begin{cases} 0 & \text{if } t < T_{stroke} \\ \frac{t - T_{stroke}}{T_{fill}} & \text{if } T_{stroke} \le t \le T_{stroke} + T_{fill} \\ 1 & \text{if } t > T_{stroke} + T_{fill} \end{cases}$$

## 5. Interaction Mechanics
Replays stroke drawing on viewport intersection (scroll trigger) or cursor hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Typography: Render text glyphs as `<text>` with `fill: transparent; stroke: var(--stroke-color)`.
2. Path Measurement: Compute SVG path length using `path.getTotalLength()`.
3. Keyframe Animation: Animate `stroke-dashoffset` from $L$ to $0$ using WAAPI or CSS keyframes.
4. Glow Layer: Add duplicate `<text>` layer with `filter: drop-shadow(0 0 Xpx var(--stroke-color))`.

## 7. Modularity & File Organization
Organized into `StrokeText.tsx` (<120 LoC), `useStrokeDraw.ts` (<80 LoC), and `strokeStyles.ts` (<50 LoC).
