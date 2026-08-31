# Ripple Grid (Backgrounds)

## 1. Overview & Visual Behavior
Ripple Grid renders an interactive wireframe grid plane that deforms with undulating concentric water ripples when clicked or hovered.

## 2. Props & Configuration Interface
```typescript
interface RippleGridProps {
  /** Grid cell spacing in pixels (default: 30) */
  gridSize?: number;
  /** Ripple propagation speed (default: 1.5) */
  speed?: number;
  /** Wave damping factor (default: 0.96) */
  damping?: number;
  /** Grid stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
2D wave equation solver runs at 60 FPS. Ripple impulses dissipate over $1.5\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D Discrete Wave Grid:
$$h(x, y, t+1) = \left(\frac{h(x-1,y) + h(x+1,y) + h(x,y-1) + h(x,y+1)}{2} - h(x,y,t-1)\right) \cdot d$$
Isometric grid line rendering:
$$x_{iso} = (i - j) \cdot W_{cell}, \quad y_{iso} = (i + j) \cdot H_{cell} - h(i, j)$$

## 5. Interaction Mechanics
Moving mouse or clicking injects wave energy into grid vertices.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Heightmap Buffers: `Float32Array` buffers ping-ponging wave heights.
2. Canvas 2D Line Drawing: Batch stroke isometric or planar grid lines.
3. Sleep Engine: Deactivates simulation when total kinetic energy $< \epsilon$.
4. Responsive Fit: Adapts grid resolution to screen size.

## 7. Modularity & File Organization
Decompose into `RippleGrid.tsx` (<120 LoC), `RippleGridEngine.ts` (<130 LoC), and `waveGridMath.ts` (<50 LoC).
