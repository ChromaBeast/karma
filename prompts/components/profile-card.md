# Profile Card (Components)

## 1. Overview & Visual Behavior
Profile Card renders a glassmorphic personal ID badge / career avatar card with holographic sheen, tilt physics, verified badge glow, and animated social links.

## 2. Props & Configuration Interface
```typescript
interface ProfileCardProps {
  /** User name */
  name: string;
  /** Role / title */
  role: string;
  /** Avatar image URL */
  avatarSrc: string;
  /** Career stats or skill tags */
  tags?: string[];
  /** Verified status badge */
  verified?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Card tilts at 60/120 FPS via lerp ($\alpha = 0.15$). Avatar glow pulses over period $T = 3.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
3D Tilt Angles from card center $(X_0, Y_0)$:
$$\text{rotX} = -\left(\frac{y_c - Y_0}{H/2}\right) \cdot 12^\circ, \quad \text{rotY} = \left(\frac{x_c - X_0}{W/2}\right) \cdot 12^\circ$$
Holographic sheen gradient:
$$\text{background} = \text{linear-gradient}(\theta_{sheen}\text{deg}, \text{transparent } 30\%, C_{holo} \ 50\%, \text{transparent } 70\%)$$

## 5. Interaction Mechanics
Mouse hover tilts card in 3D and sweeps holographic sheen across avatar badge.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Card Shell: `perspective: 1000px; transform-style: preserve-3d`.
2. Holographic Layer: Pseudo-element with `mix-blend-mode: color-dodge` and dynamic position.
3. Avatar Glow: Multi-stage drop shadow on avatar border.
4. Tailwind Integration: Pure Tailwind styling with CSS custom properties.

## 7. Modularity & File Organization
Organized into `ProfileCard.tsx` (<120 LoC) and `profileCardStyles.ts` (<60 LoC).
