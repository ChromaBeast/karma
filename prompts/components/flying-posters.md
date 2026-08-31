# Flying Posters (Components)

## 1. Overview & Visual Behavior
Flying Posters renders a 3D tunnel gallery of photographic poster boards flying toward the camera in infinite perspective with mouse parallax steering.

## 2. Props & Configuration Interface
```typescript
interface FlyingPostersProps {
  /** Array of poster images */
  items: { id: string; title: string; image: string }[];
  /** Flying travel speed (default: 200) */
  speed?: number;
  /** 3D tunnel depth in pixels (default: 2000) */
  depth?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Posters travel continuously along Z axis at $V = 200\text{px/s}$. Tunnel recycle loop is completely seamless.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For poster $k \in [0, N-1]$ with Z coordinate $z_k(t)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{depth}$$
3D Perspective Scale:
$$\text{scale}_k = \frac{d_{cam}}{d_{cam} + z_k(t)}$$
Screen position with mouse parallax $(\Delta X, \Delta Y)$:
$$x_k = (X_k + \Delta X \cdot z_k / Z_{depth}) \cdot \text{scale}_k$$
$$y_k = (Y_k + \Delta Y \cdot z_k / Z_{depth}) \cdot \text{scale}_k$$

## 5. Interaction Mechanics
Mouse steering shifts 3D camera trajectory through the poster tunnel.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Canvas / DOM Stage: `perspective: 1000px; transform-style: preserve-3d`.
2. Z-Buffer Sorting: Depth sort posters to ensure correct occlusion.
3. Seamless Wrap: Reset poster Z position to far plane when $z < 0$.
4. Touch Parallax: Device gyroscope tilt on mobile.

## 7. Modularity & File Organization
Decompose into `FlyingPosters.tsx` (<130 LoC), `useTunnelPhysics.ts` (<100 LoC), and `posterMath.ts` (<60 LoC).
