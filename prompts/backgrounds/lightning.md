# Lightning (Backgrounds)

## 1. Overview & Visual Behavior
Lightning renders procedural branching electric lightning bolts that strike and flash across a dark storm background with intense neon luminance.

## 2. Props & Configuration Interface
```typescript
interface LightningProps {
  /** Bolt color (default: '#00f0ff') */
  boltColor?: string;
  /** Strike frequency interval in seconds (default: 3s) */
  strikeInterval?: number;
  /** Branching recursion depth (default: 4) */
  branchDepth?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Lightning flash lasts $150\text{ms}$ to $300\text{ms}$ with micro-flickers. Strikes occur at randomized intervals.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Midpoint Displacement Fractal Lightning between $\vec{A}$ and $\vec{B}$:
$$\vec{M} = \frac{\vec{A} + \vec{B}}{2} + \vec{n} \cdot \text{rand}(-D, D)$$
where $\vec{n} \perp (\vec{B} - \vec{A})$ and displacement $D$ decays by factor $0.5$ per recursion level.
Flash background illumination:
$$\alpha_{flash}(t) = \exp(-t / \tau_{decay}) \cdot (1 + \text{flicker})$$

## 5. Interaction Mechanics
Clicking screen triggers an immediate lightning strike targeted at click coordinates.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Midpoint Subdivision Engine: Recursive fractal generator building segment array.
2. Multi-Layer Glow: Draw core white bolt + cyan outer glow + ambient screen flash.
3. Sound Sync: Optional audio strike trigger hook.
4. Low CPU: Canvas sleeps between strikes.

## 7. Modularity & File Organization
Organized into `Lightning.tsx` (<120 LoC), `LightningGenerator.ts` (<130 LoC), and `lightningMath.ts` (<50 LoC).
