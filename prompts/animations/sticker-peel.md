# Sticker Peel (Animations)

## 1. Overview & Visual Behavior
Sticker Peel creates an interactive skeuomorphic peel-back animation where UI badges or stickers peel away from corners with realistic 3D curl, back-face graphics, and cast drop-shadows.

## 2. Props & Configuration Interface
```typescript
interface StickerPeelProps {
  /** Front sticker graphic / content */
  children: React.ReactNode;
  /** Back-face graphic / peel color */
  backfaceContent?: React.ReactNode;
  /** Peel corner origin (default: 'bottom-right') */
  peelCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Maximum peel depth [0..1] (default: 0.7) */
  maxPeel?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Peel transitions over $400	ext{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)` on hover or drag.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For peel fold line with angle $\theta$ and distance $d$:
Front face clip-path:
$$\text{clip-path: polygon}(... \text{vertices on unpeeled side of fold line})$$
Back face rotation matrix:
$$\text{transform: translate}(x_{fold}, y_{fold}) \text{ rotate}(2\theta) \text{ scaleX}(-1)$$
Shadow under peeled curl:
$$\text{box-shadow}: d \cos(\theta)\text{px } d \sin(\theta)\text{px } 12\text{px rgba}(0, 0, 0, 0.4)$$

## 5. Interaction Mechanics
Dragging or hovering over corner peels sticker smoothly with pointer tracking.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Face Layers: Front graphic layer and mirrored back-face layer.
2. Dynamic Clip Paths: SVG or CSS `polygon()` clip path aligned to fold axis.
3. Drop Shadow Filter: Dynamic gradient shadow rendered along peel fold line.
4. Motion Safety: Disables peel curl on touch if requested.

## 7. Modularity & File Organization
Decompose into `StickerPeel.tsx` (<130 LoC), `usePeelPhysics.ts` (<90 LoC), and `peelGeometry.ts` (<60 LoC).
