# CRT Warp (Backgrounds)

## 1. Overview & Visual Behavior
CRT Warp applies retro cathode-ray tube barrel distortion, flickering phosphorescent scanlines, RGB sub-pixel chromatic aberration, and vignette curves.

## 2. Props & Configuration Interface
```typescript
interface CrtWarpProps {
  /** Barrel distortion curvature intensity (default: 0.15) */
  curvature?: number;
  /** Scanline count or spacing in pixels (default: 4) */
  scanlineSpacing?: number;
  /** CRT flicker noise intensity (default: 0.04) */
  flicker?: number;
  /** Vignette edge darkness (default: 0.4) */
  vignette?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Scanlines animate at 60 FPS. Micro-flicker updates at 30 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Barrel Distortion in normalized UV space $(u, v) \in [-1, 1]$:
$$r = \sqrt{u^2 + v^2}$$
$$(u', v') = (u, v) \cdot (1 + k \cdot r^2)$$
CRT Scanline Function:
$$S(y, t) = 0.5 + 0.5 \cdot \sin\left(\frac{2\pi y}{H_{scan}} + \omega t\right)$$
Vignette Darkening:
$$V(u, v) = (1 - u^2)(1 - v^2)$$

## 5. Interaction Mechanics
Static or reactive full-screen backdrop filter overlay.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader: Single full-screen quad applying barrel distortion and scanline modulation.
2. SVG/CSS Fallback: Radial gradient vignette + repeating scanline background overlay.
3. Zero Main-Thread Overhead: Executed entirely on GPU fragment stage.
4. Preserves Content: Underlying DOM content remains fully interactive.

## 7. Modularity & File Organization
Organized into `CrtWarp.tsx` (<110 LoC), `CrtShader.ts` (<120 LoC), and `crtStyles.ts` (<40 LoC).
