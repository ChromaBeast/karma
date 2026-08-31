# Pixel Swap (Animations)

## 1. Overview & Visual Behavior
Pixel Swap executes a retro 8-bit image transition where square pixel blocks dissolve, shuffle, and re-crystallize to morph between two distinct images or UI states.

## 2. Props & Configuration Interface
```typescript
interface PixelSwapProps {
  /** Initial image source */
  fromSrc: string;
  /** Target image source */
  toSrc: string;
  /** Pixel block size in pixels (default: 16) */
  blockSize?: number;
  /** Transition duration in milliseconds (default: 800) */
  duration?: number;
  /** Shuffle randomness intensity [0..1] (default: 0.5) */
  chaos?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Transitions over $800	ext{ms}$ with staggered pixel activation. Each individual block undergoes a $200	ext{ms}$ scale/flip animation.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For pixel block at grid index $(i, j)$:
Stagger start time:
$$t_{start}(i, j) = T_{total} \cdot \left((1 - c) \frac{i + j}{M + N} + c \cdot \text{hash}(i, j)\right)$$
Block flip scale $S_{i,j}(\tau)$:
$$S_{i,j}(\tau) = |\cos(\pi \cdot \tau)|$$
Active image selection:
$$\text{image}(\tau) = \begin{cases} \text{fromSrc} & \text{if } \tau < 0.5 \\ \text{toSrc} & \text{if } \tau \ge 0.5 \end{cases}$$

## 5. Interaction Mechanics
Triggered on button click, route navigation, or hover toggle.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas Slicing: Divide image into $N \times M$ tile grid.
2. Flip Animation: Animate tile matrices using Canvas 2D `ctx.drawImage(src, sx, sy, sw, sh, dx, dy, dw, dh)`.
3. Offscreen Texture Cache: Preload both images to prevent rendering stutters.
4. Memory Management: Clean up canvas contexts on component unmount.

## 7. Modularity & File Organization
Organized into `PixelSwap.tsx` (<130 LoC), `PixelGrid.ts` (<120 LoC), and `pixelMath.ts` (<50 LoC).
