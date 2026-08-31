# Evil Eye (Backgrounds)

## 1. Overview & Visual Behavior
Evil Eye renders a mystical talismanic eye background with pupil dilation, iris ripples, and protective concentric aura rings tracking the cursor.

## 2. Props & Configuration Interface
```typescript
interface EvilEyeProps {
  /** Eye radius in pixels (default: 140) */
  eyeRadius?: number;
  /** Iris color */
  irisColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Pupil tracking responds at 60/120 FPS via lerp. Eyelid blink triggers sporadically every $4\text{s}$ ($200\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pupil offset vector $(\Delta x_p, \Delta y_p)$ tracking cursor $(x_c, y_c)$:
$$\vec{d} = (x_c - X_0, \ y_c - Y_0), \quad r = \|\vec{d}\|$$
$$(\Delta x_p, \Delta y_p) = \frac{\vec{d}}{r} \cdot \min(r \cdot 0.2, \ R_{iris} - R_{pupil})$$
Eyelid clip path on blink:
$$\text{clip-path: ellipse}(W/2 \ (H/2 \cdot (1 - \text{blinkProgress}))\text{ at } 50\%\ 50\%)$$

## 5. Interaction Mechanics
Eye pupil follows pointer movement across the entire screen.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. SVG Eye Hierarchy: Outer sclera + iris ring + pupil + eyelid clip path.
2. Pupil Lerp: Smooth position interpolation in RAF loop.
3. Blink Scheduler: Randomized `setTimeout` triggering CSS keyframe blink.
4. Ambient Aura: Concentric pulsating SVG rings.

## 7. Modularity & File Organization
Decompose into `EvilEye.tsx` (<120 LoC) and `eyeStyles.ts` (<50 LoC).
