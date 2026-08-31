# Curved Input (Components)

## 1. Overview & Visual Behavior
Curved Input renders form input fields with dynamic SVG curved borders, floating organic labels, and animated underline waveforms that ripple during typing.

## 2. Props & Configuration Interface
```typescript
interface CurvedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label: string;
  /** Error message string */
  error?: string;
  /** Wave animation amplitude in pixels on focus (default: 4) */
  waveAmplitude?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Focus transition unfolds over $250\text{ms}$. Typing ripples create a $300\text{ms}$ sine wave pulse along bottom border.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Bottom curved border SVG path $y(x, t)$ for width $W$:
$$y(x, t) = H + A \cdot \sin\left(\frac{2\pi x}{W} \cdot f + \omega t\right) \cdot e^{-t / \tau}$$
Floating label translation on focus/input:
$$y_{label} = -24\text{px}, \quad \text{scale}_{label} = 0.85$$

## 5. Interaction Mechanics
Focus activates illuminated border glow and floats label. Typing triggers harmonic wave pulses.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Custom SVG Border: Render `<path>` element beneath `<input>`.
2. Wave Trigger: On `keydown`, start sine wave pulse in `requestAnimationFrame`.
3. Native Form Support: Full keyboard and accessibility compliance.
4. Tailwind Integration: Pure utility classes with SVG stroke styling.

## 7. Modularity & File Organization
Decompose into `CurvedInput.tsx` (<120 LoC) and `curvedBorderMath.ts` (<60 LoC).
