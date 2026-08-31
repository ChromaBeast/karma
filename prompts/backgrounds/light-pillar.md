# Light Pillar (Backgrounds)

## 1. Overview & Visual Behavior
Light Pillar renders towering vertical columns of volumetric neon light and god rays piercing through a dark atmospheric haze.

## 2. Props & Configuration Interface
```typescript
interface LightPillarProps {
  /** Pillar count (default: 5) */
  pillarCount?: number;
  /** Pillar base color */
  color?: string;
  /** Ray beam width in pixels (default: 80) */
  beamWidth?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pillars oscillate and breathe slowly with harmonic periods ($T \in [4\text{s}, 9\text{s}]$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For light pillar $k$ at horizontal position $x_k$:
Volumetric beam intensity $I(x, y, t)$:
$$I(x, y, t) = I_0 \cdot \exp\left(-\frac{(x - x_k(t))^2}{2\sigma^2}\right) \cdot \left(1 - \frac{y}{H}\right)^{0.5} \cdot (1 + 0.2 \sin(\omega_k t))$$

## 5. Interaction Mechanics
Mouse hover attracts the nearest light pillar and boosts its luminous intensity.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Linear Gradients / Canvas: Multi-stop vertical gradients with radial horizontal falloff.
2. Additive Blend: `mix-blend-mode: screen` for light accumulation.
3. Ambient Dust Particles: Optional floating dust particles inside pillar beams.
4. Tailwind Integration: Pure Tailwind CSS classes with CSS custom properties.

## 7. Modularity & File Organization
Organized into `LightPillar.tsx` (<120 LoC) and `pillarStyles.ts` (<50 LoC).
