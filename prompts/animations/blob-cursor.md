# Blob Cursor (Animations)

## 1. Overview & Visual Behavior
Blob Cursor renders an organic deformable jelly blob that follows the pointer, stretching along its velocity vector and bouncing back with elastic gelatin spring physics.

## 2. Props & Configuration Interface
```typescript
interface BlobCursorProps {
  /** Base blob radius in pixels (default: 25) */
  radius?: number;
  /** Blob fill color */
  fillColor?: string;
  /** Spring tension constant k (default: 0.15) */
  tension?: number;
  /** Velocity damping (default: 0.85) */
  damping?: number;
  /** Max stretch distortion scale (default: 1.8) */
  maxStretch?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Physics simulation runs at 60/120 FPS. Jelly deformation oscillation period $T pprox 200	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Velocity vector $\vec{v} = (v_x, v_y) = (x(t) - x(t-1), \ y(t) - y(t-1))$.
Motion angle:
$$\theta = \arctan2(v_y, v_x)$$
Stretch and squash scales (volume preservation $S_x \cdot S_y \approx 1$):
$$S_x = 1 + \min\left(\frac{\|\vec{v}\|}{40}, \text{maxStretch} - 1\right)$$
$$S_y = \frac{1}{S_x}$$
Transform matrix:
$$\text{transform: translate3d}(x, y, 0) \text{ rotate}(\theta) \text{ scale}(S_x, S_y)$$

## 5. Interaction Mechanics
Blob stretches into aerodynamic teardrop during motion and wobbles like gelatin when stopping.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Spring Follower Hook: Spring integration updates position $(x, y)$ and velocity $\vec{v}$.
2. GPU Transform: Apply `rotate` and `scale` on single composite element.
3. Gooey SVG Filter: Optional subtle SVG filter for organic liquid blob edges.
4. Auto Sleep: Pause animation loop when velocity $\|\vec{v}\| < 0.01$.

## 7. Modularity & File Organization
Organized into `BlobCursor.tsx` (<110 LoC), `useBlobSpring.ts` (<90 LoC), and `blobStyles.ts` (<50 LoC).
