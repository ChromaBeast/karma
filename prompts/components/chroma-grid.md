# Chroma Grid (Components)

## 1. Overview & Visual Behavior
Chroma Grid renders a grid of interactive glass tiles that illuminate with vibrant chromatic color halos, rainbow dispersion lines, and specular highlights as the cursor moves.

## 2. Props & Configuration Interface
```typescript
interface ChromaGridProps {
  /** Number of grid columns (default: 4) */
  columns?: number;
  /** Number of grid rows (default: 3) */
  rows?: number;
  /** Tile items */
  items: React.ReactNode[];
  /** Halo radius in pixels (default: 200) */
  glowRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Color halos track pointer at 60/120 FPS. Light dissipation settles in $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For tile center $(X_k, Y_k)$ and pointer $(x_c, y_c)$:
Distance $d_k = \sqrt{(X_k - x_c)^2 + (Y_k - y_c)^2}$.
Rainbow hue calculation:
$$\text{Hue}(k) = \left(\frac{x_c}{W} \cdot 360^\circ + k \cdot 20^\circ\right) \bmod 360^\circ$$
Radial glow mask:
$$\text{background} = \text{radial-gradient}(R\text{px at } (x_c - X_k)\text{px } (y_c - Y_k)\text{px}, \text{hsl}(\text{Hue}, 80\%, 60\%), \text{transparent } 70\%)$$

## 5. Interaction Mechanics
Sweeping mouse across grid creates fluid waves of vibrant chromatic light.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Grid Layout: Tailwind CSS grid with `gap-4`.
2. Dynamic Gradient Overlays: Each tile has absolute glow layer listening to parent mouse coordinates.
3. CSS Blend Modes: `mix-blend-mode: color-dodge` for neon intensity.
4. Optimized Events: Single mouse move listener on root grid container.

## 7. Modularity & File Organization
Decompose into `ChromaGrid.tsx` (<120 LoC), `ChromaTile.tsx` (<90 LoC), and `chromaStyles.ts` (<50 LoC).
