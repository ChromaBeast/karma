# Aero Shards (Backgrounds)

## 1. Overview & Visual Behavior
Aero Shards renders geometric crystalline glass shards drifting, rotating, and refracting background gradients in a 3D isometric atmosphere with mouse parallax.

## 2. Props & Configuration Interface
```typescript
interface AeroShardsProps {
  /** Shard count (default: 20) */
  shardCount?: number;
  /** Shard base color palette */
  colors?: string[];
  /** Drift velocity speed (default: 1.0) */
  speed?: number;
  /** Glass blur intensity in pixels (default: 12) */
  blur?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous drifting animation at 60 FPS. Mouse parallax responds via exponential lerp ($\tau = 16\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For shard $k$ with 3D coordinates $(x_k, y_k, z_k)$:
$$x_k(t) = x_{0,k} + V_x t + \Delta x_{mouse} \cdot \frac{z_k}{Z_{max}}$$
$$y_k(t) = y_{0,k} + V_y t + \Delta y_{mouse} \cdot \frac{z_k}{Z_{max}}$$
$$\theta_k(t) = \theta_{0,k} + \omega_k t$$
Facet polygon vertices in 2D projection:
$$P_j = (x_k + r_j \cos(\theta_k + \phi_j), \ y_k + r_j \sin(\theta_k + \phi_j))$$

## 5. Interaction Mechanics
Mouse coordinates steer the 3D parallax drift angle of crystalline shards.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / WebGL: Draw translucent convex polygon paths with dynamic linear gradients.
2. Depth Sorting: Render shards ordered by Z depth with variable blur.
3. Blend Modes: `globalCompositeOperation: 'screen'` or `'lighter'`.
4. Auto Resize: Seamlessly handles viewport dimension changes.

## 7. Modularity & File Organization
Organized into `AeroShards.tsx` (<120 LoC), `ShardEngine.ts` (<130 LoC), and `shardMath.ts` (<50 LoC).
