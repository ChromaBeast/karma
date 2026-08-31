# Beams (Backgrounds)

## 1. Overview & Visual Behavior
Beams renders intersecting diagonal laser light beams that sweep across a dark grid with glowing particle sparks at intersection points.

## 2. Props & Configuration Interface
```typescript
interface BeamsProps {
  /** Beam count (default: 8) */
  beamCount?: number;
  /** Beam color palette */
  colors?: string[];
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous beam circulation over period $T = 6.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For beam $k$ with trajectory line $\vec{L}_k(t)$:
Beam position:
$$\vec{p}_k(t) = \vec{P}_{0,k} + \vec{v}_k t$$
Intersection spark condition for beams $(i, j)$:
$$\vec{P}_{int} = \vec{L}_i \cap \vec{L}_j$$

## 5. Interaction Mechanics
Mouse cursor acts as an optical beam splitter, refracting beams into new angles.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / SVG Paths: Render linear laser beam strokes with glow drop-shadow.
2. Spark Emitters: Spawn particle sparks when beams cross.
3. Additive Blending: `globalCompositeOperation: 'lighter'`.
4. High Performance: Low particle count with strict memory pooling.

## 7. Modularity & File Organization
Organized into `Beams.tsx` (<120 LoC), `BeamEngine.ts` (<120 LoC), and `beamMath.ts` (<50 LoC).
