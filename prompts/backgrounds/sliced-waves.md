# Sliced Waves (Backgrounds)

## 1. Overview & Visual Behavior
Sliced Waves renders horizontal or vertical sliced geometric bands that shift, phase, and undulate with offset sine wave rhythms and gradient textures.

## 2. Props & Configuration Interface
```typescript
interface SlicedWavesProps {
  /** Number of sliced strips (default: 12) */
  sliceCount?: number;
  /** Phase offset between adjacent slices (default: 0.3) */
  phaseOffset?: number;
  /** Color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous wave phasing at 60 FPS with harmonic oscillation.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For slice strip $k \in [0, N-1]$:
Horizontal translation offset:
$$X_k(t) = A \cdot \sin(\omega t + k \cdot \Delta\phi)$$
Slice height and vertical positioning:
$$H_{slice} = \frac{H_{container}}{N}, \quad Y_k = k \cdot H_{slice}$$

## 5. Interaction Mechanics
Hovering mouse over specific slices triggers localized harmonic wave ripples.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. DOM Slice Strips: Container with $N$ flex/absolute slices.
2. GPU Transforms: Animate `transform: translate3d(X, 0, 0)` with CSS custom properties.
3. Background Parallax: Shift background gradient coordinates inside each slice.
4. Tailwind Integration: Pure Tailwind CSS classes.

## 7. Modularity & File Organization
Organized into `SlicedWaves.tsx` (<120 LoC) and `sliceStyles.ts` (<50 LoC).
