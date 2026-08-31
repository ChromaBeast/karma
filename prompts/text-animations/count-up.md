# Count Up (Text Animations)

## 1. Overview & Visual Behavior
Count Up animates numeric values from start to target values using customizable easing curves, decimal precision, prefix/suffix labels, and localized number formatting.

## 2. Props & Configuration Interface
```typescript
interface CountUpProps {
  /** Target numeric end value */
  to: number;
  /** Starting numeric value (default: 0) */
  from?: number;
  /** Duration of counting animation in seconds (default: 2.0) */
  duration?: number;
  /** Number of decimal places to display (default: 0) */
  decimals?: number;
  /** Prefix string (e.g. '$', '+') */
  prefix?: string;
  /** Suffix string (e.g. '%', 'k', ' ATS') */
  suffix?: string;
  /** Easing function (default: 'easeOutExpo') */
  easing?: 'easeOutExpo' | 'easeOutQuad' | 'linear';
  /** Start counting automatically when visible in viewport (default: true) */
  startOnView?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback fired upon count completion */
  onComplete?: () => void;
}
```

## 3. Animation Specifications & Timing
Executes over duration $T = 2.0\text{s}$ using exponential ease-out curve $f(\tau) = 1 - 2^{-10\tau}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For normalized time $\tau = \frac{t - t_0}{T} \in [0, 1]$:
Exponential ease-out:
$$f(\tau) = \begin{cases} 1 & \text{if } \tau = 1 \\ 1 - 2^{-10\tau} & \text{otherwise} \end{cases}$$
Current animated value:
$$V(\tau) = \text{from} + f(\tau) \cdot (\text{to} - \text{from})$$
Formatted output string:
$$S(\tau) = \text{prefix} + \text{formatLocale}(V(\tau), \text{decimals}) + \text{suffix}$$

## 5. Interaction Mechanics
Scroll-triggered via IntersectionObserver. Re-animates smoothly when `to` prop changes.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Animation Driver: Driven by `requestAnimationFrame` with precise timestamp delta.
2. Number Formatting: Use `Intl.NumberFormat` for localized comma grouping and decimal separators.
3. Layout Stability: Apply `tabular-nums font-mono` to prevent width fluctuations during counting.
4. Reduced Motion: Jump directly to final number if `prefers-reduced-motion` is enabled.

## 7. Modularity & File Organization
Organized into `CountUp.tsx` (<110 LoC), `useCountUp.ts` (<90 LoC), and `numberFormatters.ts` (<50 LoC).
