# Meta Balls (Animations)

## 1. Overview & Visual Behavior
Meta Balls renders organic, liquid droplets that merge, stretch, and fuse together smoothly using 2D/3D scalar distance field thresholding or SVG gooey contrast filters.

## 2. Props & Configuration Interface
```typescript
interface MetaBallsProps {
  /** Number of bouncing metaball droplets (default: 6) */
  ballCount?: number;
  /** Ball radius range [min, max] in pixels (default: [30, 70]) */
  radiusRange?: [number, number];
  /** Ball color */
  color?: string;
  /** Metaball fusion threshold factor (default: 1.0) */
  threshold?: number;
  /** Enable mouse attraction (default: true) */
  interactive?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous droplet physics at 60 FPS. Droplets stretch and fuse smoothly without polygon popping.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D Scalar Field $F(x, y)$ for $N$ metaballs at centers $(x_i, y_i)$ with radii $R_i$:
$$F(x, y) = \sum_{i=1}^N \frac{R_i^2}{(x - x_i)^2 + (y - y_i)^2}$$
Metaball boundary condition:
$$\{(x, y) \mid F(x, y) \ge T_{threshold}\}$$
SVG Color Matrix Gooey Filter:
$$\begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 19 & -9 \end{pmatrix}$$

## 5. Interaction Mechanics
A dedicated metaball droplet is pinned to pointer position, fusing with autonomous bouncing droplets.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Filter Pipeline: Apply `<feGaussianBlur stdDeviation=\"10\">` followed by `<feColorMatrix type=\"matrix\">`.
2. Bouncing Droplet Physics: Update droplet positions with 2D velocity vectors and wall bounces.
3. Canvas Alternative: Compute scalar potential grid and draw marching squares isolines.
4. Performance: Keep blur radius reasonable to maintain 60 FPS.

## 7. Modularity & File Organization
Decompose into `MetaBalls.tsx` (<120 LoC), `DropletPhysics.ts` (<110 LoC), and `gooeyFilterSvg.ts` (<50 LoC).
