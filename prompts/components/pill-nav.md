# Pill Nav (Components)

## 1. Overview & Visual Behavior
Pill Nav renders a floating capsule navigation bar with an animated magnetic pill indicator, backdrop blur, glowing active states, and route switching.

## 2. Props & Configuration Interface
```typescript
interface PillNavProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; icon?: React.ReactNode }[];
  /** Active link ID */
  activeId: string;
  /** On link select callback */
  onSelect: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pill indicator transitions between tabs in $250\text{ms}$ with `cubic-bezier(0.2, 0.9, 0.3, 1)`. Capsule stretches slightly during transit.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Indicator bounding box $(x(t), w(t))$:
$$x(t) = \text{lerp}(x_1, x_2, f(\tau)), \quad w(t) = \text{lerp}(w_1, w_2, f(\tau))$$
where $f(\tau) = 1 - (1 - \tau)^4$ (quartic ease-out).
Glow spotlight:
$$\text{background} = \text{radial-gradient}(80\text{px at } x_{indicator}\text{px } 50\%, C_{glow}, \text{transparent } 80\%)$$

## 5. Interaction Mechanics
Clicking any tab slides pill indicator. Hovering previews ghost indicator.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Capsule Wrapper: `rounded-full backdrop-blur-md bg-black/40 border border-white/10 p-1 flex items-center`.
2. Sliding Indicator: Absolute positioned `rounded-full bg-white/10` with `transition: transform, width`.
3. Ref Measurements: Measure active tab element offset via `getBoundingClientRect()`.
4. Keyboard Navigation: Left/Right arrow keys navigate tabs with automatic focus management.

## 7. Modularity & File Organization
Organized into `PillNav.tsx` (<120 LoC), `PillItem.tsx` (<80 LoC), and `pillNavStyles.ts` (<50 LoC).
