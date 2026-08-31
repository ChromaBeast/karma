# Glare Hover (Animations)

## 1. Overview & Visual Behavior
Glare Hover simulates a holographic trading card specular reflection that reacts in real-time to pointer position with 3D tilt, dynamic glare streaks, and iridescent shimmer.

## 2. Props & Configuration Interface
```typescript
interface GlareHoverProps {
  /** Child content wrapped in glare card */
  children: React.ReactNode;
  /** Maximum 3D tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Glare reflection opacity [0..1] (default: 0.35) */
  glareOpacity?: number;
  /** Glare light color (default: 'rgba(255, 255, 255, 0.8)') */
  glareColor?: string;
  /** Perspective depth in pixels (default: 1000) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Tilt and glare respond at 60/120 FPS via exponential lerp ($lpha = 0.12$). Rebounds to flat rest position over $400	ext{ms}$ upon mouse leave.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer position $(x_c, y_c)$ mapped to normalized range $[-1, 1]$ relative to card center:
$$u = \frac{2(x_c - X_0)}{W} - 1, \quad v = \frac{2(y_c - Y_0)}{H} - 1$$
3D rotation angles:
$$\text{rotateY} = u \cdot \theta_{max}, \quad \text{rotateX} = -v \cdot \theta_{max}$$
Glare highlight angle and position:
$$\text{glareAngle} = \arctan2(v, u) \cdot \frac{180^\circ}{\pi}$$
$$\text{glareOpacity} = \sqrt{u^2 + v^2} \cdot O_{max}$$

## 5. Interaction Mechanics
Smoothly tracks mouse over card area. Smooth return to neutral $(0^\circ, 0^\circ)$ on mouse leave.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Container: `transform-style: preserve-3d; perspective: 1000px`.
2. Glare Overlay: Absolute child with `pointer-events: none; mix-blend-mode: overlay`.
3. CSS Variables: Direct injection of `--rx`, `--ry`, `--glare-x`, `--glare-y`.
4. Touch Disable: Automatically deactivates 3D tilt on mobile devices.

## 7. Modularity & File Organization
Decompose into `GlareHover.tsx` (<120 LoC), `useCardTilt.ts` (<90 LoC), and `glareStyles.ts` (<50 LoC).
