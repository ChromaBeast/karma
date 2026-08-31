# Stepper (Components)

## 1. Overview & Visual Behavior
Stepper renders an interactive multi-step workflow progress bar with animated step nodes, glowing connection lines, checkmark draws, and step transitions.

## 2. Props & Configuration Interface
```typescript
interface StepperProps {
  /** Array of step configurations */
  steps: { id: string; title: string; description?: string }[];
  /** Currently active step index (0-based) */
  activeStep: number;
  /** On step click callback (if steps are directly navigable) */
  onStepClick?: (index: number) => void;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Connection line fill progress transitions over $350\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. Step node checkmark draws over $200\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For step $k \in [0, N-1]$:
Connection line fill width between step $k$ and $k+1$:
$$W_{fill}(k) = \begin{cases} 100\% & \text{if } k < \text{activeStep} \\ p(t) \cdot 100\% & \text{if } k = \text{activeStep} \\ 0\% & \text{if } k > \text{activeStep} \end{cases}$$
Checkmark SVG draw:
$$\text{stroke-dashoffset} = L_{check} \cdot (1 - f(\tau))$$

## 5. Interaction Mechanics
Step status updates as user completes workflow phases. Completed steps clickable for fast backtracking.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Stepper Bar: Flex container with step node badges and connecting progress bars.
2. SVG Progress Lines: Animate `scaleX` or `width` of connecting fill bar.
3. Checkmark Animation: Animate SVG path `stroke-dashoffset` from length to 0.
4. ARIA Stepper: `aria-current=\"step\"` on active node with accessible progress bar markup.

## 7. Modularity & File Organization
Decompose into `Stepper.tsx` (<120 LoC), `StepNode.tsx` (<90 LoC), and `stepperStyles.ts` (<40 LoC).
