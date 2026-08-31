# Pixel Blast (Backgrounds)

## 1. Overview & Visual Behavior
Pixel Blast renders a retro pixel art starburst explosion background where pixel clusters detonate and disperse radially across the screen.

## 2. Props & Configuration Interface
```typescript
interface PixelBlastProps {
  /** Particle pixel count (default: 120) */
  particleCount?: number;
  /** Pixel block size in pixels (default: 6) */
  pixelSize?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Burst cycles every $4.0\text{s}$ with explosive initial velocity and quadratic deceleration.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For pixel $k \in [0, N-1]$ at time $\tau \in [0, 1]$:
$$r_k(\tau) = R_{max} \cdot (1 - (1 - \tau)^3) \cdot v_k$$
$$x_k(\tau) = X_0 + r_k(\tau) \cos\theta_k, \quad y_k(\tau) = Y_0 + r_k(\tau) \sin\theta_k$$
$$\alpha_k(\tau) = 1 - \tau^2$$

## 5. Interaction Mechanics
Clicking anywhere on screen detonates a new pixel blast from the click coordinates.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D Pixel Buffer: Batch draw square pixels with `ctx.fillRect()`.
2. Particle Emitter Pool: Reusable array of pixel objects.
3. Retro Color Cycling: 8-bit palette cycling.
4. Auto Sleeping: Pauses loop when particles fade.

## 7. Modularity & File Organization
Decompose into `PixelBlast.tsx` (<120 LoC) and `BlastEngine.ts` (<110 LoC).
