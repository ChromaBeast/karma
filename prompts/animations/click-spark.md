# Click Spark (Animations)

## 1. Overview & Visual Behavior
Click Spark produces an explosive burst of dynamic glowing sparks, star particles, or geometric embers radiating outward from pointer click coordinates with physics velocity and decay.

## 2. Props & Configuration Interface
```typescript
interface ClickSparkProps {
  /** Spark particle count per click (default: 12) */
  sparkCount?: number;
  /** Spark particle color or array of colors */
  sparkColor?: string | string[];
  /** Spark radius / size in pixels (default: 4) */
  sparkSize?: number;
  /** Spark burst radius in pixels (default: 60) */
  sparkDistance?: number;
  /** Animation duration in milliseconds (default: 500) */
  duration?: number;
  /** Children wrapped in spark trigger area */
  children: React.ReactNode;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Sparks burst outwards over $500	ext{ms}$ with rapid initial acceleration and cubic-bezier deceleration `(0.1, 0.9, 0.2, 1)`.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For spark $k \in [0, N-1]$ at click origin $(x_0, y_0)$:
Emission angle:
$$\theta_k = \frac{2\pi k}{N} + \text{rand}(-\Delta\theta, \Delta\theta)$$
Initial velocity $V_k = V_0 \cdot \text{rand}(0.8, 1.2)$.
Spark position over normalized progress $\tau \in [0, 1]$:
$$x_k(\tau) = x_0 + V_k \cdot \tau \cdot (2 - \tau) \cdot \cos\theta_k$$
$$y_k(\tau) = y_0 + V_k \cdot \tau \cdot (2 - \tau) \cdot \sin\theta_k + \frac{1}{2} g \tau^2$$
Spark size & opacity:
$$S_k(\tau) = S_0 \cdot (1 - \tau), \quad \alpha_k(\tau) = 1 - \tau^2$$

## 5. Interaction Mechanics
Triggers spark burst on every pointer down event.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Canvas / SVG Particle Pool: Reusable particle pool of 64 spark objects to avoid GC.
2. RAF Render Loop: Render active sparks on overlay canvas.
3. Symplectic Integration: Update spark positions and opacity until all sparks expire.
4. Auto Sleeping: Canvas sleeps when active spark count is 0.

## 7. Modularity & File Organization
Organized into `ClickSpark.tsx` (<120 LoC), `SparkPool.ts` (<100 LoC), and `sparkMath.ts` (<50 LoC).
