import os
import re

CATEGORIES = {
    "text-animations": {
        "expected_count": 32,
        "dir": r"c:\Projects\karma\prompts\text-animations",
        "expected_files": [
            "text-loop.md", "masked-heading.md", "particle-text.md", "split-flap-text.md",
            "warp-text.md", "stroke-text.md", "depth-text.md", "fold-text.md",
            "echo-text.md", "split-text.md", "blur-text.md", "circular-text.md",
            "text-type.md", "shuffle.md", "shiny-text.md", "text-pressure.md",
            "curved-loop.md", "fuzzy-text.md", "gradient-text.md", "falling-text.md",
            "text-cursor.md", "decrypted-text.md", "true-focus.md", "scroll-float.md",
            "scroll-reveal.md", "ascii-text.md", "scrambled-text.md", "rotating-text.md",
            "glitch-text.md", "scroll-velocity.md", "variable-proximity.md", "count-up.md"
        ]
    },
    "animations": {
        "expected_count": 38,
        "dir": r"c:\Projects\karma\prompts\animations",
        "expected_files": [
            "glow-cursor.md", "scroll-expand.md", "ripple-distortion.md", "elastic-mesh.md",
            "swarm-cursor.md", "halftone-reveal.md", "pixel-swap.md", "cursor-grid.md",
            "animated-content.md", "fade-content.md", "electric-border.md", "orbit-images.md",
            "pixel-transition.md", "glare-hover.md", "antigravity.md", "logo-loop.md",
            "target-cursor.md", "magic-rings.md", "laser-flow.md", "magnet-lines.md",
            "ghost-cursor.md", "gradual-blur.md", "click-spark.md", "magnet.md",
            "strands.md", "sticker-peel.md", "pixel-trail.md", "cubes.md",
            "metallic-paint.md", "noise.md", "shape-blur.md", "crosshair.md",
            "image-trail.md", "ribbons.md", "splash-cursor.md", "meta-balls.md",
            "blob-cursor.md", "star-border.md"
        ]
    },
    "components": {
        "expected_count": 45,
        "dir": r"c:\Projects\karma\prompts\components",
        "expected_files": [
            "infinite-spiral.md", "depth-carousel.md", "morph-slider.md", "drift-wall.md",
            "accordion-gallery.md", "specular-button.md", "option-wheel.md", "curved-input.md",
            "line-sidebar.md", "animated-list.md", "scroll-stack.md", "bubble-menu.md",
            "magic-bento.md", "circular-gallery.md", "reflective-card.md", "card-nav.md",
            "stack.md", "fluid-glass.md", "pill-nav.md", "tilted-card.md",
            "masonry.md", "glass-surface.md", "dome-gallery.md", "chroma-grid.md",
            "folder.md", "staggered-menu.md", "model-viewer.md", "lanyard.md",
            "profile-card.md", "dock.md", "gooey-nav.md", "pixel-card.md",
            "carousel.md", "spotlight-card.md", "border-glow.md", "flying-posters.md",
            "card-swap.md", "glass-icons.md", "decay-card.md", "flowing-menu.md",
            "elastic-slider.md", "counter.md", "infinite-menu.md", "stepper.md",
            "bounce-cards.md"
        ]
    },
    "backgrounds": {
        "expected_count": 56,
        "dir": r"c:\Projects\karma\prompts\backgrounds",
        "expected_files": [
            "aero-shards.md", "ghost-fibers.md", "crt-warp.md", "molten-metal.md",
            "gradient-waves.md", "web-threads.md", "topography.md", "light-tunnel.md",
            "sliced-waves.md", "acid-squares.md", "scanner.md", "ferrofluid.md",
            "lightfall.md", "liquid-ether.md", "prism.md", "dark-veil.md",
            "light-pillar.md", "silk.md", "floating-lines.md", "side-rays.md",
            "light-rays.md", "pixel-blast.md", "color-bends.md", "evil-eye.md",
            "line-waves.md", "radar.md", "soft-aurora.md", "aurora.md",
            "plasma.md", "plasma-wave.md", "particles.md", "gradient-blinds.md",
            "grainient.md", "grid-scan.md", "beams.md", "pixel-snow.md",
            "lightning.md", "prismatic-burst.md", "galaxy.md", "dither.md",
            "faulty-terminal.md", "ripple-grid.md", "dot-field.md", "dot-grid.md",
            "threads.md", "hyperspeed.md", "iridescence.md", "waves.md",
            "grid-distortion.md", "ballpit.md", "orb.md", "letter-glitch.md",
            "grid-motion.md", "shape-grid.md", "liquid-chrome.md", "balatro.md"
        ]
    }
}

REQUIRED_SECTIONS = [
    "## 1. Overview & Visual Behavior",
    "## 2. Props & Configuration Interface",
    "## 3. Animation Specifications & Timing",
    "## 4. Mathematical & Physics Formulas / Canvas / CSS Mechanics",
    "## 5. Interaction Mechanics",
    "## 6. Implementation Guidance (Zero External Animation Bloat)",
    "## 7. Modularity & File Organization"
]

total_files = 0
errors = []

for cat_name, cat_data in CATEGORIES.items():
    cat_dir = cat_data["dir"]
    if not os.path.exists(cat_dir):
        errors.append(f"Directory missing: {cat_dir}")
        continue
    
    files = [f for f in os.listdir(cat_dir) if f.endswith(".md")]
    print(f"Checking {cat_name}: found {len(files)} files (expected {cat_data['expected_count']})")
    
    if len(files) != cat_data["expected_count"]:
        errors.append(f"Category {cat_name} has {len(files)} files, expected {cat_data['expected_count']}")
    
    # Check expected filenames
    for expected_file in cat_data["expected_files"]:
        file_path = os.path.join(cat_dir, expected_file)
        if not os.path.exists(file_path):
            errors.append(f"Missing expected file: {file_path}")
            continue
        
        total_files += 1
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if len(content.strip()) < 200:
            errors.append(f"File too short: {file_path} ({len(content)} chars)")
        
        # Check required sections
        for section in REQUIRED_SECTIONS:
            if section not in content:
                errors.append(f"File {expected_file} missing section: '{section}'")
        
        # Check title
        if not content.startswith("# "):
            errors.append(f"File {expected_file} missing H1 title")
        
        # Check typescript codeblock
        if "```typescript" not in content or "interface " not in content:
            errors.append(f"File {expected_file} missing TypeScript interface")

print(f"\n==========================================")
print(f"Total prompt files verified: {total_files} / 171")
if errors:
    print(f"Found {len(errors)} errors:")
    for err in errors[:20]:
        print(f" - {err}")
else:
    print("ALL 171 PROMPT SPECIFICATIONS ARE 100% COMPLETE AND VALID!")
print(f"==========================================")
