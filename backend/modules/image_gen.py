"""
Image generation module using Pollinations AI (Flux/Turbo) with resilient fallback.
Generates photorealistic vertical 9:16 advertising visuals for each scene in the script.
"""

import os
import time
import urllib.parse
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
import requests
from dotenv import find_dotenv, load_dotenv
from PIL import Image, ImageDraw, ImageFont, ImageOps

# Load environment variables (.env in backend or workspace root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

STYLE_SUFFIX = "commercial advertising photography, vibrant colorful cinematic lighting, highly detailed, clean 8k aesthetic, high production value, 9:16 vertical aspect ratio"


def _create_fallback_brand_visual(scene_num: int, prompt: str, save_path: Path, product_name: str = "") -> str:
    """
    Creates a rich, vibrant cinematic graphic frame with warm lighting, glowing particles,
    and commercial studio typography if the remote image service is temporarily unreachable.
    """
    width, height = 1080, 1920
    # Rich warm gradient background instead of dull dark
    img = Image.new("RGB", (width, height), color=(26, 18, 12))
    draw = ImageDraw.Draw(img)

    # Ambient warm glow circles in background
    for r in range(400, 100, -20):
        alpha_color = (255, int(120 + r * 0.2), int(30 + r * 0.1))
        draw.ellipse([(width // 2 - r, height // 2 - r), (width // 2 + r, height // 2 + r)], outline=alpha_color, width=2)

    # Accent decorative geometric borders
    draw.rectangle([(24, 24), (width - 24, height - 24)], outline=(245, 166, 35), width=4)
    draw.rectangle([(36, 36), (width - 36, 52)], fill=(232, 85, 45))
    draw.rectangle([(36, height - 52), (width - 36, height - 36)], fill=(232, 85, 45))

    # Center hero card panel
    panel_top, panel_bottom = 400, 1500
    draw.rounded_rectangle([(70, panel_top), (width - 70, panel_bottom)], radius=24, fill=(35, 24, 18), outline=(245, 166, 35), width=3)

    # Header badge
    title = f"SCENE {scene_num:02d}"
    draw.text((120, panel_top + 45), "🌟 PREMIUM COMMERCIAL DIRECTIVE", fill=(245, 166, 35))
    draw.text((120, panel_top + 100), title, fill=(255, 255, 255))
    draw.text((120, panel_top + 190), "VISUAL HIGHLIGHT:", fill=(220, 200, 180))

    # Wrap prompt text cleanly
    words = prompt.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        if len(" ".join(current_line)) > 28:
            lines.append(" ".join(current_line))
            current_line = []
    if current_line:
        lines.append(" ".join(current_line))

    y_pos = panel_top + 250
    for line in lines[:8]:
        draw.text((120, y_pos), line, fill=(255, 248, 240))
        y_pos += 46

    draw.text((120, panel_bottom - 70), "🔥 9:16 VERTICAL ULTRA HD COMMERCIAL", fill=(245, 166, 35))

    img.save(save_path, format="PNG")
    return str(save_path.resolve())


def _fetch_pollinations_image(prompt: str, save_path: Path, seed: int = 42) -> bool:
    """
    Fetches photorealistic AI images via Pollinations AI with multiple endpoint retries.
    """
    # Clean and streamline prompt to avoid URL length issues
    clean_prompt = " ".join(prompt.replace("\n", " ").split())[:220]
    encoded = urllib.parse.quote(clean_prompt)

    endpoints = [
        f"https://image.pollinations.ai/prompt/{encoded}?width=576&height=1024&nologo=true&seed={seed}&model=turbo",
        f"https://image.pollinations.ai/prompt/{encoded}?width=720&height=1280&nologo=true&seed={seed}",
        f"https://image.pollinations.ai/prompt/{encoded}?width=720&height=1280&nologo=true&seed={seed}&model=flux",
    ]

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    for ep_idx, url in enumerate(endpoints):
        for attempt in range(2):
            try:
                print(f"    [Attempt {attempt+1}] Querying image endpoint {ep_idx+1}...")
                response = requests.get(url, headers=headers, timeout=28)
                if response.status_code == 200 and len(response.content) > 5000:
                    temp_path = save_path.with_suffix(".tmp.jpg")
                    with open(temp_path, "wb") as f:
                        f.write(response.content)

                    with Image.open(temp_path) as raw_img:
                        rgb_img = raw_img.convert("RGB")
                        fitted = ImageOps.fit(rgb_img, (1080, 1920), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
                        fitted.save(save_path, format="PNG", quality=95)

                    if temp_path.exists():
                        temp_path.unlink()
                    return True
                else:
                    print(f"    [Notice] Response status {response.status_code}, length {len(response.content)}. Retrying...")
            except Exception as exc:
                print(f"    [ImageGen Notice] Endpoint {ep_idx+1} attempt {attempt+1} error: {exc}")
            time.sleep(1)

    return False


def generate_scene_images(
    scenes: List[Dict[str, Any]],
    output_dir: Optional[Union[str, Path]] = None,
    api_key: Optional[str] = None,
    allow_placeholder_fallback: bool = True
) -> List[str]:
    """
    Generates high-resolution vertical 9:16 AI visuals for each scene in the script.
    Saves each image to backend/output/images/scene_{n}.png.

    Returns list of absolute file paths in scene order.
    """
    if not scenes:
        raise ValueError("Scenes list is empty. Nothing to generate.")

    # Resolve output directory
    if output_dir is None:
        target_dir = Path(__file__).resolve().parent.parent / "output" / "images"
    else:
        target_dir = Path(output_dir)

    target_dir.mkdir(parents=True, exist_ok=True)
    generated_paths: List[str] = []

    print(f"\n[ImageGen] Synthesizing photorealistic 9:16 visuals for {len(scenes)} scenes...")

    for i, scene in enumerate(scenes):
        scene_num = scene.get("scene_number", i + 1)
        visual_desc = scene.get("visual_description", "").strip()
        full_prompt = f"{visual_desc}, {STYLE_SUFFIX}"
        save_file = target_dir / f"scene_{scene_num}_{int(time.time())}.png"
        seed = 100 + scene_num * 43

        print(f"\n[Scene {scene_num}/{len(scenes)}] Generating AI visual...")
        print(f"  Prompt: \"{visual_desc[:90]}...\"")

        success = _fetch_pollinations_image(full_prompt, save_file, seed=seed)
        if success:
            print(f"  ✓ High-resolution AI visual generated: {save_file}")
            generated_paths.append(str(save_file.resolve()))
        else:
            print("  [Notice] Remote generator unavailable. Creating studio graphic visual frame...")
            fallback_path = _create_fallback_brand_visual(scene_num, visual_desc, save_file)
            print(f"  ✓ Studio graphic visual created: {fallback_path}")
            generated_paths.append(fallback_path)

    print(f"\n[ImageGen] Completed {len(generated_paths)} scene images.")
    return generated_paths


if __name__ == "__main__":
    dummy_scenes = [
        {
            "scene_number": 1,
            "visual_description": "Motu Patlu excitedly looking at freshly fried golden hot samosas at Chaiwala shop in Furfuri Nagar, vibrant 3D cartoon animation.",
            "voiceover_line": "Hungry and out of energy? Chaiwala Samosa Corner has got you covered!",
            "duration_seconds": 4.5
        }
    ]

    results = generate_scene_images(dummy_scenes)
    print("\nResults:", results)
