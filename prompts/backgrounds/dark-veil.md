# Dark Veil (Backgrounds)

## 1. Overview & Visual Behavior
Dark Veil renders a mysterious, deep obsidian black atmosphere with subtle smoky silk folds drifting and glowing edge highlights.

## 2. Props & Configuration Interface
```typescript
interface DarkVeilProps {
  /** Smoke veil density (default: 0.7) */
  density?: number;
  /** Veil edge highlight color (default: 'rgba(99, 102, 241, 0.2)') */
  glowColor?: string;
  /** Drift velocity (default: 0.5) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous organic veil drifting at 60 FPS with subtle wave periods ($T \approx 8\text{s}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Fractal Simplex Noise Density $D(x, y, t)$:
$$D(x, y, t) = \text{simplex}(f \cdot x + \text{simplex}(f \cdot y, t), \ f \cdot y, \ \omega t)$$
Luminance tone mapping:
$$I(x, y) = \text{smoothstep}(0.3, 0.8, D(x, y, t)) \cdot C_{glow}$$

## 5. Interaction Mechanics
Pointer gently parts and disperses the dark veil smoke clouds.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas Noise: Low-frequency simplex noise shader.
2. Deep Tone Gradient: Deep black base with subtle indigo/violet ambient bloom.
3. Composite Layer: Rendered on GPU composite texture.
4. Low CPU: Throttles to 30 FPS on battery saver mode.

## 7. Modularity & File Organization
Decompose into `DarkVeil.tsx` (<110 LoC), `VeilShader.ts` (<120 LoC), and `veilStyles.ts` (<40 LoC).
