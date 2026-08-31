# Plasma Wave (Backgrounds)

## 1. Overview & Visual Behavior
Plasma Wave combines trigonometric plasma formulas with directional traveling wave packets and iridescent metallic sheen.

## 2. Props & Configuration Interface
```typescript
interface PlasmaWaveProps {
  /** Wave packet speed (default: 1.0) */
  speed?: number;
  /** Wave amplitude (default: 50) */
  amplitude?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Traveling wave packets cycle continuously at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
2D Traveling Wave Equation:
$$\Psi(x, y, t) = A_1 \sin(k_x x + k_y y - \omega t) \cdot \cos(k_x x - k_y y + 0.5 \omega t)$$

## 5. Interaction Mechanics
Mouse coordinates modulate wave propagation direction.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas 2D: Fragment shader computing wave superposition.
2. Iridescent Palette: Multi-stop color LUT.
3. Auto Scaled Viewport: Full container coverage.
4. Clean Disposal: WebGL context teardown on unmount.

## 7. Modularity & File Organization
Decompose into `PlasmaWave.tsx` (<110 LoC) and `plasmaWaveShaders.ts` (<110 LoC).
