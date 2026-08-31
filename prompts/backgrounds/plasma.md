# Plasma (Backgrounds)

## 1. Overview & Visual Behavior
Plasma renders a classic demoscene procedural plasma effect with swirling trigonometric color fields, RGB cycling, and interference patterns.

## 2. Props & Configuration Interface
```typescript
interface PlasmaProps {
  /** Color cycle speed (default: 1.0) */
  speed?: number;
  /** Plasma wave frequency scale (default: 0.02) */
  scale?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous plasma color cycling at 60 FPS.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Classic Demoscene Plasma Equation $P(x, y, t)$:
$$v_1 = \sin\left(\frac{x}{16} + t\right), \quad v_2 = \sin\left(\frac{y}{8} + t\right)$$
$$v_3 = \sin\left(\frac{x + y}{16} + t\right), \quad v_4 = \sin\left(\sqrt{x^2 + y^2} \cdot 0.05 + 1.5 t\right)$$
$$P(x, y, t) = \frac{v_1 + v_2 + v_3 + v_4}{4}$$
Color mapping:
$$R = \sin(P \pi), \quad G = \sin(P \pi + 2\pi/3), \quad B = \sin(P \pi + 4\pi/3)$$

## 5. Interaction Mechanics
Mouse pointer creates an additional circular distortion ripple.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL Fragment Shader / Canvas 2D: Calculates plasma equation per pixel.
2. Low-Resolution Render Target: Renders at $160 \times 100$ and upscales with bilinear filtering.
3. Fast Trig Lookups: Precomputed sine lookup tables on CPU if using Canvas 2D.
4. Low CPU: $<2\%$ utilization on modern hardware.

## 7. Modularity & File Organization
Organized into `Plasma.tsx` (<110 LoC), `PlasmaShader.ts` (<120 LoC), and `plasmaMath.ts` (<50 LoC).
