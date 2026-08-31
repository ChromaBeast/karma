# Split Flap Text (Text Animations)

## 1. Overview & Visual Behavior
Split Flap Text replicates retro mechanical airport/train departures boards with 3D cascading split-flap cards. Features split top/bottom character tiles, 3D perspective fold rotation, authentic shadow gradients, and staggered character flipping.

## 2. Props & Configuration Interface
```typescript
interface SplitFlapTextProps {
  /** Target text string to display */
  text: string;
  /** Character set available for mechanical flipping (default: alphanumeric + symbols) */
  charset?: string;
  /** Stagger delay between successive character columns in milliseconds (default: 80) */
  stagger?: number;
  /** Flip animation duration per character step in milliseconds (default: 120) */
  flipDuration?: number;
  /** Number of intermediate flips before settling on target (default: 5) */
  flipsPerChar?: number;
  /** 3D perspective depth in pixels (default: 600) */
  perspective?: number;
  /** Custom CSS classes */
  className?: string;
  /** Character card background color */
  cardColor?: string;
  /** Text color */
  textColor?: string;
}
```

## 3. Animation Specifications & Timing
Each individual half-flap rotates $180^\circ$ across two phases of $60\text{ms}$ ($120\text{ms}$ total per flip step). Sequential characters start with an $80\text{ms}$ cascade delay.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
The 3D card rotation angle $\theta(t)$ over normalized step time $\tau \in [0, 1]$ is:
$$\theta(\tau) = 180^\circ \cdot \tau$$
Phase 1 (Top half folding down from $0^\circ$ to $90^\circ$):
$$\text{transform: rotateX}(-\theta_1), \quad \theta_1 \in [0^\circ, 90^\circ]$$
$$\text{shadow opacity: } S_1 = \sin(\theta_1) \cdot 0.6$$
Phase 2 (Bottom half dropping from $-90^\circ$ to $0^\circ$):
$$\text{transform: rotateX}(\theta_2), \quad \theta_2 \in [-90^\circ, 0^\circ]$$
$$\text{shadow opacity: } S_2 = \cos(\theta_2) \cdot 0.6$$

## 5. Interaction Mechanics
Triggers flip sequences whenever `text` prop changes. Supports hover-triggered preview flip. Accessible hidden `<span>` contains the current target string for screen readers.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Tile Hierarchy: Each character column consists of static top/bottom halves and dynamic 3D folding top/bottom cards.
2. CSS 3D Transforms: Apply `perspective: 600px`, `transform-style: preserve-3d`, and `transform-origin: bottom` on top flap.
3. Audio/Haptic sync: Optional audio tick event synchronized at flip midpoint ($90^\circ$).
4. Reduced Motion: Instant character change without 3D rotation if `prefers-reduced-motion` is enabled.

## 7. Modularity & File Organization
Decompose into `SplitFlapText.tsx` (<120 LoC), `SplitFlapColumn.tsx` (<130 LoC), `useSplitFlapController.ts` (<80 LoC), and `flapStyles.ts` (<50 LoC).
