# Reflective Card (Components)

## 1. Overview & Visual Behavior
Reflective Card simulates high-end glassmorphic material reflection with mirror sheen, surface normal refraction, ambient lighting, and interactive 3D rotation.

## 2. Props & Configuration Interface
```typescript
interface ReflectiveCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Reflection intensity [0..1] (default: 0.4) */
  reflectivity?: number;
  /** Glass border color (default: 'rgba(255, 255, 255, 0.2)') */
  borderColor?: string;
  /** Maximum tilt angle in degrees (default: 12) */
  maxTilt?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pointer tracking interpolates via lerp at 60/120 FPS ($\alpha = 0.15$). Rebounds in $300\text{ms}$ on mouse leave.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Surface normal vector $\vec{N}$ from normalized coordinates $(u, v) \in [-1, 1]$:
$$\vec{N} = \frac{(-u \sin\theta_{max}, \ -v \sin\theta_{max}, \ 1)}{\sqrt{u^2 \sin^2\theta_{max} + v^2 \sin^2\theta_{max} + 1}}$$
Fresnel reflection factor:
$$F = F_0 + (1 - F_0)(1 - \vec{N} \cdot \vec{V})^5$$
Linear gradient reflection angle:
$$\phi = \arctan2(v, u) + 90^\circ$$

## 5. Interaction Mechanics
Tilts in 3D toward mouse. Shimmer reflection traverses card face based on viewing angle.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Glassmorphic Surface: `backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.05)`.
2. Specular Sheen: Multi-stop linear gradient overlay with `mix-blend-mode: overlay`.
3. CSS Transforms: Update `--rx`, `--ry` on RAF loop.
4. Mobile Optimization: Disables tilt on touch devices.

## 7. Modularity & File Organization
Organized into `ReflectiveCard.tsx` (<120 LoC) and `reflectiveStyles.ts` (<60 LoC).
