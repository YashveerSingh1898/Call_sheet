"""
Callsheet Pipeline Orchestrator.
Coordinates the end-to-end flow:
  1. Script Generation (Gemini 2.5/3.6 Flash)
  2. Image Generation (Nano Banana / Gemini Image)
  3. Voiceover Generation (ElevenLabs TTS)
  4. Video Stitching & Audio Mixing (MoviePy)
"""

import os
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple, Union

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from modules.script_gen import generate_script
from modules.image_gen import generate_scene_images
from modules.voice_gen import generate_scene_voiceovers
from modules.video_stitch import stitch_video


def _notify_progress(
    callback: Optional[Callable],
    stage_name: str,
    message: Optional[str] = None
) -> None:
    """
    Safely triggers the progress callback supporting single-argument or multi-argument signatures.
    """
    if callback is None:
        return

    try:
        import inspect
        sig = inspect.signature(callback)
        params = list(sig.parameters.values())

        if len(params) >= 2 or any(p.kind == inspect.Parameter.VAR_POSITIONAL for p in params):
            callback(stage_name, message or "")
        else:
            callback(stage_name)
    except Exception as err:
        print(f"[Pipeline Warning] Callback execution error for stage '{stage_name}': {err}")


def _find_default_background_music() -> Optional[str]:
    """
    Finds the first available royalty-free music file in backend/assets/music/.
    """
    music_dir = backend_dir / "assets" / "music"
    if music_dir.exists():
        for ext in ("*.mp3", "*.wav", "*.m4a", "*.aac"):
            matches = list(music_dir.glob(ext))
            if matches:
                return str(matches[0].resolve())
    return None


def run_pipeline(
    product_name: str,
    brief: str,
    progress_callback: Optional[Callable] = None,
    bg_music_path: Optional[str] = None,
    output_video_path: Optional[Union[str, Path]] = None,
    allow_placeholder_fallback: bool = True
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Executes the complete AI video advertisement generation pipeline.

    Stages reported to progress_callback:
      - "script"
      - "images"
      - "voiceover"
      - "editing"
      - "done"
      - "error" (if any stage fails)

    Args:
        product_name: Product or brand name.
        brief: Creative brief or product description.
        progress_callback: Optional callback callable(stage_name, message="").
        bg_music_path: Optional path to background music track.
        output_video_path: Target path for the final MP4 video.
        allow_placeholder_fallback: Fallback to rendered graphics if image quota is temporarily limited.

    Returns:
        Tuple of (path_to_final_ad_mp4, scenes_list)
    """
    print("=" * 65)
    print("🎬 CALLSHEET PIPELINE EXECUTION STARTED")
    print(f"  Product: {product_name}")
    print(f"  Brief:   {brief}")
    print("=" * 65)

    # -------------------------------------------------------------
    # Stage 1: Script Generation
    # -------------------------------------------------------------
    try:
        print("\n[Stage 1/4] Generating ad script via Gemini...")
        _notify_progress(progress_callback, "script", "Generating commercial script and scene outlines...")
        
        script_data = generate_script(product_name=product_name, brief=brief)
        scenes = script_data.get("scenes", [])
        
        if not scenes:
            raise ValueError("Script generator returned an empty scene list.")
            
        print(f"✓ Script generated successfully ({len(scenes)} scenes)")
    except Exception as err:
        print(f"❌ [Stage 1 Failed] Script generation error: {err}")
        _notify_progress(progress_callback, "error", f"Script generation failed: {err}")
        raise

    # -------------------------------------------------------------
    # Stage 2: Image Generation
    # -------------------------------------------------------------
    try:
        print("\n[Stage 2/4] Generating scene visuals...")
        _notify_progress(progress_callback, "images", f"Generating visuals for {len(scenes)} scenes...")
        
        image_paths = generate_scene_images(
            scenes=scenes,
            allow_placeholder_fallback=allow_placeholder_fallback
        )
        print(f"✓ Generated {len(image_paths)} scene images")
    except Exception as err:
        print(f"❌ [Stage 2 Failed] Image generation error: {err}")
        _notify_progress(progress_callback, "error", f"Image generation failed: {err}")
        raise

    # -------------------------------------------------------------
    # Stage 3: Voiceover Generation
    # -------------------------------------------------------------
    try:
        print("\n[Stage 3/4] Generating voiceover audio clips via ElevenLabs...")
        _notify_progress(progress_callback, "voiceover", f"Synthesizing voiceover audio for {len(scenes)} scenes...")
        
        audio_paths = generate_scene_voiceovers(scenes=scenes)
        print(f"✓ Generated {len(audio_paths)} voiceover audio tracks")
    except Exception as err:
        print(f"❌ [Stage 3 Failed] Voiceover generation error: {err}")
        _notify_progress(progress_callback, "error", f"Voiceover generation failed: {err}")
        raise

    # -------------------------------------------------------------
    # Stage 4: Video Stitching & Audio Mixing
    # -------------------------------------------------------------
    try:
        print("\n[Stage 4/4] Assembling video, applying Ken Burns zoom, and mixing audio...")
        _notify_progress(progress_callback, "editing", "Rendering vertical 1080x1920 30fps video...")

        # Resolve background music track
        selected_bg_music = bg_music_path or _find_default_background_music()
        if selected_bg_music:
            print(f"  Using background music: {selected_bg_music}")
        else:
            print("  No background music track specified (voiceover only).")

        # Extract requested durations
        scene_durations = [float(s.get("duration_seconds", 0)) for s in scenes]

        final_video_path = stitch_video(
            image_paths=image_paths,
            audio_paths=audio_paths,
            durations=scene_durations,
            bg_music_path=selected_bg_music,
            output_path=output_video_path or (backend_dir / "output" / "final_ad.mp4")
        )
        print(f"✓ Video successfully assembled at: {final_video_path}")
    except Exception as err:
        print(f"❌ [Stage 4 Failed] Video assembly error: {err}")
        _notify_progress(progress_callback, "error", f"Video stitching failed: {err}")
        raise

    # -------------------------------------------------------------
    # Done
    # -------------------------------------------------------------
    _notify_progress(progress_callback, "done", "Video generation complete!")
    print("\n🎉 CALLSHEET PIPELINE COMPLETED SUCCESSFULLY!")
    print(f"  Final Video: {final_video_path}")
    print(f"  Total Scenes: {len(scenes)}")
    print("=" * 65)

    return final_video_path, scenes


if __name__ == "__main__":
    def sample_progress(stage: str, message: str = ""):
        print(f"  [Progress Event] Stage: {stage:<12} | Info: {message}")

    test_product = "Aura Hydrate"
    test_brief = "Sparkling electrolyte water with zero sugar for clean afternoon energy and focus."

    try:
        video_file, scene_list = run_pipeline(
            product_name=test_product,
            brief=test_brief,
            progress_callback=sample_progress
        )
        print("\nPipeline Result:")
        print(f"Video File: {video_file}")
        print(f"Scene Count: {len(scene_list)}")
    except Exception as e:
        print(f"\n[Pipeline Test Error] {e}")
