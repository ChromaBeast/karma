# Staggered Menu (Components)

## 1. Overview & Visual Behavior
Staggered Menu renders an editorial full-screen or slide-out menu where navigation links, numbers, and background color blocks stagger into place with magnetic hover states.

## 2. Props & Configuration Interface
```typescript
interface StaggeredMenuProps {
  /** Navigation links */
  links: { id: string; label: string; href?: string; subtitle?: string }[];
  /** Menu open state */
  isOpen: boolean;
  /** Close menu callback */
  onClose: () => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Menu slides in over $500\text{ms}$ with `cubic-bezier(0.16, 1, 0.3, 1)`. Links stagger in with $40\text{ms}$ offsets.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For link $k \in [0, N-1]$:
Stagger start time $t_{start, k} = k \cdot 40\text{ms}$.
Link translation and opacity:
$$y_k(t) = 40\text{px} \cdot (1 - f(\tau_k))$$
$$\alpha_k(t) = f(\tau_k)$$
where $f(\tau) = 1 - (1 - \tau)^4$.
Magnetic pointer offset on hover:
$$\Delta x = (x_{mouse} - X_{link}) \cdot 0.15$$

## 5. Interaction Mechanics
Hovering links triggers magnetic pull and reveals background image preview.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Full-Screen Portal: Render menu in React portal with top z-index.
2. WAAPI Stagger Engine: Stagger text unmasking using `translateY(100%) -> translateY(0%)`.
3. Background Preview: Dynamic image crossfade when hovering links.
4. Focus Trapping: Automatic keyboard focus trapping when open.

## 7. Modularity & File Organization
Decompose into `StaggeredMenu.tsx` (<130 LoC), `MenuLinkItem.tsx` (<90 LoC), and `menuStyles.ts` (<50 LoC).
