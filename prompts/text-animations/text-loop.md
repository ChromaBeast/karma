# Text Loop (Text Animations)

## 1. Overview & Visual Behavior
Text Loop renders an automated cyclical ticker that smoothly swaps words, phrases, or custom JSX nodes in a rhythmic cadence. Features zero layout shift via predictive bounding-box reservation, seamless vertical or horizontal sliding, pause-on-hover mechanics, and cubic-bezier easing.

## 2. Props & Configuration Interface
```typescript
interface TextLoopProps {
  /** Array of text strings or React elements to cycle through */
  items: (string | React.ReactNode)[];
  /** Dwell interval per item in milliseconds (default: 3000) */
  interval?: number;
  /** Transition duration in milliseconds (default: 450) */
  duration?: number;
  /** Sliding direction for transition (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Cubic bezier timing function (default: 'cubic-bezier(0.16, 1, 0.3, 1)') */
  easing?: string;
  /** Pause cycling when user pointer hovers over the element (default: true) */
  pauseOnHover?: boolean;
  /** CSS class name for outer container */
  className?: string;
  /** CSS class name for item wrapper */
  itemClassName?: string;
  /** Callback triggered on item transition with new active index */
  onIndexChange?: (index: number) => void;
}
```

## 3. Animation Specifications & Timing
Each cycle consists of an idle dwell duration $T_{dwell} = 3000\text{ms}$ followed by an active transition duration $T_{trans} = 450\text{ms}$. Easing follows quintic ease-out curve $C(t) = \text{cubic-bezier}(0.16, 1, 0.3, 1)$. Active incoming item enters from $+100\%$ along the motion vector to $0\%$, while outgoing item departs from $0\%$ to $-100\%$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
The normalized transition progress $\tau(t) = \text{clamp}\left(\frac{t - t_0}{T_{trans}}, 0, 1\right)$ is mapped through a quintic ease-out function:
$$f(\tau) = 1 - (1 - \tau)^5$$
For translation along coordinate axis $u \in \{x, y\}$ with offset distance $L$:
$$u_{in}(\tau) = L \cdot (1 - f(\tau))$$
$$u_{out}(\tau) = -L \cdot f(\tau)$$
Opacity crossfade functions:
$$\alpha_{in}(\tau) = f(\tau), \quad \alpha_{out}(\tau) = 1 - f(\tau)$$

## 5. Interaction Mechanics
Listens for `pointerenter` and `pointerleave` to toggle `isPaused` state. Supports `aria-live="polite"` and `aria-atomic="true"`. If `prefers-reduced-motion` is active, 3D translation is skipped in favor of a 150ms crossfade.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Container Setup: Inline-flex wrapper with `relative overflow-hidden` and dynamic height matching the largest child.
2. Slot Buffer: Maintain current index $i$ and next index $j = (i + 1) \% N$ in a dual-slot sliding buffer to minimize DOM nodes.
3. Web Animations API (WAAPI): Drive transitions via `element.animate()` with keyframes `translateY(100%) -> translateY(0%)`.
4. ResizeObserver: Auto-measure dimensions to eliminate layout shifts.

## 7. Modularity & File Organization
Organized into `TextLoop.tsx` (main orchestrator, <140 LoC), `useTextLoop.ts` (timer hook, <80 LoC), and `textLoopStyles.ts` (<50 LoC).
