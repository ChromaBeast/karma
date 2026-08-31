# Counter (Components)

## 1. Overview & Visual Behavior
Counter renders an animated numeric odometer where individual digit columns slide vertically to reveal target numbers with authentic mechanical motion.

## 2. Props & Configuration Interface
```typescript
interface CounterProps {
  /** Target numeric value to display */
  value: number;
  /** Digit transition duration in milliseconds (default: 600) */
  duration?: number;
  /** Stagger delay between digit columns in milliseconds (default: 40) */
  stagger?: number;
  /** Text size / styling classes */
  fontSize?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Each digit wheel rotates over $600\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Stagger delay cascades from right to left.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For digit column $k$ displaying digit $d_k \in [0, 9]$:
Vertical translation:
$$y_k(t) = -d_k \cdot 100\% \cdot f(\tau_k)$$
where $f(\tau) = 1 - (1 - \tau)^4$.
Digit column stack contains strings ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].

## 5. Interaction Mechanics
Smoothly cascades and slides whenever `value` prop changes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Column Strips: Render separate vertical strip of numbers 0-9 for each digit position.
2. CSS `translateY`: Animate `--digit-offset` via WAAPI or Tailwind transition.
3. Container Mask: `overflow-hidden` height matching single digit font height (`1em`).
4. Monospace Alignment: `tabular-nums` ensures uniform digit spacing.

## 7. Modularity & File Organization
Decompose into `Counter.tsx` (<110 LoC), `DigitColumn.tsx` (<80 LoC), and `counterStyles.ts` (<40 LoC).
