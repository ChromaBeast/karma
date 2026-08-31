# Shiny Text (Text Animations)

## 1. Overview & Visual Behavior
Shiny Text sweeps a luminous metallic or holographic reflective light beam across typography using CSS background gradient masks, linear keyframe translation, and dynamic shine speed.

## 2. Props & Configuration Interface
```typescript
interface ShinyTextProps {
  /** Text content */
  text: string;
  /** Base text color */
  baseColor?: string;
  /** Highlight sheen color (default: '#ffffff') */
  shineColor?: string;
  /** Duration of shine sweep in seconds (default: 3s) */
  speed?: number;
  /** Width of the shine beam in percentage (default: 35%) */
  shineWidth?: number;
  /** Angle of shine beam in degrees (default: 120deg) */
  angle?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous shine beam traverses across text with period $T = 3.0\text{s}$ using `linear` or `ease-in-out` timing curve.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
CSS linear gradient definition:
$$\text{background} = \text{linear-gradient}(\theta\text{deg}, C_{base} \ 0\%, C_{base} \ (p - W/2)\%, C_{shine} \ p\%, C_{base} \ (p + W/2)\%, C_{base} \ 100\%)$$
where $p(t) = (t \bmod T) / T \cdot 200\% - 50\%$ and $W$ is sheen width.
CSS background-size:
$$\text{background-size: } 250\% \ 100\%$$
$$\text{background-position: } x(t) = 100\% \to -100\%$$

## 5. Interaction Mechanics
Speed accelerates or triggers an instant sheen sweep on cursor hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Text Clipping: Apply `background-clip: text; -webkit-background-clip: text; color: transparent`.
2. Hardware Acceleration: CSS `@keyframes shine` modifying `background-position` with `transform: translateZ(0)`.
3. Color Interpolation: Build multi-stop linear gradient using Tailwind or inline CSS variables.
4. Fallback: Renders solid text color if `background-clip: text` is not supported.

## 7. Modularity & File Organization
Decompose into `ShinyText.tsx` (<110 LoC) and `shinyStyles.ts` (<60 LoC).
