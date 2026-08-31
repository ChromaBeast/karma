# Logo Loop (Animations)

## 1. Overview & Visual Behavior
Logo Loop renders an infinite, seamless horizontal marquee ticker for partner logos, tech stack icons, or sponsor badges with pause-on-hover and dynamic speed modulation.

## 2. Props & Configuration Interface
```typescript
interface LogoLoopProps {
  /** Array of logo image URLs or React components */
  logos: (string | React.ReactNode)[];
  /** Marquee translation speed in pixels/second (default: 60) */
  speed?: number;
  /** Direction of marquee movement (default: 'left') */
  direction?: 'left' | 'right';
  /** Pause animation when pointer hovers over track (default: true) */
  pauseOnHover?: boolean;
  /** Gap spacing between logos in pixels (default: 48) */
  gap?: number;
  /** Apply gradient fade masks to left/right container edges (default: true) */
  fadeEdges?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Infinite continuous loop with constant linear velocity $V = 60	ext{px/s}$. Smooth deceleration on hover over $300	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For track content width $W_{track}$ and speed $V$:
Offset position:
$$X(t) = (X_0 \pm V \cdot t) \bmod W_{track}$$
Edge opacity gradient mask:
$$\text{mask-image} = \text{linear-gradient}(\text{to right}, \text{transparent } 0, \text{black } 60\text{px}, \text{black } (W - 60)\text{px}, \text{transparent } 100\%)$$

## 5. Interaction Mechanics
Smoothly decelerates to a stop on pointer hover. Dragging allows manual scrubbing.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Track Duplication: Render two identical logo sequences side-by-side.
2. CSS Animation: `@keyframes logo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`.
3. Hover State: `animation-play-state: paused` on hover.
4. Edge Fade: CSS `mask-image` or absolute gradient overlay divs.

## 7. Modularity & File Organization
Decompose into `LogoLoop.tsx` (<120 LoC) and `logoLoopStyles.ts` (<60 LoC).
