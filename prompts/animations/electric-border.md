# Electric Border (Animations)

## 1. Overview & Visual Behavior
Electric Border renders a high-voltage electrical plasma discharge traveling around the perimeter of UI cards with jagged lightning arcs, neon glow bloom, and dynamic sparks.

## 2. Props & Configuration Interface
```typescript
interface ElectricBorderProps {
  /** React children rendered inside glowing border */
  children: React.ReactNode;
  /** Electric arc color (default: '#00f0ff') */
  color?: string;
  /** Secondary discharge color (default: '#bf00ff') */
  secondaryColor?: string;
  /** Border thickness in pixels (default: 2) */
  borderWidth?: number;
  /** Border corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Speed of electrical current circulation in seconds (default: 3s) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous electric loop cycles every $3.0	ext{s}$. Micro-sparks jitter at 30 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Perimeter path length $P = 2(W + H) - (8 - 2\pi)R$.
Normalized arc position $s(t) = \left(\frac{t}{T}\right) \bmod 1.0$.
Jagged electrical noise offset for point $s$:
$$\vec{r}_{electric}(s) = \vec{r}_0(s) + \vec{n}(s) \cdot \sum_{k=1}^3 \frac{A}{k} \sin(2\pi f_k s + \phi_k(t))$$
Neon glow multi-layer drop shadow:
$$\text{filter: drop-shadow}(0\ 0\ 4\text{px } C_1) \text{ drop-shadow}(0\ 0\ 12\text{px } C_2)$$

## 5. Interaction Mechanics
Electrical discharge intensity and spark frequency flare up on card hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Perimeter Path: Render `<rect rx=\"R\">` stroke path matching container dimensions.
2. Animated Dash: Animate `stroke-dasharray` and `stroke-dashoffset` in CSS/WAAPI.
3. SVG Turbulence Filter: Apply `<feTurbulence>` and `<feDisplacementMap>` for jagged electric distortion.
4. Canvas Spark Overlay: Optional mini spark particle emitter at leading edge of arc.

## 7. Modularity & File Organization
Organized into `ElectricBorder.tsx` (<120 LoC), `ElectricSvg.tsx` (<100 LoC), and `electricStyles.ts` (<50 LoC).
