# Border Glow (Components)

## 1. Overview & Visual Behavior
Border Glow renders a dynamic glowing perimeter border that circulates or follows mouse coordinates around card perimeters with neon gradient luminance.

## 2. Props & Configuration Interface
```typescript
interface BorderGlowProps {
  /** Content wrapped in glowing border */
  children: React.ReactNode;
  /** Border glow color or gradient stops */
  glowColor?: string;
  /** Border thickness in pixels (default: 2) */
  borderWidth?: number;
  /** Corner radius in pixels (default: 16) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Circulating border glow cycles continuously over period $T = 4.0\text{s}$. Pointer-following mode updates at 60/120 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Conic gradient border angle $\theta(t)$:
$$\theta(t) = \left(\frac{t}{T}\right) \cdot 360^\circ$$
$$\text{background} = \text{conic-gradient}(\text{from } \theta(t)\text{deg}, \text{transparent } 0^\circ, C_{glow} \ 45^\circ, \text{transparent } 90^\circ)$$
Masking equation to retain only border perimeter:
$$\text{mask} = \text{linear-gradient}(\#\text{fff } 0\ 0)\text{ content-box, linear-gradient}(\#\text{fff } 0\ 0)$$
$$\text{mask-composite: exclude}$$

## 5. Interaction Mechanics
Glow speed accelerates and brightens on hover.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual-Layer Mask: Inner content container + animated border gradient pseudo-element.
2. CSS Conic Gradient: Animated `@keyframes border-spin` rotating gradient angle.
3. Mask Composite: Exclude content-box from border-box to create razor-sharp border stroke.
4. Performance: Composite thread animation with zero repaint cost.

## 7. Modularity & File Organization
Organized into `BorderGlow.tsx` (<110 LoC) and `borderGlowStyles.ts` (<50 LoC).
