# Fade Content (Animations)

## 1. Overview & Visual Behavior
Fade Content provides threshold-based gradient edge fades, scroll masks, and viewport scroll reveals that smoothly transition content into visibility with directional alpha gradients.

## 2. Props & Configuration Interface
```typescript
interface FadeContentProps {
  /** Content to wrap with fade masks */
  children: React.ReactNode;
  /** Fade mask edges to apply (default: ['top', 'bottom']) */
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  /** Blur or gradient mask size in pixels (default: 40) */
  fadeSize?: number;
  /** Trigger element fade on scroll view entry (default: false) */
  viewportReveal?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Viewport reveals transition over $500	ext{ms}$ with `ease-out`. Scroll fade masks update per-pixel in real-time.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
CSS mask-image linear gradient construction for vertical edges:
$$\text{mask-image} = \text{linear-gradient}(\text{to bottom}, \text{transparent } 0, \text{black } H_{fade}\text{px}, \text{black } (H - H_{fade})\text{px}, \text{transparent } 100\%)$$
Scroll edge threshold logic:
$$\text{topFadeActive} = Y_{scroll} > 10\text{px}$$
$$\text{bottomFadeActive} = (Y_{max} - Y_{scroll}) > 10\text{px}$$

## 5. Interaction Mechanics
Gradient edge masks dynamically appear/disappear based on scroll position (hides top fade when at top of list).

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Mask Layers: Apply `-webkit-mask-image` and `mask-image` with linear gradient stops.
2. Scroll Event Tracking: Update active fade edges on scroll events via CSS classes.
3. IntersectionObserver: Trigger entrance fade when content enters viewport.
4. Tailwind Integration: Pure Tailwind utility classes with arbitrary values.

## 7. Modularity & File Organization
Decompose into `FadeContent.tsx` (<110 LoC) and `useScrollEdges.ts` (<70 LoC).
