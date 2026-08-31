# Orb (Backgrounds)

## 1. Overview & Visual Behavior
Orb renders a 3D procedural plasma energy orb with swirling surface noise, glowing electric corona, and mouse-directed orientation.

## 2. Props & Configuration Interface
```typescript
interface OrbProps {
  /** Orb radius in pixels (default: 150) */
  radius?: number;
  /** Core energy color */
  color?: string;
  /** Corona glow intensity (default: 0.8) */
  glowIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous plasma noise rotation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Raymarched Sphere Surface $(x, y, z)$:
$$x^2 + y^2 + z^2 = R^2 + \text{simplex}(f x, f y, f z + \omega t)$$
Fresnel Corona Glow:
$$I_{corona} = I_0 \cdot (1 - \vec{N} \cdot \vec{V})^3$$

## 5. Interaction Mechanics
Mouse position rotates the 3D plasma orb and increases corona flares.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Raymarched sphere with 3D noise displacement.
2. Additive Glow Bloom: Multi-pass Gaussian blur on corona halo.
3. Canvas Fallback: Radial gradient circle with rotating SVG turbulence.
4. Auto Sleep: Disables rendering when outside viewport.

## 7. Modularity & File Organization
Organized into `Orb.tsx` (<120 LoC), `OrbShader.ts` (<140 LoC), and `orbMath.ts` (<50 LoC).
