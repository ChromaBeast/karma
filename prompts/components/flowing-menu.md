# Flowing Menu (Components)

## 1. Overview & Visual Behavior
Flowing Menu displays full-width editorial navigation menu rows where hovering any row reveals a continuous flowing circular marquee ribbon and floating preview imagery.

## 2. Props & Configuration Interface
```typescript
interface FlowingMenuProps {
  /** Menu items */
  items: { id: string; text: string; image: string; link?: string }[];
  /** Marquee flow speed in pixels/sec (default: 80) */
  speed?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Row expansion takes $300\text{ms}$. Flowing marquee runs continuously at $80\text{px/s}$. Floating image follows mouse with $16\text{ms}$ lerp.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Floating image coordinates $(x_{img}, y_{img})$ smoothed via lerp:
$$(x_{img}(t), y_{img}(t)) = \text{lerp}((x_{img}(t-1), y_{img}(t-1)), (x_{mouse}, y_{mouse}), 0.2)$$
Row marquee translation:
$$X_{marquee}(t) = (V \cdot t) \bmod W_{text}$$

## 5. Interaction Mechanics
Hovering a row opens marquee text flow and displays floating cursor image preview.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Menu Row Structure: Flex row with hidden overflow marquee sub-layer.
2. Floating Image Portal: Fixed position image follower attached to mouse.
3. CSS Keyframe Marquee: Horizontal infinite translation ribbon.
4. Clean Exit: Smoothly collapses row and fades image preview on mouse leave.

## 7. Modularity & File Organization
Decompose into `FlowingMenu.tsx` (<120 LoC), `FlowingMenuItem.tsx` (<100 LoC), and `flowingMenuStyles.ts` (<50 LoC).
