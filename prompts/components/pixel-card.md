# Pixel Card (Components)

## 1. Overview & Visual Behavior
Pixel Card renders interactive UI cards with a retro pixelated mosaic border or background grid that animates, highlights, and scrambles on cursor proximity.

## 2. Props & Configuration Interface
```typescript
interface PixelCardProps {
  /** Card children content */
  children: React.ReactNode;
  /** Pixel block size in pixels (default: 16) */
  pixelSize?: number;
  /** Pixel highlight color (default: '#6366f1') */
  color?: string;
  /** Pixel activation radius around pointer (default: 100) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pixel cells illuminate on pointer contact ($<16\text{ms}$) and fade out exponentially over $450\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For pixel cell $(i, j)$ at center $(x_{i,j}, y_{i,j})$ and cursor $(x_c, y_c)$:
Proximity test:
$$d = \sqrt{(x_{i,j} - x_c)^2 + (y_{i,j} - y_c)^2}$$
$$\text{isActive} = d < R_{radius}$$
Opacity decay function:
$$\alpha_{i,j}(t) = \alpha_0 \cdot e^{-(t - t_{hit}) / \tau_{decay}}$$

## 5. Interaction Mechanics
Moving mouse over card surface lights up a trail of illuminated pixel tiles.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas Pixel Overlay: Overlay `<canvas>` rendering square tiles with `ctx.fillRect()`.
2. Timestamp Map: Track active cell hits in `Map<string, number>`.
3. Auto Pause: RAF loop pauses when all illuminated cells fade to zero.
4. Clean Border: Card content sits atop canvas with `relative z-10`.

## 7. Modularity & File Organization
Decompose into `PixelCard.tsx` (<120 LoC), `PixelCanvas.ts` (<100 LoC), and `pixelCardStyles.ts` (<40 LoC).
