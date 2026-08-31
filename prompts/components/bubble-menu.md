# Bubble Menu (Components)

## 1. Overview & Visual Behavior
Bubble Menu renders an expandable floating action menu where radial bubble buttons pop outward with elastic spring physics, staggered delays, and backdrop blur.

## 2. Props & Configuration Interface
```typescript
interface BubbleMenuProps {
  /** Main trigger button icon / content */
  triggerContent: React.ReactNode;
  /** Array of menu item actions */
  items: { id: string; icon: React.ReactNode; label?: string; onClick?: () => void }[];
  /** Radial expansion radius in pixels (default: 90) */
  radius?: number;
  /** Expansion angle arc range [startAngle, endAngle] in degrees (default: [180, 270]) */
  angleRange?: [number, number];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Bubbles pop open over $400\text{ms}$ with spring overshoot (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Stagger interval is $30\text{ms}$ per bubble.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ bubbles with angular span $[\theta_1, \theta_2]$:
Bubble $i$ target angle:
$$\theta_i = \theta_1 + i \cdot \frac{\theta_2 - \theta_1}{N - 1}$$
Radial position during expansion progress $\tau_i(t) \in [0, 1]$:
$$f(\tau) = 1 + c_3(\tau - 1)^3 + c_1(\tau - 1)^2 \quad (\text{back ease-out})$$
$$x_i(\tau) = R \cdot \cos(\theta_i) \cdot f(\tau_i)$$
$$y_i(\tau) = R \cdot \sin(\theta_i) \cdot f(\tau_i)$$

## 5. Interaction Mechanics
Clicking main bubble toggles menu expansion. Hovering over sub-bubbles displays tooltips.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Fixed Floating Wrapper: Positioned in viewport corner with `z-index: 50`.
2. Staggered WAAPI: Animate `transform: translate3d(x, y, 0) scale(1)` with calculated delays.
3. Escape Key Listener: Closes menu automatically when user presses Escape.
4. Click Outside: Closes menu when clicking outside bounding radius.

## 7. Modularity & File Organization
Decompose into `BubbleMenu.tsx` (<120 LoC), `BubbleItem.tsx` (<90 LoC), and `bubbleMath.ts` (<50 LoC).
