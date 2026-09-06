"""
Seed Campaigns Generator.
Generates 4 broadcast-grade 9:16 vertical commercial video ads with scenes, voiceovers, subtitles,
and saves them to both frontend/public/seed_ads and backend/output.
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, List
import requests
import urllib.parse
from PIL import Image, ImageDraw, ImageFont, ImageOps
import numpy as np

backend_dir = Path(__file__).resolve().parent
frontend_public = backend_dir.parent / "frontend" / "public" / "seed_ads"
output_dir = backend_dir / "output"

frontend_public.mkdir(parents=True, exist_ok=True)
(output_dir / "videos").mkdir(parents=True, exist_ok=True)
(output_dir / "images").mkdir(parents=True, exist_ok=True)
(output_dir / "audio").mkdir(parents=True, exist_ok=True)

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from modules.voice_gen import generate_single_voiceover
from modules.video_stitch import stitch_video

CAMPAIGNS = [
    {
        "id": "aura-hydrate",
        "product_name": "Aura Hydrate",
        "category": "⚡ Energy & Electrolyte Drink",
        "voice": "en-US-ChristopherNeural",
        "palette": {"primary": (232, 163, 61), "accent": (47, 110, 98), "bg": (12, 18, 26)},
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": "Cinematic macro shot of sleek electric-cyan aluminium can of Aura Hydrate with glistening condensation droplets and golden backlight",
                "voiceover_line": "Exhausted by mid-day energy crashes? Meet Aura Hydrate.",
                "duration_seconds": 4.5
            },
            {
                "scene_number": 2,
                "visual_description": "Dynamic slow motion splash of sparkling electrolyte water with fresh sliced organic limes and crystal bubbles on dark stone",
                "voiceover_line": "Clean electrolytes engineered to supercharge mental focus without any sugar.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 3,
                "visual_description": "Close up of ice-cold sparkling beverage pouring into a frosted glass with effervescent bubbles rising in golden hour sun",
                "voiceover_line": "Every single sip delivers ultra-refreshing flavor and immediate cellular hydration.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 4,
                "visual_description": "Hero commercial packshot of Aura Hydrate can on glowing pedestal with studio lighting and bold Refresh Your Energy text",
                "voiceover_line": "Upgrade your daily performance today. Tap below to order Aura Hydrate now.",
                "duration_seconds": 5.0
            }
        ]
    },
    {
        "id": "velvet-noir",
        "product_name": "Velvet Noir",
        "category": "🌙 Luxury Evening Fragrance",
        "voice": "en-US-AvaNeural",
        "palette": {"primary": (235, 180, 80), "accent": (140, 45, 80), "bg": (10, 8, 14)},
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": "Luxurious obsidian glass perfume bottle Velvet Noir with golden typography resting on polished black marble with subtle smoke mist",
                "voiceover_line": "Step into the night with unforgettable allure and magnetic confidence.",
                "duration_seconds": 4.5
            },
            {
                "scene_number": 2,
                "visual_description": "Midnight vanilla orchid blossom and smoky cedarwood botanicals bathed in warm sunset rooftop amber lighting",
                "voiceover_line": "Crafted with rare evening botanicals for a seductive, long-lasting luxury aura.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 3,
                "visual_description": "Cinematic slow motion golden mist spray floating through beams of moonlight in a modern penthouse",
                "voiceover_line": "A sophisticated statement of elegance that captivates every room you enter.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 4,
                "visual_description": "Center prestige shot of Velvet Noir fragrance bottle on illuminated obsidian plinth with velvet background and gold trim",
                "voiceover_line": "Discover your signature evening scent. Experience Velvet Noir tonight.",
                "duration_seconds": 5.0
            }
        ]
    },
    {
        "id": "aeropulse-cloud",
        "product_name": "AeroPulse Cloud",
        "category": "👟 High-Performance Runners",
        "voice": "en-US-GuyNeural",
        "palette": {"primary": (0, 220, 180), "accent": (255, 90, 60), "bg": (14, 16, 22)},
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": "Close-up of futuristic carbon-fiber running shoe AeroPulse touching wet city asphalt with neon reflection and speed blur",
                "voiceover_line": "Heavy running shoes holding you back from your fastest personal record?",
                "duration_seconds": 4.5
            },
            {
                "scene_number": 2,
                "visual_description": "High-tech nitrogen-infused foam midsole compressing and propelling forward with explosive kinetic energy particles",
                "voiceover_line": "AeroPulse Cloud delivers zero-gravity cushion and explosive energy return.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 3,
                "visual_description": "Marathon athlete sprinting at dawn through city bridge with morning fog and sleek aerodynamic silhouette",
                "voiceover_line": "Engineered for marathon durability, featherlight speed, and peak performance.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 4,
                "visual_description": "Dynamic floating sneaker shot of AeroPulse Cloud in mid-air with carbon plate highlight and Defy Gravity slogan",
                "voiceover_line": "Break your limits on every run. Order your AeroPulse Cloud pair today.",
                "duration_seconds": 5.0
            }
        ]
    },
    {
        "id": "chronoflow",
        "product_name": "ChronoFlow",
        "category": "💻 Autonomous AI Workflow App",
        "voice": "en-US-AndrewNeural",
        "palette": {"primary": (100, 180, 255), "accent": (160, 100, 255), "bg": (10, 14, 24)},
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": "Modern creative director working late at glowing ultra-wide monitor surrounded by complex scattered project deadlines",
                "voiceover_line": "Drowning in chaotic schedules and missed deadlines every single week?",
                "duration_seconds": 4.5
            },
            {
                "scene_number": 2,
                "visual_description": "Futuristic 3D holographic timeline map automatically synchronizing chaotic tasks into smooth connected glowing nodes",
                "voiceover_line": "ChronoFlow autonomously orchestrates your entire team workflow in real-time.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 3,
                "visual_description": "Clean glassmorphic dark mode productivity analytics dashboard with 10x speed multiplier and completed milestones",
                "voiceover_line": "Eliminate busywork and save fifteen hours every week with AI automation.",
                "duration_seconds": 5.0
            },
            {
                "scene_number": 4,
                "visual_description": "Sleek glowing ChronoFlow application interface centered with Start 14-Day Free Trial call-to-action button",
                "voiceover_line": "Reclaim your creative focus today. Start your free ChronoFlow trial now.",
                "duration_seconds": 5.0
            }
        ]
    }
]


def fetch_or_render_image(prompt: str, save_path: Path, scene_num: int, product_name: str, palette: Dict[str, Any]) -> str:
    clean_prompt = prompt.replace("\n", " ").strip()
    encoded = urllib.parse.quote(f"{clean_prompt}, commercial advertising photography, studio lighting, 8k vertical 9:16")
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=576&height=1024&nologo=true&seed={100 + scene_num * 17}&model=turbo"

    try:
        resp = requests.get(url, timeout=8)
        if resp.status_code == 200 and len(resp.content) > 5000:
            temp_path = save_path.with_suffix(".tmp.jpg")
            with open(temp_path, "wb") as f:
                f.write(resp.content)
            with Image.open(temp_path) as raw_img:
                fitted = ImageOps.fit(raw_img.convert("RGB"), (1080, 1920), method=Image.Resampling.LANCZOS)
                fitted.save(save_path, format="JPEG", quality=92)
            if temp_path.exists():
                temp_path.unlink()
            return str(save_path.resolve())
    except Exception as e:
        print(f"    [Image Note] Pollinations fallback: {e}")

    # Fallback to rich high-end styled graphic frame
    width, height = 1080, 1920
    img = Image.new("RGB", (width, height), color=palette.get("bg", (12, 16, 24)))
    draw = ImageDraw.Draw(img)

    p_col = palette.get("primary", (232, 163, 61))
    a_col = palette.get("accent", (47, 110, 98))

    draw.rectangle([(30, 30), (width - 30, height - 30)], outline=a_col, width=4)
    draw.rectangle([(50, 50), (width - 50, 64)], fill=p_col)
    draw.rectangle([(50, height - 64), (width - 50, height - 50)], fill=p_col)

    # Center card
    draw.rectangle([(90, 480), (width - 90, 1440)], fill=(20, 26, 36), outline=p_col, width=2)
    draw.text((130, 540), f"FRAMEZERO • BROADCAST MASTER", fill=p_col)
    draw.text((130, 600), f"{product_name.upper()} // SCENE {scene_num:02d}", fill=(245, 245, 247))

    words = prompt.split()
    lines = []
    cur = []
    for w in words:
        cur.append(w)
        if len(" ".join(cur)) > 28:
            lines.append(" ".join(cur))
            cur = []
    if cur:
        lines.append(" ".join(cur))

    y = 700
    for l in lines[:8]:
        draw.text((130, y), l, fill=(230, 235, 245))
        y += 50

    draw.text((130, 1370), "VERTICAL 9:16 • 1080X1920 • STEREO MASTER", fill=(140, 150, 165))
    img.save(save_path, format="JPEG", quality=90)
    return str(save_path.resolve())


def build_all_seed_campaigns():
    manifest: List[Dict[str, Any]] = []

    print("=" * 65)
    print("Synthesizing 4 Broadcast Commercial Ad Campaigns (FrameZero Engine)")
    print("=" * 65)

    for c_idx, camp in enumerate(CAMPAIGNS):
        camp_id = camp["id"]
        prod_name = camp["product_name"]
        voice = camp["voice"]
        palette = camp["palette"]
        scenes = camp["scenes"]

        print(f"\n[{c_idx + 1}/4] Processing Campaign: {prod_name} ({camp_id})")

        camp_img_dir = output_dir / "images" / camp_id
        camp_aud_dir = output_dir / "audio" / camp_id
        camp_img_dir.mkdir(parents=True, exist_ok=True)
        camp_aud_dir.mkdir(parents=True, exist_ok=True)

        image_paths: List[str] = []
        audio_paths: List[str] = []
        subtitles: List[str] = []
        durations: List[float] = []

        # 1. Generate scene images & voiceovers
        for sc in scenes:
            s_num = sc["scene_number"]
            v_desc = sc["visual_description"]
            vo_line = sc["voiceover_line"]
            dur = sc["duration_seconds"]

            img_file = camp_img_dir / f"scene_{s_num}.jpg"
            aud_file = camp_aud_dir / f"scene_{s_num}.mp3"

            print(f"  • Generating Scene {s_num}: \"{vo_line[:50]}...\"")
            # Image
            img_path = fetch_or_render_image(v_desc, img_file, s_num, prod_name, palette)
            image_paths.append(img_path)

            # Copy image to frontend public for instant contact sheet rendering
            fe_scene_img = frontend_public / f"{camp_id}_scene_{s_num}.jpg"
            with open(img_path, "rb") as src, open(fe_scene_img, "wb") as dst:
                dst.write(src.read())

            # Voiceover
            try:
                generate_single_voiceover(vo_line, aud_file, voice_id="EXAVITQu4vr4xnSDxMaL")
            except Exception:
                pass
            audio_paths.append(str(aud_file.resolve()))

            subtitles.append(vo_line)
            durations.append(dur)

        # 2. Stitch the final commercial video
        fe_video_path = frontend_public / f"{camp_id}.mp4"
        be_video_path = output_dir / "videos" / f"{camp_id}.mp4"

        print(f"  • Stitching 1080x1920 MP4 commercial for {prod_name}...")
        stitch_video(
            image_paths=image_paths,
            audio_paths=audio_paths,
            subtitles=subtitles,
            product_name=prod_name,
            durations=durations,
            output_path=be_video_path,
            fps=24
        )

        # Copy video to frontend public folder
        if be_video_path.exists():
            with open(be_video_path, "rb") as src, open(fe_video_path, "wb") as dst:
                dst.write(src.read())
            print(f"  ✓ Copied broadcast video to: {fe_video_path}")

        # Construct scenes structure for instant API / UI retrieval
        campaign_scenes_data = []
        for s_idx, sc in enumerate(scenes):
            s_num = sc["scene_number"]
            campaign_scenes_data.append({
                "scene_number": s_num,
                "visual_description": sc["visual_description"],
                "voiceover_line": sc["voiceover_line"],
                "duration_seconds": durations[s_idx],
                "image_url": f"/seed_ads/{camp_id}_scene_{s_num}.jpg"
            })

        manifest.append({
            "id": camp_id,
            "product_name": prod_name,
            "category": camp["category"],
            "video_url": f"/seed_ads/{camp_id}.mp4",
            "scenes": campaign_scenes_data
        })

    # Save master seed manifest
    manifest_path = frontend_public / "seed_manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    be_manifest_path = output_dir / "seed_manifest.json"
    with open(be_manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print("\n" + "=" * 65)
    print("✓ Successfully Generated All 4 Seed Commercial Campaigns!")
    print(f"Manifest saved to: {manifest_path}")
    print("=" * 65)


if __name__ == "__main__":
    build_all_seed_campaigns()
