# Radar (Backgrounds)

## 1. Overview & Visual Behavior
Radar renders a circular tactical radar sweep with concentric range rings, rotating sweep line, fading blips, and HUD grid readouts.

## 2. Props & Configuration Interface
```typescript
interface RadarProps {
  /** Radar diameter in pixels (default: 400) */
  size?: number;
  /** Sweep rotation period in seconds (default: 4s) */
  speed?: number;
  /** Radar green / cyan stroke color */
  color?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous $360^\circ$ radar sweep over period $T = 4.0\text{s}$. Blips fade over $2.0\text{s}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Sweep Angle:
$$\theta_{sweep}(t) = \left(\frac{2\pi t}{T}\right) \bmod 2\pi$$
Blip Detection Condition for target at angle $\theta_{blip}$:
$$\Delta\theta = (\theta_{sweep}(t) - \theta_{blip}) \bmod 2\pi$$
$$\alpha_{blip}(t) = \exp\left(-\frac{\Delta\theta}{\tau_{decay}}\right)$$

## 5. Interaction Mechanics
Clicking radar spawns interactive blips that illuminate on subsequent sweeps.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas 2D / SVG: Concentric range rings + crosshairs + sweep line.
2. Conic Sweep Sector: Conic gradient sector fading from $100\%$ to $0\%$ opacity behind sweep line.
3. Blip Array: Store active target coordinates and activation timestamps.
4. Pure Native Canvas: Zero external libraries.

## 7. Modularity & File Organization
Decompose into `Radar.tsx` (<120 LoC) and `RadarEngine.ts` (<120 LoC).
