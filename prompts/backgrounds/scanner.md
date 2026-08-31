# Scanner (Backgrounds)

## 1. Overview & Visual Behavior
Scanner simulates a high-tech sci-fi holographic laser scanning grid that sweeps across the viewport with radar sweep sweeps, illuminated nodes, and HUD overlays.

## 2. Props & Configuration Interface
```typescript
interface ScannerProps {
  /** Laser line color (default: '#00ffcc') */
  laserColor?: string;
  /** Sweep duration across screen in seconds (default: 3.5s) */
  duration?: number;
  /** Grid cell spacing in pixels (default: 32) */
  gridSize?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Continuous laser sweep cycles across viewport every $3.5\text{s}$ linearly.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Vertical laser position $Y_{laser}(t)$:
$$Y_{laser}(t) = (V \cdot t) \bmod H_{view}$$
Grid intersection node activation for grid point $(x_i, y_j)$:
$$\alpha_{i,j}(t) = \exp\left(-\frac{(y_j - Y_{laser}(t))^2}{2\sigma^2}\right)$$
Laser beam trailing gradient:
$$\text{gradient} = \text{linear-gradient}(\text{to top}, C_{laser} \ 0\%, \text{transparent } 80\text{px})$$

## 5. Interaction Mechanics
Clicking screen leaves a radar ping marker that radiates expanding pulse rings.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dual Canvas Layers: Background grid canvas + animated laser sweep beam.
2. Particle Pings: Dynamic ring pulse emitter on user pointer clicks.
3. GPU Acceleration: Sweep beam positioned via `transform: translate3d(0, y, 0)`.
4. Low CPU Overhead: Grid rendered once into static bitmap cache.

## 7. Modularity & File Organization
Organized into `Scanner.tsx` (<120 LoC), `ScannerEngine.ts` (<130 LoC), and `scannerMath.ts` (<50 LoC).
