"""
Voice generation module using ElevenLabs and Edge-TTS.
Converts scene voiceover lines into crystal-clear, high-converting spoken commercial audio.
"""

import asyncio
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from dotenv import find_dotenv, load_dotenv

# Load environment variables (.env in backend or workspace root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

# Professional American commercial voice: Sarah (EXAVITQu4vr4xnSDxMaL) - Crisp, Confident, Reassuring
DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"
DEFAULT_MODEL_ID = "eleven_turbo_v2_5"
FALLBACK_MODEL_ID = "eleven_multilingual_v2"


async def _generate_edge_tts_voiceover(text: str, output_path: Path, voice: str = "en-US-ChristopherNeural") -> str:
    """
    Generates voiceover audio using high-fidelity Edge-TTS with clear commercial diction.
    """
    import edge_tts
    communicate = edge_tts.Communicate(text=text.strip(), voice=voice, rate="-4%")
    await communicate.save(str(output_path))
    return str(output_path.resolve())


def generate_single_voiceover(
    text: str,
    output_path: Union[str, Path],
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = DEFAULT_MODEL_ID
) -> str:
    """
    Converts a single voiceover text line to an MP3 file using ElevenLabs or EdgeTTS.

    Args:
        text: Spoken text line for the voiceover.
        output_path: Path where the audio MP3 will be saved.
        api_key: Optional ElevenLabs API key. Defaults to ELEVENLABS_API_KEY env var.
        voice_id: ElevenLabs voice ID.
        model_id: ElevenLabs model ID.

    Returns:
        Absolute path to the saved MP3 audio file.
    """
    if not text or not text.strip():
        raise ValueError("Cannot generate voiceover for empty text.")

    save_file = Path(output_path)
    save_file.parent.mkdir(parents=True, exist_ok=True)

    resolved_api_key = api_key or os.getenv("ELEVENLABS_API_KEY")

    # 1. Try ElevenLabs
    if resolved_api_key:
        try:
            from elevenlabs.client import ElevenLabs
            client = ElevenLabs(api_key=resolved_api_key)

            # Try Turbo model first for fast, crisp audio
            try:
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
            except Exception as turbo_err:
                print(f"    [VoiceGen Notice] Turbo model error: {turbo_err}. Trying multilingual model...")
                audio_stream = client.text_to_speech.convert(
                    voice_id=voice_id,
                    text=text.strip(),
                    model_id=FALLBACK_MODEL_ID,
                    output_format="mp3_44100_128"
                )
                with open(save_file, "wb") as f:
                    for chunk in audio_stream:
                        f.write(chunk)
                return str(save_file.resolve())

        except Exception as eleven_err:
            print(f"    [VoiceGen Warning] ElevenLabs synthesis error: {eleven_err}. Falling back to EdgeTTS...")

    # 2. Fallback to EdgeTTS
    try:
        asyncio.run(_generate_edge_tts_voiceover(text, save_file))
        if save_file.exists() and save_file.stat().st_size > 500:
            return str(save_file.resolve())
    except Exception as edge_err:
        print(f"    [VoiceGen Warning] EdgeTTS failed: {edge_err}. Attempting local system speech fallback...")

    # 3. Fallback to macOS local system TTS (/usr/bin/say)
    try:
        import subprocess
        aiff_file = save_file.with_suffix(".aiff")
        subprocess.run(["/usr/bin/say", "-o", str(aiff_file), text.strip()], check=True)
        if aiff_file.exists():
            return str(aiff_file.resolve())
    except Exception as local_err:
        print(f"    [VoiceGen Error] Local TTS failed: {local_err}")

    raise RuntimeError("All voice synthesis providers (ElevenLabs, EdgeTTS, local TTS) failed.")


def generate_scene_voiceovers(
    scenes: List[Dict[str, Any]],
    output_dir: Optional[Union[str, Path]] = None,
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = DEFAULT_MODEL_ID
) -> List[str]:
    """
    Converts voiceover lines for each scene in the script into crystal-clear audio files.
    Saves each clip to backend/output/audio/scene_{n}.mp3.

    Returns:
        List of local file paths (strings) in scene order.
    """
    if not scenes:
        raise ValueError("Scenes list is empty. Nothing to generate.")

    # Resolve output directory
    if output_dir is None:
        target_dir = Path(__file__).resolve().parent.parent / "output" / "audio"
    else:
        target_dir = Path(output_dir)

    target_dir.mkdir(parents=True, exist_ok=True)

    generated_paths: List[str] = []
    print(f"\n[VoiceGen] Synthesizing crystal-clear voiceovers for {len(scenes)} scenes...")

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
            api_key=api_key,
            voice_id=voice_id,
            model_id=model_id
        )
        print(f"  ✓ Audio track saved: {audio_path}")
        generated_paths.append(audio_path)

    print(f"\n[VoiceGen] Successfully generated {len(generated_paths)} audio files.")
    return generated_paths


if __name__ == "__main__":
    sample_scene = {
        "scene_number": 1,
        "voiceover_line": "Looking for real energy without the mid-day crash? Meet Aura Hydrate."
    }

    print("=" * 65)
    print("Testing Callsheet Voice Generation Module")
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
