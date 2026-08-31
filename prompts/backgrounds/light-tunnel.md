# Light Tunnel (Backgrounds)

## 1. Overview & Visual Behavior
Light Tunnel generates an endless 3D hyperspace warp tunnel with accelerating neon rings, speed particle streaks, and mouse steering.

## 2. Props & Configuration Interface
```typescript
interface LightTunnelProps {
  /** Ring count inside tunnel (default: 16) */
  ringCount?: number;
  /** Travel speed through tunnel (default: 300) */
  speed?: number;
  /** Neon color palette */
  colors?: string[];
  /** Tunnel curvature amplitude (default: 40) */
  curvature?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Infinite warp speed translation along Z axis at $V = 300\text{px/s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For tunnel ring $k \in [0, N-1]$ with Z depth $z_k(t)$:
$$z_k(t) = (z_{0,k} - V \cdot t) \bmod Z_{max}$$
Perspective ring radius:
$$R_k(t) = \frac{R_0 \cdot d_{cam}}{z_k(t) + d_{cam}}$$
Centerline tunnel curve with mouse steering $(X_m, Y_m)$:
$$x_{center}(z) = X_m \cdot \left(\frac{z}{Z_{max}}\right)^2, \quad y_{center}(z) = Y_m \cdot \left(\frac{z}{Z_{max}}\right)^2$$

## 5. Interaction Mechanics
Moving mouse steers camera trajectory through the bending 3D neon tunnel.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / WebGL: Draw concentric distorted ellipses along tunnel spine.
2. Speed Streaks: Add radial particle lines extending from vanishing center point.
3. Neon Glow: Apply high-intensity canvas shadows or additive blend modes.
4. Frame Rate Throttling: Automatically reduces ring count on mobile.

## 7. Modularity & File Organization
Decompose into `LightTunnel.tsx` (<120 LoC), `TunnelEngine.ts` (<130 LoC), and `tunnelMath.ts` (<50 LoC).
