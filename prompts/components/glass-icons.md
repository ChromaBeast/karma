# Glass Icons (Components)

## 1. Overview & Visual Behavior
Glass Icons renders 3D glassmorphic social icons or tool badges with translucent frosted layers, specular surface sheen, and floating icon glyphs.

## 2. Props & Configuration Interface
```typescript
interface GlassIconsProps {
  /** Array of icon configurations (icon, label, color, href) */
  icons: { id: string; icon: React.ReactNode; label?: string; color?: string; href?: string }[];
  /** Icon badge size in pixels (default: 56) */
  size?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Hover lifts icon badge in $200\text{ms}$ with spring overshoot `(0.34, 1.5, 0.64, 1)`. Sheen sweep takes $400\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
3D Layer Separation on Hover:
$$\text{Glass Base: } \text{translateZ}(10\text{px})$$
$$\text{Icon Glyph: } \text{translateZ}(30\text{px})$$
$$\text{Drop Shadow: } 0\ 16\text{px } 32\text{px rgba}(C_{icon}, 0.35)$$

## 5. Interaction Mechanics
Hovering lifts glass icon in 3D and illuminates vibrant brand glow.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Multi-Layer DOM: Glass background + frosted middle layer + elevated icon glyph.
2. CSS 3D Transforms: `transform-style: preserve-3d; transition: transform 0.3s ease`.
3. Dynamic Brand Tint: Injects `--icon-color` for custom drop-shadow and border glow.
4. Accessible Links: Semantic `<a>` tags with ARIA labels.

## 7. Modularity & File Organization
Decompose into `GlassIcons.tsx` (<110 LoC), `GlassIconItem.tsx` (<80 LoC), and `glassIconStyles.ts` (<50 LoC).
