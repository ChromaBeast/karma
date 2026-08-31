# Glow Cursor (Animations)

## 1. Overview & Visual Behavior
Glow Cursor renders an interactive radial luminance halo that smoothly trails the pointer, casting dynamic ambient lighting, backdrop blur, and specular highlights on hovered elements.

## 2. Props & Configuration Interface
```typescript
interface GlowCursorProps {
  /** Radius of glow circle in pixels (default: 300) */
  radius?: number;
  /** Primary glow color (default: 'rgba(99, 102, 241, 0.15)') */
  color?: string;
  /** Lag smoothing interpolation factor [0..1] (default: 0.15) */
  smoothing?: number;
  /** CSS mix-blend-mode (default: 'screen') */
  blendMode?: 'screen' | 'lighten' | 'overlay' | 'plus-lighter';
  /** Blur filter intensity in pixels (default: 40) */
  blur?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous pointer trailing with exponential low-pass filter ($	au pprox 16	ext{ms}$). Scale pulsing on click has $250	ext{ms}$ elastic response.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer coordinate smoothing via exponential lerp:
$$x(t) = x(t-1) + \alpha \cdot (x_{pointer} - x(t-1))$$
$$y(t) = y(t-1) + \alpha \cdot (y_{pointer} - y(t-1))$$
Radial luminance field:
$$I(r) = I_0 \cdot \exp\left(-\frac{r^2}{2\sigma^2}\right)$$
where $r = \sqrt{(x - x(t))^2 + (y - y(t))^2}$ and $\sigma = \text{radius} / 3$.

## 5. Interaction Mechanics
Tracks pointer globally across window. Smoothly contracts radius on pointer down ($R 	o 0.75 R$) and expands on element hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Fixed Overlay: Render fixed full-screen layer with `pointer-events: none; z-index: 50`.
2. Hardware Acceleration: Apply `transform: translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)`.
3. CSS Custom Properties: Direct update of `--x` and `--y` on RAF loop.
4. Mobile Disable: Automatically deactivates on touch screens via `@media (pointer: coarse)`.

## 7. Modularity & File Organization
Organized into `GlowCursor.tsx` (<110 LoC), `usePointerLerp.ts` (<80 LoC), and `glowStyles.ts` (<50 LoC).
