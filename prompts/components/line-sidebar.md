# Line Sidebar (Components)

## 1. Overview & Visual Behavior
Line Sidebar renders a minimalist navigation sidebar with an animated indicator pill that slides and morphs smoothly along a vertical vector track following the active route.

## 2. Props & Configuration Interface
```typescript
interface LineSidebarProps {
  /** Navigation items */
  items: { id: string; label: string; icon?: React.ReactNode; href?: string }[];
  /** Active item ID */
  activeId: string;
  /** On item select callback */
  onSelect: (id: string) => void;
  /** Sidebar collapsed state (default: false) */
  collapsed?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Active indicator pill slides between items over $300\text{ms}$ using `cubic-bezier(0.2, 0.8, 0.2, 1)`. Pill stretches during transit.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Indicator pill position $(y_p, h_p)$ interpolates from item $A$ to item $B$:
$$y_p(t) = \text{lerp}(y_A, y_B, f(\tau))$$
Velocity stretch height:
$$h_p(\tau) = H_{base} + |y_B - y_A| \cdot \sin(\pi \tau) \cdot 0.3$$

## 5. Interaction Mechanics
Clicking any item animates indicator smoothly. Hovering shows preview glow.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Measured Item Bounds: Store `offsetTop` and `offsetHeight` of each nav item.
2. Floating Indicator: Absolutely positioned indicator pill with `transition: transform, height`.
3. Collapsible Mode: Collapse labels smoothly with `overflow-hidden` and opacity transition.
4. ARIA Navigation: Standard `<nav>` element with `aria-current=\"page\"`.

## 7. Modularity & File Organization
Organized into `LineSidebar.tsx` (<120 LoC), `SidebarItem.tsx` (<90 LoC), and `sidebarStyles.ts` (<50 LoC).
