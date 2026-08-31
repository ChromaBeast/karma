# Pixel Trail (Animations)

## 1. Overview & Visual Behavior
Pixel Trail leaves a retro 8-bit grid trail of illuminated square pixels behind the cursor that decay with glowing colors, opacity fading, and random dispersion.

## 2. Props & Configuration Interface
```typescript
interface PixelTrailProps {
  /** Size of each square pixel in pixels (default: 20) */
  pixelSize?: number;
  /** Decay duration of illuminated pixels in milliseconds (default: 600) */
  fadeDuration?: number;
  /** Pixel color or array of colors */
  color?: string | string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pixels illuminate on pointer contact ($<16	ext{ms}$) and fade out exponentially over $600	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For pixel grid cell $(i, j)$ at time $t$ since illumination $t_{hit}$:
$$\Delta t = t - t_{hit}$$
Opacity decay:
$$\alpha_{i,j}(t) = \text{clamp}\left(1 - \frac{\Delta t}{T_{fade}}, 0, 1\right)^2$$
Pixel scale shrinkage:
$$S_{i,j}(t) = \text{clamp}\left(1 - \frac{\Delta t}{T_{fade}} \cdot 0.3, 0, 1\right)$$

## 5. Interaction Mechanics
Sweeping cursor over canvas illuminates pixel grid cells along pointer path.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Grid: Single canvas tracking active illuminated cell coordinates and timestamps.
2. Efficient Map: Store active cells in `Map<string, number>` keying `\"${i},${j}\" -> timestamp`.
3. Batch Drawing: Draw active square paths with `ctx.fillRect()`.
4. Sleeping Engine: Pause animation loop when `activeCells.size === 0`.

## 7. Modularity & File Organization
Organized into `PixelTrail.tsx` (<120 LoC), `PixelTrailEngine.ts` (<110 LoC), and `trailTypes.ts` (<40 LoC).
