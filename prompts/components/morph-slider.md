# Morph Slider (Components)

## 1. Overview & Visual Behavior
Morph Slider smoothly interpolates geometric SVG clip-paths, morphing backgrounds, and typography between slider slides with liquid organic transitions.

## 2. Props & Configuration Interface
```typescript
interface MorphSliderProps {
  /** Array of slide configurations */
  slides: { id: string; title: string; image: string; description?: string }[];
  /** Transition duration in milliseconds (default: 700) */
  duration?: number;
  /** Morph path style preset (default: 'liquid-blob') */
  morphPreset?: 'liquid-blob' | 'geometric-polygon' | 'curved-wave';
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Morphing transition takes $700\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. SVG spline control points animate synchronously.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Bézier control point vector interpolation for path $P(t)$:
$$\vec{P}(t) = (1 - f(\tau)) \vec{P}_{from} + f(\tau) \vec{P}_{to}$$
where $\tau = \text{clamp}\left(\frac{t - t_0}{T}, 0, 1\right)$ and $f(\tau) = 3\tau^2 - 2\tau^3$.
Liquid blob radius modulation:
$$R(\theta, t) = R_0 \cdot \left(1 + \sum_{k=2}^4 A_k \sin(k \theta + \phi_k(t))\right)$$

## 5. Interaction Mechanics
Slide navigation buttons or swipe gestures trigger morph transition. Hovering preview bubbles previews slide.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Morphing SVG ClipPath: Render `<clipPath id=\"morph-clip\"><path d=\"...\">` bound to slide image.
2. WAAPI Path Interpolation: Animate `d` attribute using SMIL or Canvas 2D morph buffer.
3. Staggered Text: Coordinate headline typography unmasking with path expansion.
4. Fallback: Simple crossfade on browsers without path interpolation support.

## 7. Modularity & File Organization
Organized into `MorphSlider.tsx` (<120 LoC), `useMorphPath.ts` (<100 LoC), and `morphPresets.ts` (<60 LoC).
