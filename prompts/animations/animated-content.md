# Animated Content (Animations)

## 1. Overview & Visual Behavior
Animated Content provides a smooth container wrapper that animates content mount/unmount and dynamically animates container height/width transitions during child swaps without layout pop.

## 2. Props & Configuration Interface
```typescript
interface AnimatedContentProps {
  /** Child content to animate */
  children: React.ReactNode;
  /** Unique key identifying active child state */
  contentKey: string | number;
  /** Transition duration in milliseconds (default: 300) */
  duration?: number;
  /** Transition animation preset (default: 'fade-slide') */
  variant?: 'fade' | 'fade-slide' | 'scale' | 'flip';
  /** Animate wrapper container height on child dimension changes (default: true) */
  animateHeight?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Transitions execute over $300	ext{ms}$ with `cubic-bezier(0.2, 0, 0, 1)`. Height adjustment transitions in parallel over $350	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Normalized transition time $\tau = \frac{t - t_0}{T}$:
$$f(\tau) = 1 - (1 - \tau)^3 \quad (\text{cubic ease-out})$$
Outgoing content:
$$\alpha_{out}(\tau) = 1 - \tau, \quad y_{out}(\tau) = -20 \cdot \tau \text{ px}$$
Incoming content:
$$\alpha_{in}(\tau) = \tau, \quad y_{in}(\tau) = 20 \cdot (1 - \tau) \text{ px}$$
Container height interpolation:
$$H(t) = H_{prev} + f(\tau) \cdot (H_{next} - H_{prev})$$

## 5. Interaction Mechanics
Maintains seamless layout continuity during dynamic tab switching, accordions, or multi-step wizard forms.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. ResizeObserver: Measure `scrollHeight` of active content container.
2. WAAPI / CSS Transitions: Animate `height` and child `transform` simultaneously.
3. Overflow Management: Set `overflow: hidden` on wrapper during transition phase.
4. Accessible Transitions: Maintain focus state across content swaps.

## 7. Modularity & File Organization
Organized into `AnimatedContent.tsx` (<120 LoC), `useAutoHeight.ts` (<80 LoC), and `transitionVariants.ts` (<60 LoC).
