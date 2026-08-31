# Gooey Nav (Components)

## 1. Overview & Visual Behavior
Gooey Nav renders a liquid navigation bar where the active indicator droplet stretches, detaches, and snaps elastically between menu items using SVG gooey filter contrast.

## 2. Props & Configuration Interface
```typescript
interface GooeyNavProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; icon?: React.ReactNode }[];
  /** Active link ID */
  activeId: string;
  /** On select callback */
  onSelect: (id: string) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Gooey indicator travels between tabs over $400\text{ms}$ with spring overshoot `(0.34, 1.4, 0.64, 1)`. Liquid droplet snaps apart at $t = 0.5T$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Liquid droplet connection bridge thickness:
$$w_{bridge}(\tau) = w_0 \cdot \sin(\pi \tau) \quad \text{for } \tau \in [0, 1]$$
SVG Matrix Contrast:
$$\begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 20 & -10 \end{pmatrix}$$

## 5. Interaction Mechanics
Clicking any menu item shoots a liquid gooey bubble that stretches across to the new target tab.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Filter Defs: Render hidden SVG with `<feGaussianBlur>` and `<feColorMatrix>`.
2. Gooey Container: Wrap indicator and tab items inside `filter: url(#gooey-filter)`.
3. Dual Droplet Animation: Origin droplet shrinks while destination droplet expands.
4. Screen Reader Access: Standard navigation semantics retained.

## 7. Modularity & File Organization
Organized into `GooeyNav.tsx` (<120 LoC), `GooeyFilter.tsx` (<60 LoC), and `gooeyStyles.ts` (<50 LoC).
