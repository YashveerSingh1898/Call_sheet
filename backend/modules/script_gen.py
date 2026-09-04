"""
Script generation module with multi-model fallback cascade.
Generates structured video ad scripts with visual descriptions and voiceover lines.
"""

import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
import requests
from dotenv import find_dotenv, load_dotenv

# Load environment variables (.env in backend or workspace root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv(find_dotenv())

FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
]


def _clean_and_parse_json(raw_text: str) -> Dict[str, Any]:
    """
    Defensively strips markdown code fences and parses JSON text.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Received empty response from model.")

    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

    data = json.loads(cleaned)
    if not isinstance(data, dict) or "scenes" not in data or not isinstance(data["scenes"], list):
        raise ValueError("Parsed JSON missing 'scenes' list.")

    return data


def _generate_dynamic_fallback_script(product_name: str, brief: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Generates a commercial script specifically for the provided product and brief
    if remote API endpoints are temporarily unavailable.
    """
    return {
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": f"Cinematic extreme close-up of {product_name} in warm, dramatic studio lighting with crisp focus.",
                "voiceover_line": f"Tired of compromise? It's time to upgrade your daily standard with {product_name}.",
                "duration_seconds": 6
            },
            {
                "scene_number": 2,
                "visual_description": f"Dynamic tracking shot showcasing {brief[:80]}, highlighting effortless performance and quality.",
                "voiceover_line": f"Engineered for real results: {brief[:90]}.",
                "duration_seconds": 6
            },
            {
                "scene_number": 3,
                "visual_description": f"Macro lifestyle shot with natural golden hour lighting, radiating confidence, energy, and premium appeal.",
                "voiceover_line": f"Experience the difference that {product_name} brings to your routine every single day.",
                "duration_seconds": 6
            },
            {
                "scene_number": 4,
                "visual_description": f"Clean centered hero packshot of {product_name} with bold typography and official brand watermark.",
                "voiceover_line": f"Discover {product_name} today. Tap the link to get yours now.",
                "duration_seconds": 6
            }
        ]
    }


def generate_script(
    product_name: str,
    brief: str,
    api_key: Optional[str] = None,
    models: Optional[List[str]] = None
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Generates a 4-scene (24s total) ad script using Gemini with automatic multi-model fallback cascade.
    """
    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")
    candidate_models = models or FALLBACK_MODELS

    prompt = f"""You are an award-winning commercial video director and copywriter.
Create a high-converting, cinematic 20-25 second video advertisement script for:

Product Name: {product_name}
Creative Brief: {brief}

Guidelines:
- Create exactly 4 scenes.
- Total duration ~24 seconds (each scene ~6 seconds).
- Visual descriptions must be detailed, vivid, cinematic, and tailored for advertising photography.
- Voiceover lines must be punchy, natural, and conversational.
- Progression: Hook (Scene 1) -> Relatability -> Solution/Feature -> Call to Action.

Output ONLY a raw JSON object with NO markdown formatting:
{{
  "scenes": [
    {{
      "scene_number": 1,
      "visual_description": "Cinematic close-up shot of...",
      "voiceover_line": "Catchy opening hook line...",
      "duration_seconds": 6
    }}
  ]
}}
"""

    if resolved_api_key:
        for model in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={resolved_api_key}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.7
                }
            }

            try:
                print(f"[ScriptGen] Querying Gemini model '{model}'...")
                response = requests.post(url, json=payload, timeout=12)
                if response.status_code == 200:
                    resp_json = response.json()
                    candidates = resp_json.get("candidates", [])
                    if candidates:
                        raw_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        parsed = _clean_and_parse_json(raw_text)
                        print(f"✓ [ScriptGen] Successfully generated script via '{model}'")
                        return parsed
                else:
                    print(f"  [Notice] Model '{model}' returned status {response.status_code} ({response.text[:80]}). Trying next model...")
            except Exception as exc:
                print(f"  [Notice] Error on model '{model}': {exc}. Trying next candidate...")

    # Fallback to dynamic tailored script if all remote API models are overloaded
    print("[ScriptGen] Using dynamic tailored commercial script fallback.")
    return _generate_dynamic_fallback_script(product_name, brief)


if __name__ == "__main__":
    sample_product = "Aura Spark"
    sample_brief = "Sparkling electrolyte water for afternoon focus with zero sugar."

    res = generate_script(sample_product, sample_brief)
    print("\nResult:")
    print(json.dumps(res, indent=2))
