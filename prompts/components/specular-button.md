# Specular Button (Components)

## 1. Overview & Visual Behavior
Specular Button renders a sleek glassmorphic action button with dynamic 3D specular light reflections, glowing border gradients, and physical click depression.

## 2. Props & Configuration Interface
```typescript
interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label or children */
  children: React.ReactNode;
  /** Specular light sheen color (default: 'rgba(255, 255, 255, 0.7)') */
  sheenColor?: string;
  /** Border glow color (default: '#6366f1') */
  glowColor?: string;
  /** Button corner radius in pixels (default: 12) */
  borderRadius?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Specular reflection tracks pointer at 60/120 FPS. Click compression has $120\text{ms}$ ease-out rise and $200\text{ms}$ elastic rebound.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Pointer position $(x_c, y_c)$ relative to button rect $(W, H)$:
Normalized coords $u = x_c / W, \ v = y_c / H$.
Specular radial gradient:
$$\text{background} = \text{radial-gradient}(120\text{px at } x_c\text{px } y_c\text{px}, C_{sheen} \ 0\%, \text{transparent } 80\%)$$
Active press transform:
$$\text{transform: scale}(0.96) \text{ translateY}(1\text{px})$$

## 5. Interaction Mechanics
Smoothly illuminates under cursor. Compresses with tactile feedback on mouse down / space key press.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Layered Button: Base background + specular highlight layer + content text.
2. Pointer Events: Measure `offsetX, offsetY` on `pointermove`.
3. CSS Variables: Update `--mouse-x` and `--mouse-y` inline.
4. Keyboard Access: Visible `:focus-visible` focus ring matching glow color.

## 7. Modularity & File Organization
Decompose into `SpecularButton.tsx` (<110 LoC) and `specularButtonStyles.ts` (<60 LoC).
