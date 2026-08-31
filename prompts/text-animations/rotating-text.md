# Rotating Text (Text Animations)

## 1. Overview & Visual Behavior
Rotating Text flips words along 3D cube axes or vertical cylindrical rolls, smoothly adapting wrapper width and height to prevent adjacent layout shifts.

## 2. Props & Configuration Interface
```typescript
interface RotatingTextProps {
  /** Array of rotating words or phrases */
  words: string[];
  /** Display duration per word in milliseconds (default: 2500) */
  interval?: number;
  /** Flip transition duration in milliseconds (default: 600) */
  transitionDuration?: number;
  /** 3D rotation axis (default: 'X') */
  rotationAxis?: 'X' | 'Y';
  /** 3D perspective in pixels (default: 800) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Each word flip executes over $600\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)` with a $2500\text{ms}$ stationary dwell.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Rotation angle $\theta(\tau)$ for normalized step $\tau \in [0, 1]$:
$$\theta(\tau) = 90^\circ \cdot (1 - f(\tau))$$
where $f(\tau) = 1 - (1 - \tau)^3$.
Outgoing face:
$$\text{transform: rotateX}(\theta - 90^\circ) \text{ translateZ}(H/2)$$
Incoming face:
$$\text{transform: rotateX}(\theta) \text{ translateZ}(H/2)$$

## 5. Interaction Mechanics
Pauses on pointer hover. Supports manual next/prev cycling via arrow keys.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Cube Container: Relative box with `perspective: 800px; transform-style: preserve-3d`.
2. Dynamic Width: Animate container width via `ResizeObserver` or measured word bounding boxes.
3. CSS 3D Transforms: Apply `rotateX` / `rotateY` with `translateZ` half-depth offset.
4. Motion Safety: Uses simple vertical slide if 3D transforms are reduced.

## 7. Modularity & File Organization
Organized into `RotatingText.tsx` (<120 LoC), `useRotatingWords.ts` (<80 LoC), and `rotatingStyles.ts` (<50 LoC).
