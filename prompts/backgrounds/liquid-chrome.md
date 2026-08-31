# Liquid Chrome (Backgrounds)

## 1. Overview & Visual Behavior
Liquid Chrome renders high-gloss fluid mercury and chrome metal pools that reflect panoramic studio environment maps with realistic specular shine.

## 2. Props & Configuration Interface
```typescript
interface LiquidChromeProps {
  /** Reflectivity strength [0..1] (default: 0.9) */
  reflectivity?: number;
  /** Flow viscosity (default: 0.92) */
  viscosity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Fluid Navier-Stokes simulation at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Blinn-Phong Specular Environment Reflection:
$$\vec{R} = \text{reflect}(-\vec{V}, \vec{N})$$
$$C_{chrome} = \text{sampleCubemap}(\vec{R}) + k_s (\vec{N} \cdot \vec{H})^\alpha$$

## 5. Interaction Mechanics
Pointer drags ripples through the reflective chrome surface.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Real-time normal computation and environment cubemap sampling.
2. Low-Res Fluid FBO: $128 \times 128$ simulation texture.
3. Specular Tone Mapping: High-contrast chrome curve mapping.
4. Clean Teardown: Context disposal on unmount.

## 7. Modularity & File Organization
Organized into `LiquidChrome.tsx` (<120 LoC), `ChromeShader.ts` (<140 LoC), and `chromeMath.ts` (<50 LoC).
