"""
Video stitching module using MoviePy and PIL.
Assembles photorealistic scene images with Ken Burns motion, overlays crisp on-screen subtitles,
syncs voiceover audio, and exports high-definition vertical 9:16 commercial video ads.
"""

import os
from pathlib import Path
from typing import List, Optional, Tuple, Union
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps
from moviepy import (
    AudioFileClip,
    CompositeAudioClip,
    VideoClip,
    afx,
    concatenate_videoclips,
)


def _get_font(size: int = 44) -> ImageFont.ImageFont:
    """
    Attempts to load a clean modern system sans-serif font, falling back to default.
    """
    font_candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFPro.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    for font_path in font_candidates:
        if os.path.exists(font_path):
            try:
                return ImageFont.truetype(font_path, size)
            except Exception:
                pass
    try:
        return ImageFont.load_default()
    except Exception:
        return None


def _create_ken_burns_clip(
    image_path: str,
    duration: float,
    subtitle_text: Optional[str] = None,
    product_name: Optional[str] = None,
    target_resolution: Tuple[int, int] = (1080, 1920),
    zoom_start: float = 1.0,
    zoom_end: float = 1.06,
) -> VideoClip:
    """
    Creates a VideoClip for a single scene image with smooth Ken Burns zoom animation
    and burned on-screen commercial subtitles and brand badges.
    """
    target_w, target_h = target_resolution

    # Load and fit source image to cover the target vertical canvas cleanly
    with Image.open(image_path) as raw_img:
        rgb_img = raw_img.convert("RGB")
        fitted_img = ImageOps.fit(
            rgb_img,
            (target_w, target_h),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5)
        )

    # Frame generator function computing smooth zoom crop and subtitle overlay at time t
    def make_frame(t: float) -> np.ndarray:
        progress = min(max(t / duration, 0.0), 1.0) if duration > 0 else 0.0
        scale = zoom_start + (zoom_end - zoom_start) * progress

        # Dimensions of current visible crop
        crop_w = target_w / scale
        crop_h = target_h / scale

        # Centered bounding box
        x1 = (target_w - crop_w) / 2.0
        y1 = (target_h - crop_h) / 2.0
        x2 = x1 + crop_w
        y2 = y1 + crop_h

        cropped = fitted_img.crop((x1, y1, x2, y2))
        resized = cropped.resize((target_w, target_h), resample=Image.Resampling.BILINEAR)

        draw = ImageDraw.Draw(resized, "RGBA")

        # 1. Top Brand Header Badge
        if product_name:
            hdr_text = f"• {product_name.upper()} •"
            hdr_font = _get_font(28)
            try:
                hbbox = draw.textbbox((0, 0), hdr_text, font=hdr_font)
                hw, hh = hbbox[2] - hbbox[0], hbbox[3] - hbbox[1]
                hx = (target_w - hw) // 2
                draw.rounded_rectangle(
                    [(hx - 24, 70), (hx + hw + 24, 70 + hh + 22)],
                    radius=14,
                    fill=(10, 12, 16, 200),
                    outline=(232, 163, 61, 220),
                    width=2
                )
                draw.text((hx, 80), hdr_text, fill=(232, 163, 61, 255), font=hdr_font)
            except Exception:
                pass

        # 2. Bottom Burned On-Screen Subtitle Pill
        if subtitle_text and subtitle_text.strip():
            sub_font = _get_font(42)
            words = subtitle_text.strip().split()
            lines = []
            cur_line = []
            for w in words:
                cur_line.append(w)
                if len(" ".join(cur_line)) > 30:
                    lines.append(" ".join(cur_line))
                    cur_line = []
            if cur_line:
                lines.append(" ".join(cur_line))

            line_h = 56
            total_th = len(lines) * line_h
            box_y1 = 1560 - (total_th // 2)
            box_y2 = box_y1 + total_th + 36

            max_lw = 0
            for l in lines:
                try:
                    lbb = draw.textbbox((0, 0), l, font=sub_font)
                    max_lw = max(max_lw, lbb[2] - lbb[0])
                except Exception:
                    max_lw = max(max_lw, len(l) * 22)

            box_x1 = max(40, (target_w - max_lw) // 2 - 36)
            box_x2 = min(target_w - 40, (target_w + max_lw) // 2 + 36)

            # Draw translucent frosted dark glass pill with amber edge
            draw.rounded_rectangle(
                [(box_x1, box_y1), (box_x2, box_y2)],
                radius=20,
                fill=(10, 12, 18, 225),
                outline=(232, 163, 61, 180),
                width=2
            )

            # Draw crisp white text centered in pill
            for li, line_str in enumerate(lines):
                try:
                    lbb = draw.textbbox((0, 0), line_str, font=sub_font)
                    lw = lbb[2] - lbb[0]
                    lx = (target_w - lw) // 2
                except Exception:
                    lx = box_x1 + 30
                draw.text((lx, box_y1 + 18 + (li * line_h)), line_str, fill=(255, 255, 255, 255), font=sub_font)

        return np.array(resized)

    return VideoClip(make_frame, duration=duration)


def stitch_video(
    image_paths: List[str],
    audio_paths: List[str],
    subtitles: Optional[List[str]] = None,
    product_name: Optional[str] = None,
    durations: Optional[List[float]] = None,
    bg_music_path: Optional[str] = None,
    output_path: Optional[Union[str, Path]] = None,
    target_resolution: Tuple[int, int] = (1080, 1920),
    fps: int = 30,
    zoom_start: float = 1.0,
    zoom_end: float = 1.06,
    bg_music_gain: float = 0.12
) -> str:
    """
    Combines scene images, voiceover audio clips, subtitles, and optional background music
    into a broadcast-grade commercial video.

    Returns:
        Absolute path to the exported final MP4 video.
    """
    if not image_paths or not audio_paths:
        raise ValueError("Both image_paths and audio_paths must be non-empty.")

    if len(image_paths) != len(audio_paths):
        raise ValueError(
            f"Mismatched inputs: {len(image_paths)} images provided for {len(audio_paths)} audio files."
        )

    # Resolve output file path
    if output_path is None:
        target_out = Path(__file__).resolve().parent.parent / "output" / "final_ad.mp4"
    else:
        target_out = Path(output_path)

    target_out.parent.mkdir(parents=True, exist_ok=True)

    num_scenes = len(image_paths)
    print(f"\n[VideoStitch] Assembling video from {num_scenes} scenes with on-screen subtitles...")

    scene_clips: List[VideoClip] = []
    opened_audio_clips: List[AudioFileClip] = []
    bg_clip: Optional[AudioFileClip] = None

    try:
        for idx in range(num_scenes):
            img_file = image_paths[idx]
            audio_file = audio_paths[idx]
            sub_text = subtitles[idx] if subtitles and idx < len(subtitles) else None

            if not os.path.exists(img_file):
                raise FileNotFoundError(f"Image file not found: {img_file}")
            if not os.path.exists(audio_file):
                raise FileNotFoundError(f"Audio file not found: {audio_file}")

            # Load voiceover audio clip
            voice_clip = AudioFileClip(audio_file)
            opened_audio_clips.append(voice_clip)

            # Determine scene duration based on voiceover duration or user override
            if durations and idx < len(durations) and durations[idx] and durations[idx] > 0:
                scene_duration = max(float(durations[idx]), voice_clip.duration + 0.1)
            else:
                scene_duration = voice_clip.duration + 0.2

            print(f"  Scene {idx + 1}/{num_scenes}: duration={scene_duration:.2f}s (audio={voice_clip.duration:.2f}s)")
            if sub_text:
                print(f"    Subtitle: \"{sub_text[:60]}...\"")

            # Create Ken Burns video clip with burned subtitles & header
            clip = _create_ken_burns_clip(
                image_path=img_file,
                duration=scene_duration,
                subtitle_text=sub_text,
                product_name=product_name,
                target_resolution=target_resolution,
                zoom_start=zoom_start,
                zoom_end=zoom_end,
            )

            # Overlay voiceover audio on scene clip
            clip = clip.with_audio(voice_clip)
            scene_clips.append(clip)

        # Concatenate all scene clips in order
        print("\n[VideoStitch] Concatenating scene clips...")
        final_video = concatenate_videoclips(scene_clips, method="compose")
        total_duration = final_video.duration

        print(f"[VideoStitch] Total commercial duration: {total_duration:.2f}s")

        # Mix background music if provided
        if bg_music_path and os.path.exists(bg_music_path):
            print(f"[VideoStitch] Mixing background music track: {bg_music_path} (gain: {bg_music_gain})...")
            bg_clip = AudioFileClip(bg_music_path)

            quiet_bg = bg_clip.with_effects([afx.MultiplyVolume(bg_music_gain)])
            adjusted_bg = quiet_bg.with_effects([
                afx.AudioLoop(duration=total_duration)
            ]).subclipped(0, total_duration)

            composite_audio = CompositeAudioClip([final_video.audio, adjusted_bg])
            final_video = final_video.with_audio(composite_audio)

        # Render and export the final video
        print(f"\n[VideoStitch] Rendering vertical video ({target_resolution[0]}x{target_resolution[1]} @ {fps}fps) to {target_out}...")
        final_video.write_videofile(
            str(target_out),
            fps=fps,
            codec="libx264",
            audio_codec="aac",
            preset="medium",
            logger=None
        )

        print(f"✓ Final commercial video successfully exported: {target_out}")
        return str(target_out.resolve())

    finally:
        # Cleanup all opened clips to free file handles and memory
        for clip in scene_clips:
            try:
                clip.close()
            except Exception:
                pass
        for a_clip in opened_audio_clips:
            try:
                a_clip.close()
            except Exception:
                pass
        if bg_clip:
            try:
                bg_clip.close()
            except Exception:
                pass


if __name__ == "__main__":
    from moviepy.audio.AudioClip import AudioArrayClip

    print("=" * 65)
    print("Testing Callsheet Video Stitching Module (backend/modules/video_stitch.py)")
    print("=" * 65)

    backend_dir = Path(__file__).resolve().parent.parent
    test_output_dir = backend_dir / "output" / "test"
    test_output_dir.mkdir(parents=True, exist_ok=True)

    # 1. Create 2 dummy 1080x1920 test images
    img1_path = test_output_dir / "test_img1.png"
    img2_path = test_output_dir / "test_img2.png"

    img1 = Image.new("RGB", (1080, 1920), color=(24, 32, 54))
    img2 = Image.new("RGB", (1080, 1920), color=(45, 24, 60))
    img1.save(img1_path)
    img2.save(img2_path)

    # 2. Create 2 dummy voiceover audio clips (sine tone MP3s)
    audio1_path = test_output_dir / "test_voice1.mp3"
    audio2_path = test_output_dir / "test_voice2.mp3"
    bg_music_file = test_output_dir / "test_bg_music.mp3"

    sample_rate = 44100
    # Voice 1 (2.5 seconds, 440 Hz)
    t1 = np.linspace(0, 2.5, int(sample_rate * 2.5), endpoint=False)
    sine1 = (np.sin(2 * np.pi * 440 * t1) * 0.4).reshape(-1, 1)
    a1 = AudioArrayClip(np.repeat(sine1, 2, axis=1), fps=sample_rate)
    a1.write_audiofile(str(audio1_path), fps=sample_rate, logger=None)
    a1.close()

    # Voice 2 (3.0 seconds, 550 Hz)
    t2 = np.linspace(0, 3.0, int(sample_rate * 3.0), endpoint=False)
    sine2 = (np.sin(2 * np.pi * 550 * t2) * 0.4).reshape(-1, 1)
    a2 = AudioArrayClip(np.repeat(sine2, 2, axis=1), fps=sample_rate)
    a2.write_audiofile(str(audio2_path), fps=sample_rate, logger=None)
    a2.close()

    # Background music (2.0 seconds looped, 330 Hz)
    t_bg = np.linspace(0, 2.0, int(sample_rate * 2.0), endpoint=False)
    sine_bg = (np.sin(2 * np.pi * 330 * t_bg) * 0.3).reshape(-1, 1)
    a_bg = AudioArrayClip(np.repeat(sine_bg, 2, axis=1), fps=sample_rate)
    a_bg.write_audiofile(str(bg_music_file), fps=sample_rate, logger=None)
    a_bg.close()

    # 3. Test video stitching
    try:
        final_video_path = stitch_video(
            image_paths=[str(img1_path), str(img2_path)],
            audio_paths=[str(audio1_path), str(audio2_path)],
            durations=[2.5, 3.0],
            bg_music_path=str(bg_music_file),
            output_path=backend_dir / "output" / "final_ad.mp4",
            fps=30
        )
        print(f"\n[Test Result] Generated MP4 at: {final_video_path}")
    except Exception as err:
        print(f"\n[Test Error] {err}")
