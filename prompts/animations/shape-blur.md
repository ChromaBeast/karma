# Shape Blur (Animations)

## 1. Overview & Visual Behavior
Shape Blur animates geometric SVG polygons and circles morphing, orbiting, and blurring into dreamy ambient background light blobs and color gradients.

## 2. Props & Configuration Interface
```typescript
interface ShapeBlurProps {
  /** Array of blur shape configurations (color, radius, speed) */
  shapes?: { color: string; radius: number; speed: number; x: number; y: number }[];
  /** Global blur radius in pixels (default: 60) */
  blurRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous orbital oscillation with periods $T_i \in [6	ext{s}, 14	ext{s}]$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For shape $k$ with orbital center $(x_{0,k}, y_{0,k})$:
$$x_k(t) = x_{0,k} + R_{orb} \cdot \cos(\omega_k t + \phi_k)$$
$$y_k(t) = y_{0,k} + R_{orb} \cdot \sin(\omega_k t + \phi_k)$$
Gaussian blur convolution:
$$G(x, y) = \frac{1}{2\pi\sigma^2} \exp\left(-\frac{x^2 + y^2}{2\sigma^2}\right)$$

## 5. Interaction Mechanics
Shapes gently repel from mouse cursor coordinates.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG / HTML Blob Elements: Render `div` circles with dynamic inline background gradients.
2. Container Blur: Outer wrapper with `filter: blur(60px); overflow: hidden`.
3. GPU Transforms: Animate `translate3d` with CSS keyframes to prevent CPU rasterization.
4. Composite Layer: `will-change: transform` on all animated shape nodes.

## 7. Modularity & File Organization
Organized into `ShapeBlur.tsx` (<110 LoC) and `shapeStyles.ts` (<60 LoC).
