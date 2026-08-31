# Scroll Float (Text Animations)

## 1. Overview & Visual Behavior
Scroll Float animates text characters floating upwards into place with buoyant parallax, soft scaling, and inertia based on viewport scroll progress and velocity.

## 2. Props & Configuration Interface
```typescript
interface ScrollFloatProps {
  /** Text content */
  text: string;
  /** Float travel distance in pixels (default: 80) */
  distance?: number;
  /** Stagger delay between sequential characters in milliseconds (default: 25) */
  stagger?: number;
  /** Spring stiffness coefficient k (default: 120) */
  stiffness?: number;
  /** Damping coefficient c (default: 14) */
  damping?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Spring settling duration $\approx 600\text{ms}$ with critically damped response to scroll velocity changes.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Scroll progress $p \in [0, 1]$ relative to viewport entry:
$$p = \text{clamp}\left(\frac{Y_{scroll} + H_{view} - Y_{top}}{H_{view} + H_{elem}}, 0, 1\right)$$
For character $i$:
$$y_i(p) = \text{distance} \cdot (1 - p)^{1.5} \cdot \left(1 + i \cdot 0.05\right)$$
$$\alpha_i(p) = \text{clamp}(p \cdot 2 - i \cdot 0.02, 0, 1)$$
$$\text{rotate}_i(p) = (1 - p) \cdot (-1)^i \cdot 8^\circ$$

## 5. Interaction Mechanics
Binds to window scroll events via passive listener or `useScroll` hook. Reacts with extra bounce to high-velocity scrolling.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Character Mapping: Render character spans with `display: inline-block; will-change: transform, opacity`.
2. Scroll Listener: Compute scroll progress in `requestAnimationFrame` to avoid main thread jank.
3. Spring Physics: Smooth character transforms via spring accumulator.
4. Intersection Guard: Deactivate scroll calculation when element is outside viewport.

## 7. Modularity & File Organization
Organized into `ScrollFloat.tsx` (<120 LoC), `useScrollProgress.ts` (<90 LoC), and `floatSprings.ts` (<60 LoC).
