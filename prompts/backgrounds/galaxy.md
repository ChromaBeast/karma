# Galaxy (Backgrounds)

## 1. Overview & Visual Behavior
Galaxy renders a spiral galaxy with thousands of star particles orbiting in logarithmic spiral arms, central galactic core glow, and 3D tilt.

## 2. Props & Configuration Interface
```typescript
interface GalaxyProps {
  /** Star particle count (default: 1000) */
  particleCount?: number;
  /** Number of spiral arms (default: 3) */
  spiralArms?: number;
  /** Galaxy core color */
  coreColor?: string;
  /** Arm star color */
  armColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous differential galaxy rotation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Logarithmic Spiral Arm Coordinates for star $i$ on arm $a \in [0, K-1]$:
$$r_i = R_{max} \cdot u_i^{0.5}, \quad \theta_i = r_i \cdot b + \frac{2\pi a}{K} + \text{rand}(-\sigma_\theta, \sigma_\theta)$$
Orbital Velocity (Differential Keplerian / Flat rotation curve):
$$v_\theta(r) = \frac{V_0}{1 + r / R_c}$$
$$x_i(t) = r_i \cos(\theta_i + \omega(r_i) t), \quad y_i(t) = r_i \sin(\theta_i + \omega(r_i) t)$$

## 5. Interaction Mechanics
Mouse drag tilts the 3D spiral galaxy plane in space.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Point Cloud / Canvas 2D: Render instanced point sprites with additive blending.
2. Density Texture: Galactic core rendered with soft glowing radial sprite.
3. 3D Perspective Projection: Perspective camera matrix applied to star coordinates.
4. High Performance: $1000+$ stars rendered at 60 FPS smoothly.

## 7. Modularity & File Organization
Organized into `Galaxy.tsx` (<120 LoC), `GalaxyEngine.ts` (<140 LoC), and `galaxyMath.ts` (<60 LoC).
