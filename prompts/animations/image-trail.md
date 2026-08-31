# Image Trail (Animations)

## 1. Overview & Visual Behavior
Image Trail spawns an interactive sequence of layered photographs or artwork cards trailing behind cursor motion with randomized rotations, elevation shadows, and fade decays.

## 2. Props & Configuration Interface
```typescript
interface ImageTrailProps {
  /** Array of image URLs to cycle through trail */
  images: string[];
  /** Pointer movement distance in pixels required to spawn next image (default: 60) */
  distanceThreshold?: number;
  /** Maximum number of simultaneous active trail images (default: 6) */
  maxImages?: number;
  /** Image display lifetime before fade out in milliseconds (default: 800) */
  lifetime?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Each spawned image card mounts with scale spring ($150	ext{ms}$) and fades out after $800	ext{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Spawn condition when pointer moves from $\vec{p}_{last}$ to $\vec{p}_{now}$:
$$\|\vec{p}_{now} - \vec{p}_{last}\| \ge D_{threshold}$$
Spawned image card $k$:
$$\text{position} = \vec{p}_{now}, \quad \theta_k = \text{rand}(-12^\circ, 12^\circ)$$
Opacity decay over time $t$:
$$\alpha_k(t) = \text{clamp}\left(1 - \frac{t - t_{spawn, k}}{T_{life}}, 0, 1\right)$$

## 5. Interaction Mechanics
Rapid mouse movement paints a vivid cascade of stacked imagery across the screen.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Image Pool Buffer: Fixed-size ring array of DOM image elements.
2. Distance Tracker: Track Euclidean distance between successive pointer events.
3. WAAPI Animations: Scale from $0.8 \to 1.0$ on spawn, fade to opacity $0$ before recycling.
4. Memory Management: Image objects reused in-place without DOM insertions/deletions.

## 7. Modularity & File Organization
Organized into `ImageTrail.tsx` (<120 LoC), `useImageSpawner.ts` (<100 LoC), and `trailMath.ts` (<50 LoC).
