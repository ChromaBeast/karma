# Elastic Slider (Components)

## 1. Overview & Visual Behavior
Elastic Slider renders an interactive range input slider whose track and thumb bend elastically like a rubber band under pointer drag with authentic haptic spring snap.

## 2. Props & Configuration Interface
```typescript
interface ElasticSliderProps {
  /** Current numeric value */
  value: number;
  /** Min value (default: 0) */
  min?: number;
  /** Max value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Value change callback */
  onChange: (value: number) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Slider thumb tracks pointer at 60/120 FPS. Elastic track rebound spring settles within $250\text{ms}$ upon release.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Thumb coordinate $x_t \in [0, W]$:
$$x_t = \frac{\text{value} - \text{min}}{\text{max} - \text{min}} \cdot W$$
SVG Bezier Track Deflection curve $y(x)$ when pulled vertically by $\Delta y$:
$$B(s) = (1-s)^2 P_0 + 2(1-s)s P_1 + s^2 P_2$$
where $P_0 = (0, 0), \ P_1 = (x_t, \Delta y), \ P_2 = (W, 0)$.
Restoring spring force:
$$F_{spring} = -k \cdot \Delta y - c \cdot v_y$$

## 5. Interaction Mechanics
Dragging slider thumb pulls track vertically with elastic resistance. Snaps back to straight line on release.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Slider Track: Render `<path d=\"M 0 0 Q x_t dy W 0\">` dynamically.
2. Pointer Drag Physics: Capture pointer move deltas along X and Y axes.
3. Spring Solver: Rebound $\Delta y \to 0$ via damped harmonic oscillator.
4. Accessible Range: Full ARIA `role=\"slider\"` with keyboard arrow support.

## 7. Modularity & File Organization
Organized into `ElasticSlider.tsx` (<120 LoC), `useElasticTrack.ts` (<100 LoC), and `sliderMath.ts` (<50 LoC).
