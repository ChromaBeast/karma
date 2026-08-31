# Gradient Text (Text Animations)

## 1. Overview & Visual Behavior
Gradient Text applies vibrant multi-stop linear or conic gradients to text glyphs, animating gradient angle rotation, color stop oscillation, and pulsing glow effects.

## 2. Props & Configuration Interface
```typescript
interface GradientTextProps {
  /** Text content */
  text: string;
  /** Array of CSS color stops (e.g. ['#ff007a', '#7928ca', '#4338ca']) */
  colors?: string[];
  /** Animation duration for full gradient rotation in seconds (default: 6s) */
  duration?: number;
  /** Gradient animation mode (default: 'linear-shift') */
  mode?: 'linear-shift' | 'conic-spin' | 'pulse';
  /** Optional drop-shadow glow behind text (default: false) */
  glow?: boolean;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Gradient translation rotates infinitely over period $T = 6.0\text{s}$ using smooth linear or sine keyframes.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For animated linear gradient angle $\theta(t)$:
$$\theta(t) = \theta_0 + 360^\circ \cdot \left(\frac{t \bmod T}{T}\right)$$
Linear gradient color mapping:
$$\text{background} = \text{linear-gradient}(\theta(t), c_1 \ 0\%, c_2 \ 50\%, c_3 \ 100\%)$$
Glow drop shadow:
$$\text{filter: drop-shadow}(0\text{px } 0\text{px } 15\text{px } c_{active})$$

## 5. Interaction Mechanics
Pointers accelerate gradient rotation speed or shift color hue toward cursor angle.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. CSS Background Clip: `background-clip: text; -webkit-background-clip: text; color: transparent`.
2. CSS Variable Animation: Animate `--gradient-angle` or `background-position` with `@property`.
3. Glow Layer: Duplicate text element with `blur(16px)` and reduced opacity for neon bloom.
4. Zero Dependency: Pure Tailwind CSS classes and CSS custom properties.

## 7. Modularity & File Organization
Decompose into `GradientText.tsx` (<100 LoC) and `gradientPresets.ts` (<60 LoC).
