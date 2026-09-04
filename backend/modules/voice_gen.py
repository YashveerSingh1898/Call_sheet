"""
Voice generation module using ElevenLabs Python SDK.
Converts scene voiceover lines into high-quality spoken audio clips.
"""

import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from dotenv import find_dotenv, load_dotenv
from elevenlabs.client import ElevenLabs

# Load environment variables (.env in backend or workspace root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

# Professional, warm default voice (George: JBFqnCBsd6RMkjVDRZzb - Warm, Captivating Storyteller)
DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"
DEFAULT_MODEL_ID = "eleven_multilingual_v2"


def generate_single_voiceover(
    text: str,
    output_path: Union[str, Path],
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = DEFAULT_MODEL_ID
) -> str:
    """
    Converts a single voiceover text line to an MP3 file using ElevenLabs.

    Args:
        text: Spoken text line for the voiceover.
        output_path: Path where the audio MP3 will be saved.
        api_key: Optional ElevenLabs API key. Defaults to ELEVENLABS_API_KEY env var.
        voice_id: ElevenLabs voice ID (default: Rachel - warm, professional).
        model_id: ElevenLabs model ID (default: eleven_multilingual_v2).

    Returns:
        Absolute path to the saved MP3 audio file.
    """
    if not text or not text.strip():
        raise ValueError("Cannot generate voiceover for empty text.")

    resolved_api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not resolved_api_key:
        raise ValueError(
            "ELEVENLABS_API_KEY environment variable is not set. "
            "Please configure it in backend/.env or pass it explicitly."
        )

    save_file = Path(output_path)
    save_file.parent.mkdir(parents=True, exist_ok=True)

    client = ElevenLabs(api_key=resolved_api_key)

    # Call ElevenLabs text-to-speech convert endpoint
    audio_stream = client.text_to_speech.convert(
        voice_id=voice_id,
        text=text.strip(),
        model_id=model_id,
        output_format="mp3_44100_128"
    )

    with open(save_file, "wb") as f:
        for chunk in audio_stream:
            f.write(chunk)

    return str(save_file.resolve())


def generate_scene_voiceovers(
    scenes: List[Dict[str, Any]],
    output_dir: Optional[Union[str, Path]] = None,
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = DEFAULT_MODEL_ID
) -> List[str]:
    """
    Converts voiceover lines for each scene in the script into audio files.
    Saves each clip to backend/output/audio/scene_{n}.mp3.

    Args:
        scenes: List of scene dictionaries (from script_gen.py), each with 'scene_number' and 'voiceover_line'.
        output_dir: Directory where generated audio files are saved. Defaults to backend/output/audio.
        api_key: Optional ElevenLabs API key. Defaults to ELEVENLABS_API_KEY environment variable.
        voice_id: ElevenLabs voice identifier (default: Rachel).
        model_id: ElevenLabs model identifier (default: eleven_multilingual_v2).

    Returns:
        List of local file paths (strings) in scene order.
    """
    if not scenes:
        raise ValueError("Scenes list is empty. Nothing to generate.")

    resolved_api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not resolved_api_key:
        raise ValueError(
            "ELEVENLABS_API_KEY environment variable is not set. "
            "Please configure it in backend/.env or pass it explicitly."
        )

    # Resolve output directory
    if output_dir is None:
        target_dir = Path(__file__).resolve().parent.parent / "output" / "audio"
    else:
        target_dir = Path(output_dir)

    target_dir.mkdir(parents=True, exist_ok=True)

    generated_paths: List[str] = []
    print(f"\n[VoiceGen] Generating voiceovers for {len(scenes)} scenes with voice '{voice_id}'...")

    for i, scene in enumerate(scenes):
        scene_num = scene.get("scene_number", i + 1)
        voiceover_line = scene.get("voiceover_line", "").strip()

        if not voiceover_line:
            raise ValueError(f"Scene #{scene_num} is missing 'voiceover_line'.")

        save_file = target_dir / f"scene_{scene_num}.mp3"
        print(f"\n[Scene {scene_num}/{len(scenes)}] Converting speech...")
        print(f"  Line: \"{voiceover_line}\"")

        audio_path = generate_single_voiceover(
            text=voiceover_line,
            output_path=save_file,
            api_key=resolved_api_key,
            voice_id=voice_id,
            model_id=model_id
        )
        print(f"  ✓ Saved to: {audio_path}")
        generated_paths.append(audio_path)

    print(f"\n[VoiceGen] Successfully generated {len(generated_paths)} audio files.")
    return generated_paths


if __name__ == "__main__":
    sample_scene = {
        "scene_number": 1,
        "voiceover_line": "Craving real refreshment without the sugar crash? Meet Aura Hydrate."
    }

    print("=" * 65)
    print("Testing Callsheet Voice Generation Module (backend/modules/voice_gen.py)")
    print(f"Sample voiceover: \"{sample_scene['voiceover_line']}\"")
    print("=" * 65)

    test_output = Path(__file__).resolve().parent.parent / "output" / "audio" / "scene_1.mp3"

    try:
        audio_result = generate_single_voiceover(
            text=sample_scene["voiceover_line"],
            output_path=test_output
        )
        print(f"\n✓ Generated Voiceover Audio: {audio_result}")
    except Exception as e:
        print(f"\n[Error] {e}")
