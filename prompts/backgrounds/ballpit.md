# Ballpit (Backgrounds)

## 1. Overview & Visual Behavior
Ballpit creates a playful 2D/3D physics ball pit with hundreds of colorful bouncing sphere particles with gravity, restitution, and pointer repulsion.

## 2. Props & Configuration Interface
```typescript
interface BallpitProps {
  /** Ball sphere count (default: 50) */
  count?: number;
  /** Ball radius in pixels (default: 20) */
  radius?: number;
  /** Ball color palette */
  colors?: string[];
  /** Gravity (default: 980) */
  gravity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Newtonian rigid body physics running at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For sphere $i$ with radius $R_i$, position $\vec{p}_i$, and velocity $\vec{v}_i$:
Gravity:
$$\vec{v}_i(t + \Delta t) = \vec{v}_i(t) + \vec{g} \Delta t$$
Sphere-Sphere Elastic Collision ($d_{ij} < R_i + R_j$):
$$\vec{v}_i' = \vec{v}_i - \frac{2m_j}{m_i + m_j} \frac{\langle \vec{v}_i - \vec{v}_j, \vec{p}_i - \vec{p}_j \rangle}{\|\vec{p}_i - \vec{p}_j\|^2} (\vec{p}_i - \vec{p}_j)$$
Floor Bounce:
$$y_i = H - R_i, \quad v_{y,i} = -e \cdot v_{y,i}$$

## 5. Interaction Mechanics
Users can stir, toss, and flick bouncing balls with mouse cursor.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 2D Physics Engine: Spatial grid spatial hash for $O(N)$ ball collision checks.
2. Canvas 2D Shaded Circles: Draw 3D radial gradient spheres with specular highlight.
3. Mouse Impulses: Impart velocity when pointer intersects spheres.
4. Auto Sleeping: Pauses simulation when all balls reach rest energy.

## 7. Modularity & File Organization
Decompose into `Ballpit.tsx` (<120 LoC), `BallpitPhysics.ts` (<150 LoC), and `ballTypes.ts` (<40 LoC).
