# Dock (Components)

## 1. Overview & Visual Behavior
Dock emulates the macOS application dock with smooth mouse proximity magnification, cosine wave scaling, bounce badges, and tooltips.

## 2. Props & Configuration Interface
```typescript
interface DockProps {
  /** Array of dock items */
  items: { id: string; icon: React.ReactNode; label: string; onClick?: () => void }[];
  /** Base icon size in pixels (default: 48) */
  iconSize?: number;
  /** Maximum magnified icon size in pixels (default: 80) */
  maxIconSize?: number;
  /** Proximity influence distance in pixels (default: 150) */
  distance?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Icon scaling updates at 60/120 FPS with zero latency. Active app click bounce period $T = 400\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For icon $i$ at horizontal center $x_i$ and mouse position $x_m$:
Distance:
$$d_i = |x_i - x_m|$$
Cosine Bell Curve Magnification ($d_i < D$):
$$S_i = S_{base} + (S_{max} - S_{base}) \cdot \cos^2\left(\frac{\pi d_i}{2D}\right)$$
$$S_i = S_{base} \quad \text{if } d_i \ge D$$

## 5. Interaction Mechanics
Icons magnify dynamically as mouse sweeps horizontally along dock. Clicking an icon triggers vertical bounce.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dock Container: `rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 p-2 flex items-end`.
2. Proximity Tracker: Track `clientX` and compute each icon's width/height in RAF loop.
3. WAAPI Bounce: Click triggers `@keyframes dock-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }`.
4. Tooltips: Animated tooltip appears above hovered icon.

## 7. Modularity & File Organization
Decompose into `Dock.tsx` (<120 LoC), `DockItem.tsx` (<90 LoC), and `dockMath.ts` (<50 LoC).
