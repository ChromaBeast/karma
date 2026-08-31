# Masonry (Components)

## 1. Overview & Visual Behavior
Masonry arranges dynamic variable-height cards into optimal multi-column Pinterest-style layouts with animated column adjustments and staggered entrance reveals.

## 2. Props & Configuration Interface
```typescript
interface MasonryProps<T> {
  /** Data items array */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Responsive column count map (e.g. { default: 4, 1024: 3, 768: 2, 640: 1 }) */
  columns?: { [breakpoint: string]: number } | number;
  /** Grid gap in pixels (default: 16) */
  gap?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Cards enter with staggered fade-in ($400\text{ms}$, $30\text{ms}$ step). Column repositioning uses FLIP transitions over $300\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Greedy Column Packing Algorithm:
Maintain column height array $H = [h_0, h_1, \dots, h_{C-1}]$.
For card $k$ with height $h_k$:
1. Find column with minimum height:
   $$c_{min} = \arg\min_{c} H[c]$$
2. Position card $k$:
   $$x_k = c_{min} \cdot (W_{col} + \text{gap}), \quad y_k = H[c_{min}]$$
3. Update column height:
   $$H[c_{min}] \leftarrow H[c_{min}] + h_k + \text{gap}$$

## 5. Interaction Mechanics
Smoothly reflows cards on window resize or when filtering items.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. Dynamic Layout Engine: Calculate card positions in pure JavaScript or CSS multi-column / flex columns.
2. Image Load Listener: Re-measure card heights when child images finish loading.
3. Virtualization Option: Support windowed rendering for large datasets ($>100$ items).
4. Responsive Breakpoints: Match Tailwind standard breakpoints.

## 7. Modularity & File Organization
Organized into `Masonry.tsx` (<120 LoC), `useMasonryLayout.ts` (<110 LoC), and `masonryTypes.ts` (<40 LoC).
