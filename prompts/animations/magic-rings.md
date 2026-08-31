# Magic Rings (Animations)

## 1. Overview & Visual Behavior
Magic Rings renders concentric neon energy rings radiating outward with rotating phase angles, chromatic color cycling, and interactive sound/pointer resonance.

## 2. Props & Configuration Interface
```typescript
interface MagicRingsProps {
  /** Number of concentric rings (default: 6) */
  ringCount?: number;
  /** Base ring diameter in pixels (default: 200) */
  baseRadius?: number;
  /** Primary neon color */
  color?: string;
  /** Rotation period in seconds (default: 8s) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Concentric rings rotate at staggered harmonic frequencies $\omega_k = rac{\omega_0}{k}$. Radial pulse period $T = 3.0	ext{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For ring $k \in [1, N]$:
Radius at time $t$:
$$R_k(t) = R_{base} \cdot k + A \cdot \sin(\omega t - k \cdot \phi)$$
Rotation angle:
$$\theta_k(t) = (-1)^k \cdot \frac{2\pi t}{T \cdot k}$$
Stroke opacity:
$$\alpha_k = 1 - \frac{k}{N + 1}$$

## 5. Interaction Mechanics
Pointer hover distorts ring concentricity, pulling ring centers toward cursor.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Concentric Groups: Render `<circle>` or elliptical `<path>` elements with dashed strokes.
2. CSS Keyframe Rotation: Staggered `rotate` transforms applied to individual SVG groups.
3. Glow Filter: Apply SVG `<feGaussianBlur>` or CSS `drop-shadow`.
4. Responsive Scaling: SVG viewBox auto-scales across screen resolutions.

## 7. Modularity & File Organization
Decompose into `MagicRings.tsx` (<120 LoC) and `ringStyles.ts` (<60 LoC).
