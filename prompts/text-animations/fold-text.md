# Fold Text (Text Animations)

## 1. Overview & Visual Behavior
Fold Text creates an origami 3D accordion folding typography effect where characters or text lines fold and unfold along horizontal or vertical crease lines with realistic shading.

## 2. Props & Configuration Interface
```typescript
interface FoldTextProps {
  /** Text content to fold */
  text: string;
  /** Number of fold segments per line (default: 2) */
  folds?: number;
  /** Unfold progress from 0 (fully folded) to 1 (flat) */
  progress?: number;
  /** Trigger mode (default: 'scroll') */
  trigger?: 'hover' | 'scroll' | 'mount';
  /** Fold orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** Perspective depth in pixels (default: 800) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Unfolding transitions take $650\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Crease shadows fade synchronously from $0.7$ opacity to $0$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For fold segment $k \in [0, N-1]$ with fold angle $\theta_k$:
$$\theta_k(p) = (1 - p) \cdot (-1)^k \cdot \theta_{max}$$
where $\theta_{max} = 75^\circ$ and $p \in [0, 1]$ is progress.
Segment height compression:
$$h_{visible} = h_{original} \cdot \cos(\theta_k)$$
Crease shading gradient:
$$I_{shadow} = (1 - p) \cdot |\sin(\theta_k)| \cdot 0.65$$

## 5. Interaction Mechanics
Unfolds on hover or scroll progress. Accessible plain text is retained in DOM for indexing.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Slicing: Split text into top and bottom clip-paths `polygon(0 0, 100% 0, 100% 50%, 0 50%)`.
2. 3D Origin: Top half uses `transform-origin: bottom`, bottom half uses `transform-origin: top`.
3. Shading Overlays: Add dynamic linear gradient overlay to simulate ambient occlusion.
4. Composite Layer: Use `backface-visibility: hidden` to prevent rendering artifacts.

## 7. Modularity & File Organization
Organized into `FoldText.tsx` (<130 LoC), `FoldSegment.tsx` (<100 LoC), and `foldGeometry.ts` (<70 LoC).
