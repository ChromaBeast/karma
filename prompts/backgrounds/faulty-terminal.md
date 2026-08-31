# Faulty Terminal (Backgrounds)

## 1. Overview & Visual Behavior
Faulty Terminal simulates a malfunctioning retro mainframe CRT monitor with scanlines, horizontal sync tearing, chromatic RGB displacement, and terminal text glitch.

## 2. Props & Configuration Interface
```typescript
interface FaultyTerminalProps {
  /** Terminal phosphor color (default: '#00ff66' for green, '#ffb000' for amber) */
  color?: string;
  /** Glitch burst frequency in seconds (default: 3s) */
  glitchInterval?: number;
  /** CRT scanline intensity (default: 0.3) */
  scanlineIntensity?: number;
  /** Custom CSS classes */
  className?: string;
}
```

## 3. Animation Specifications & Timing
Scanlines animate at 60 FPS. Sync tear glitches occur sporadically for $100\text{ms}$ to $250\text{ms}$.

## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics
Horizontal H-Sync Glitch Displacement for slice $y \in [y_1, y_2]$:
$$\Delta x(y) = \text{rand}(-15, 15)\text{px} \cdot \text{isGlitching}$$
Chromatic RGB Split:
$$R(x, y) = I(x + \Delta x + 3, y), \quad G(x, y) = I(x + \Delta x, y), \quad B(x, y) = I(x + \Delta x - 3, y)$$

## 5. Interaction Mechanics
Clicking terminal triggers manual glitch distortion burst.

## 6. Implementation Guidance (Zero External Animation Bloat)
1. WebGL / Canvas Post-Process: Fragment shader applying H-sync tearing and phosphor glow.
2. SVG Scanline Overlay: Repeating scanline pattern with opacity breathing.
3. Sporadic Timer: Randomized `setTimeout` triggering tear slices.
4. Retro Terminal Font: Optional green/amber monospace terminal text layer.

## 7. Modularity & File Organization
Organized into `FaultyTerminal.tsx` (<120 LoC), `TerminalShader.ts` (<130 LoC), and `terminalStyles.ts` (<50 LoC).
