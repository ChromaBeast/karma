# Star Border (Animations)

## 1. Overview & Visual Behavior
Star Border animates a glowing constellation star or luminous light packet orbiting the rounded border perimeter of buttons or feature cards with a radiant particle tail.

## 2. Props & Configuration Interface
```typescript
interface StarBorderProps {
  /** React children wrapped in star border */
  children: React.ReactNode;
  /** Border stroke color */
  color?: string;
  /** Speed of star revolution in seconds (default: 4s) */
  speed?: number;
  /** Star glow bloom size in pixels (default: 12) */
  glowSize?: number;
  /** Border thickness in pixels (default: 2) */
  thickness?: number;
  /** Corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous perimeter revolution over period $T = 4.0	ext{s}$ using linear constant velocity.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For rounded rectangle perimeter $P = 2(W - 2R) + 2(H - 2R) + 2\pi R$:
Arc length position:
$$s(t) = \left(\frac{t}{T}\right) \cdot P$$
CSS conic-gradient approximation:
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg at } 50\%\ 50\%, \text{transparent } 0^\circ, C_{glow} \ 30^\circ, \text{transparent } 60^\circ)$$
$$\text{mask} = \text{border-box subtract content-box}$$

## 5. Interaction Mechanics
Star orbit accelerates or reverses direction on card hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Conic Gradient Mask: Apply animated `conic-gradient` mask on pseudo-element.
2. SVG Path Alternative: Animate `<circle>` along SVG `<rect rx=\"R\">` using CSS `offset-path`.
3. Drop Shadow Bloom: Multi-stage CSS `drop-shadow` for neon starlight radiance.
4. Tailwind Integration: Custom CSS variable `--star-angle` driven by CSS `@keyframes`.

## 7. Modularity & File Organization
Decompose into `StarBorder.tsx` (<120 LoC) and `starBorderStyles.ts` (<60 LoC).
