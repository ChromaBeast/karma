# Scroll Expand (Animations)

## 1. Overview & Visual Behavior
Scroll Expand animates card containers, image viewports, or video banners expanding from compact thumbnail pills to full-width expansive hero viewports as the user scrolls.

## 2. Props & Configuration Interface
```typescript
interface ScrollExpandProps {
  /** React children rendered inside expanding container */
  children: React.ReactNode;
  /** Initial width in pixels or percentage (default: '60%') */
  initialWidth?: string | number;
  /** Expanded target width (default: '100%') */
  targetWidth?: string | number;
  /** Initial border radius in pixels (default: 32) */
  initialBorderRadius?: number;
  /** Target expanded border radius (default: 0) */
  targetBorderRadius?: number;
  /** Scroll progress window [start, end] from 0 to 1 (default: [0.2, 0.8]) */
  scrollWindow?: [number, number];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous scroll-linked interpolation without fixed time durations. Spring smoothing parameter $\zeta = 0.9$ avoids jitter.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Container scroll progress $S \in [0, 1]$ mapped across window $[S_{start}, S_{end}]$:
$$p = \text{clamp}\left(\frac{S - S_{start}}{S_{end} - S_{start}}, 0, 1\right)$$
Curved expansion profile:
$$f(p) = 3p^2 - 2p^3 \quad (\text{smoothstep})$$
Dynamic properties:
$$W(p) = W_{init} + f(p) \cdot (W_{target} - W_{init})$$
$$R(p) = R_{init} + f(p) \cdot (R_{target} - R_{init})$$

## 5. Interaction Mechanics
Directly proportional to page scroll depth. Maintains sticky pin positioning during expansion phase.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Sticky Container: Outer wrapper with `h-[200vh]` and inner `sticky top-0 h-screen flex items-center justify-center`.
2. Scroll Metrics: Measure container offset via `element.getBoundingClientRect().top`.
3. Transform & Clip: Adjust width, scale, and border-radius using CSS variables.
4. Layout Isolation: Content inside uses fixed aspect ratios to prevent reflows.

## 7. Modularity & File Organization
Decompose into `ScrollExpand.tsx` (<120 LoC), `useScrollWindow.ts` (<90 LoC), and `expandStyles.ts` (<50 LoC).
