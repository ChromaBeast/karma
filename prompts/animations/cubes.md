# Cubes (Animations)

## 1. Overview & Visual Behavior
Cubes renders an isometric 3D grid of floating cubes that elevate, rotate, and illuminate dynamically based on cursor distance and procedural wave functions.

## 2. Props & Configuration Interface
```typescript
interface CubesProps {
  /** Number of cubes along X axis (default: 8) */
  gridX?: number;
  /** Number of cubes along Y axis (default: 8) */
  gridY?: number;
  /** Cube dimension in pixels (default: 40) */
  cubeSize?: number;
  /** Elevation amplitude on hover in pixels (default: 50) */
  elevation?: number;
  /** Cube face base color */
  baseColor?: string;
  /** Cube face highlight color */
  highlightColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Elevation transitions operate at 60 FPS with spring settling time $pprox 350	ext{ms}$ ($\zeta = 0.82$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For cube at isometric coordinates $(i, j)$ and cursor $(x_c, y_c)$:
Isometric projection:
$$x_{iso} = (i - j) \cdot W_{half}, \quad y_{iso} = (i + j) \cdot H_{half} - Z_{elev}$$
Elevation calculation:
$$Z_{elev}(i, j) = Z_{max} \cdot \exp\left(-\frac{d_{i,j}^2}{2\sigma^2}\right) + A \cdot \sin(0.5i + 0.5j + \omega t)$$
Cube face shading (Lambertian reflectance):
$$I_{top} = I_0 \cdot 1.0, \quad I_{left} = I_0 \cdot 0.7, \quad I_{right} = I_0 \cdot 0.5$$

## 5. Interaction Mechanics
Cursor acts as an elevation attractor, lifting adjacent 3D isometric cubes into ripples.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Isometric SVG / Canvas: Render isometric top, left, and right polygon faces for each cube.
2. Depth Sorting: Render cubes in back-to-front painter's algorithm order ($(i + j)$ ascending).
3. Dynamic Shading: Compute face color stops dynamically based on elevation $Z$.
4. Responsive Fit: Center isometric grid within container boundaries.

## 7. Modularity & File Organization
Decompose into `Cubes.tsx` (<120 LoC), `IsometricGrid.ts` (<130 LoC), and `isoMath.ts` (<60 LoC).
