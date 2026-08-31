# Magic Bento (Components)

## 1. Overview & Visual Behavior
Magic Bento renders a high-impact Bento grid layout with dynamic spotlight mouse glows, border gradient illumination, and 3D card tilt across modular tiles.

## 2. Props & Configuration Interface
```typescript
interface MagicBentoProps {
  /** Array of bento grid cards */
  cards: { id: string; colSpan?: number; rowSpan?: number; title?: string; content: React.ReactNode }[];
  /** Spotlight glow color (default: 'rgba(99, 102, 241, 0.15)') */
  spotlightColor?: string;
  /** Enable 3D card tilt (default: true) */
  enableTilt?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Spotlight and border illumination track pointer at 60/120 FPS. Hover tilt settles within $250\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For card $k$ with bounding box $(X_k, Y_k, W_k, H_k)$ and pointer $(x_c, y_c)$:
Relative pointer coordinates:
$$u_k = x_c - X_k, \quad v_k = y_c - Y_k$$
Spotlight radial gradient:
$$\text{background} = \text{radial-gradient}(300\text{px at } u_k\text{px } v_k\text{px}, C_{spot}, \text{transparent } 80\%)$$
3D Tilt:
$$\text{rotX} = -\left(\frac{v_k}{H_k} - 0.5\right) \cdot 10^\circ, \quad \text{rotY} = \left(\frac{u_k}{W_k} - 0.5\right) \cdot 10^\circ$$

## 5. Interaction Mechanics
Moving mouse over the grid illuminates adjacent card borders and spotlights the active card.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Grid Container: Responsive grid with `grid-cols-1 md:grid-cols-3 lg:grid-cols-4`.
2. Global Pointer Listener: Update CSS variables `--mouse-x` and `--mouse-y` across all cards.
3. Border Glow: Dual-layer card with gradient background and `p-[1px]` border mask.
4. Tailwind Integration: Pure Tailwind CSS classes with CSS custom properties.

## 7. Modularity & File Organization
Organized into `MagicBento.tsx` (<120 LoC), `BentoCard.tsx` (<110 LoC), and `bentoStyles.ts` (<50 LoC).
