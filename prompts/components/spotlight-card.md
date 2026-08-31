# Spotlight Card (Components)

## 1. Overview & Visual Behavior
Spotlight Card illuminates card content with a dynamic radial spotlight halo tracking cursor coordinates, rendering subtle specular border highlights.

## 2. Props & Configuration Interface
```typescript
interface SpotlightCardProps {
  /** Card children */
  children: React.ReactNode;
  /** Spotlight halo color (default: 'rgba(255, 255, 255, 0.1)') */
  spotlightColor?: string;
  /** Spotlight radius in pixels (default: 250) */
  radius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Spotlight tracks cursor in real-time at 60/120 FPS. Fades in on mouse enter ($150\text{ms}$) and fades out on mouse leave ($300\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer offset $(x_c, y_c)$ relative to card:
Spotlight radial gradient:
$$\text{background} = \text{radial-gradient}(R\text{px at } x_c\text{px } y_c\text{px}, C_{spot}, \text{transparent } 80\%)$$

## 5. Interaction Mechanics
Smoothly highlights card surface under mouse. Sibling cards stay dim.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Relative Card Wrapper: `relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900`.
2. Spotlight Overlay: Absolute div with `pointer-events: none` and dynamic inline background.
3. CSS Custom Properties: Update `--mouse-x` and `--mouse-y` on pointer move.
4. Tailwind Integration: Pure Tailwind CSS classes.

## 7. Modularity & File Organization
Decompose into `SpotlightCard.tsx` (<110 LoC) and `spotlightStyles.ts` (<50 LoC).
