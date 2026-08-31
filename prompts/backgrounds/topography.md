# Topography (Backgrounds)

## 1. Overview & Visual Behavior
Topography renders animated isometric contour maps, elevation isolines, and terrain maps using 2D Perlin noise scalar fields and Marching Squares.

## 2. Props & Configuration Interface
```typescript
interface TopographyProps {
  /** Number of elevation contour levels (default: 12) */
  contourLevels?: number;
  /** Noise scale frequency (default: 0.003) */
  noiseScale?: number;
  /** Contour line stroke color */
  lineColor?: string;
  /** Animation speed (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Terrain noise field evolves smoothly at 60 FPS with constant phase velocity $\omega = 0.1\text{ rad/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D Scalar Elevation Field $E(x, y, t)$:
$$E(x, y, t) = \sum_{k=0}^2 \frac{1}{2^k} \text{simplex}(2^k \cdot f \cdot x, \ 2^k \cdot f \cdot y, \ \omega t)$$
Contour Isoline Condition for elevation level $h_k$:
$$\{(x, y) \mid E(x, y, t) = h_k\}$$
Marching Squares linear interpolation between grid vertices $(A, B)$ with values $(v_A, v_B)$:
$$\vec{P}_{iso} = \vec{A} + \frac{h_k - v_A}{v_B - v_A} (\vec{B} - \vec{A})$$

## 5. Interaction Mechanics
Mouse cursor acts as a topographic elevation peak or depression in the terrain.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Marching Squares Kernel: Fast lookup table evaluating $16$ cell edge configurations.
2. Canvas 2D Vector Strokes: Draw continuous contour paths across cells.
3. WebGL Alternative: Fragment shader computing `fract(elevation * N)` for 60 FPS performance.
4. Auto Resolution: Dynamic grid spacing based on viewport width.

## 7. Modularity & File Organization
Organized into `Topography.tsx` (<120 LoC), `MarchingSquares.ts` (<140 LoC), and `simplexNoise.ts` (<120 LoC).
