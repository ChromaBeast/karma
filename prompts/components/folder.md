# Folder (Components)

## 1. Overview & Visual Behavior
Folder creates an interactive macOS-style 3D expandable folder that opens its front flap, reveals nested document previews, and fans out files with spring physics.

## 2. Props & Configuration Interface
```typescript
interface FolderProps {
  /** Folder title */
  title: string;
  /** Array of nested file items */
  files: { id: string; name: string; type?: string; thumbnail?: string }[];
  /** Folder open state */
  isOpen?: boolean;
  /** On toggle callback */
  onToggle?: (open: boolean) => void;
  /** Folder color */
  folderColor?: string;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Folder flap opens in $350\text{ms}$ with `cubic-bezier(0.2, 0.8, 0.2, 1)`. File previews fan out with staggered delays ($30\text{ms}$).

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Front flap 3D rotation angle $\theta_{flap}(t)$:
$$\theta_{flap} = \text{if open then } -55^\circ \text{ else } 0^\circ$$
Nested file $k \in [0, N-1]$ fan out transform when open:
$$y_k = -(k + 1) \cdot 24\text{px}, \quad \text{rotate}_k = (k - 1) \cdot 6^\circ, \quad \text{scale}_k = 1 - k \cdot 0.05$$

## 5. Interaction Mechanics
Clicking folder toggles open/closed states. Hovering previews nested files.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. 3D Folder Shell: Back flap layer + nested file items + front flap with `transform-origin: bottom`.
2. CSS 3D Perspective: `perspective: 800px; transform-style: preserve-3d`.
3. Staggered WAAPI: Animate file card translations on open.
4. Keyboard Accessible: Toggle with Enter or Space key.

## 7. Modularity & File Organization
Organized into `Folder.tsx` (<130 LoC), `FolderFlap.tsx` (<80 LoC), and `folderStyles.ts` (<50 LoC).
