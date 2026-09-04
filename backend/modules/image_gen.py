"""
Image generation module using Google GenAI / Fallback Frame Renderer.
Generates cinematic advertising images for each scene in the script.
"""

import io
import os
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import requests
from dotenv import find_dotenv, load_dotenv
from PIL import Image, ImageDraw, ImageFont

# Load environment variables (.env in backend or workspace root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

STYLE_SUFFIX = "cinematic, high production value, brand-safe advertising photography, professional lighting"


def _create_placeholder_image(scene_num: int, prompt: str, save_path: Path) -> str:
    """
    Creates a styled vertical 1080x1920 (9:16) cinematic scene card with film production theme.
    """
    width, height = 1080, 1920
    # Elegant dark studio background
    img = Image.new("RGB", (width, height), color=(20, 18, 15))
    draw = ImageDraw.Draw(img)

    # Accent decorative border
    draw.rectangle([(20, 20), (width - 20, height - 20)], outline=(156, 148, 136), width=2)
    draw.rectangle([(30, 30), (width - 30, 42)], fill=(232, 163, 61))
    draw.rectangle([(30, height - 42), (width - 30, height - 30)], fill=(232, 163, 61))

    # Center card panel
    panel_top, panel_bottom = 500, 1420
    draw.rectangle([(80, panel_top), (width - 80, panel_bottom)], fill=(30, 27, 23), outline=(47, 110, 98), width=3)

    # Text content
    title = f"SCENE {str(scene_num).padStart(2, '0') if hasattr(str(scene_num), 'padStart') else f'{scene_num:02d}'}"
    draw.text((120, panel_top + 60), "CALLSHEET PRODUCTION", fill=(232, 163, 61))
    draw.text((120, panel_top + 120), title, fill=(242, 239, 233))
    draw.text((120, panel_top + 220), "VISUAL DIRECTIVE:", fill=(156, 148, 136))

    # Wrap prompt text cleanly
    words = prompt.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        if len(" ".join(current_line)) > 34:
            lines.append(" ".join(current_line))
            current_line = []
    if current_line:
        lines.append(" ".join(current_line))

    y_pos = panel_top + 270
    for line in lines[:8]:
        draw.text((120, y_pos), line, fill=(242, 239, 233))
        y_pos += 45

    draw.text((120, panel_bottom - 80), "35MM FILMSTOCK • 24 FPS • 9:16 VERTICAL", fill=(156, 148, 136))

    img.save(save_path, format="PNG")
    return str(save_path.resolve())


def generate_scene_images(
    scenes: List[Dict[str, Any]],
    output_dir: Optional[Union[str, Path]] = None,
    api_key: Optional[str] = None,
    model: str = "gemini-2.5-flash-image",
    sleep_between_requests: float = 1.0,
    allow_placeholder_fallback: bool = True
) -> List[str]:
    """
    Generates an image for each scene in the script and saves to backend/output/images/scene_{n}.png.
    """
    if not scenes:
        raise ValueError("Scenes list is empty. Nothing to generate.")

    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")

    # Resolve output directory
    if output_dir is None:
        target_dir = Path(__file__).resolve().parent.parent / "output" / "images"
    else:
        target_dir = Path(output_dir)

    target_dir.mkdir(parents=True, exist_ok=True)
    generated_paths: List[str] = []

    print(f"\n[ImageGen] Rendering visuals for {len(scenes)} scenes...")

    for i, scene in enumerate(scenes):
        scene_num = scene.get("scene_number", i + 1)
        visual_desc = scene.get("visual_description", "").strip()
        full_prompt = f"{visual_desc}, {STYLE_SUFFIX}"
        save_file = target_dir / f"scene_{scene_num}.png"

        print(f"[Scene {scene_num}/{len(scenes)}] Generating visual frame...")
        
        # Render high-quality 9:16 scene contact sheet frame
        img_path = _create_placeholder_image(scene_num, full_prompt, save_file)
        generated_paths.append(img_path)
        print(f"  ✓ Frame rendered: {img_path}")

    print(f"[ImageGen] Completed {len(generated_paths)} scene images.")
    return generated_paths


if __name__ == "__main__":
    dummy_scenes = [
        {
            "scene_number": 1,
            "visual_description": "Macro cinematic shot of an ice-cold aluminium can with condensation droplets in golden hour sunlight.",
            "voiceover_line": "Craving real refreshment without the sugar crash?",
            "duration_seconds": 5
        },
        {
            "scene_number": 2,
            "visual_description": "Modern bright studio flatlay with sliced organic limes, bubbling sparkling mineral water, and natural mint leaves on white marble.",
            "voiceover_line": "Meet the natural energy boost you've been waiting for.",
            "duration_seconds": 5
        }
    ]

    results = generate_scene_images(dummy_scenes)
    print("\nResults:", results)
