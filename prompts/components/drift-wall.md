# Drift Wall (Components)

## 1. Overview & Visual Behavior
Drift Wall displays a continuous infinite 2D canvas wall of portfolio projects, screenshots, or artwork tiles drifting gently with automated pan, pointer parallax, and smooth dragging.

## 2. Props & Configuration Interface
```typescript
interface DriftWallProps {
  /** Grid items to display across drifting wall */
  items: React.ReactNode[];
  /** Grid column count (default: 6) */
  columns?: number;
  /** Tile width in pixels (default: 280) */
  tileWidth?: number;
  /** Tile height in pixels (default: 200) */
  tileHeight?: number;
  /** Autonomous drift speed in pixels/sec (default: 15) */
  driftSpeed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Autonomous drift runs continuously at 60 FPS. Mouse drag inertia decays over $600\text{ms}$ ($\mu = 0.95$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D infinite wrap-around coordinate offset $(X(t), Y(t))$:
$$X(t) = (X(t-1) + V_x \Delta t + V_{drag, x}) \bmod W_{grid}$$
$$Y(t) = (Y(t-1) + V_y \Delta t + V_{drag, y}) \bmod H_{grid}$$
Parallax mouse displacement:
$$\vec{\Delta}_{parallax} = \left(\frac{x_{mouse} - W/2}{W} \cdot 40\text{px}, \ \frac{y_{mouse} - H/2}{H} \cdot 40\text{px}\right)$$

## 5. Interaction Mechanics
Pointer drag pans the 2D infinite wall freely. Hovering over a tile scales it up and brings it to the top z-index.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Virtual 2D Grid: Render $3 \times 3$ grid of repeat blocks to ensure seamless infinite looping.
2. GPU Pan: Apply `transform: translate3d(X, Y, 0)` to grid root wrapper.
3. Memory Optimization: Unmount or hide tiles outside active viewport bounding rectangle.
4. Touch Panning: Native touch drag and multi-touch pinch scaling.

## 7. Modularity & File Organization
Decompose into `DriftWall.tsx` (<130 LoC), `useInfinitePan.ts` (<110 LoC), and `driftGridMath.ts` (<50 LoC).
