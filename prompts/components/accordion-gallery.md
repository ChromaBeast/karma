# Accordion Gallery (Components)

## 1. Overview & Visual Behavior
Accordion Gallery displays expandable horizontal or vertical card panels that smoothly expand on hover/click while compressing sibling panels with spring physics and high-resolution imagery.

## 2. Props & Configuration Interface
```typescript
interface AccordionGalleryProps {
  /** Array of gallery panels */
  panels: { id: string; title: string; subtitle?: string; image: string; content?: React.ReactNode }[];
  /** Default active panel ID */
  defaultActiveId?: string;
  /** Expansion orientation (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  /** Expanded panel flex grow ratio (default: 4) */
  activeFlex?: number;
  /** Inactive panel flex grow ratio (default: 1) */
  inactiveFlex?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Panel expansion transitions over $450\text{ms}$ using spring bezier curve `cubic-bezier(0.25, 1, 0.5, 1)`. Image zoom transitions over $600\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
For $N$ panels with active index $a$:
Flex grow factor for panel $i \in [0, N-1]$:
$$F_i(t) = \begin{cases} F_{active} & \text{if } i = a \\ F_{inactive} & \text{if } i \ne a \end{cases}$$
Smooth interpolation:
$$w_i(t) = w_i(t-1) + \alpha \cdot (W \cdot \frac{F_i}{\sum F_k} - w_i(t-1))$$
Image pan offset to preserve center alignment:
$$X_{img} = -0.5 \cdot (W_{img} - w_i(t))$$

## 5. Interaction Mechanics
Clicking or hovering over a panel expands it instantly while collapsing others. Full keyboard arrow navigation.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Flex Container: Outer wrapper with `flex flex-row overflow-hidden`.
2. Transition Classes: Tailwind `transition-[flex] duration-500 ease-out` applied to panel items.
3. Image Containment: `object-cover w-full h-full` with scale transform on active state.
4. Mobile Orientation: Automatically flips to vertical accordion on narrow viewports.

## 7. Modularity & File Organization
Organized into `AccordionGallery.tsx` (<120 LoC), `AccordionPanel.tsx` (<100 LoC), and `accordionStyles.ts` (<50 LoC).
