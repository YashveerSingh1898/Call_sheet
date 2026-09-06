"""
Script generation module with multi-model fallback cascade.
Generates structured video ad scripts with visual descriptions and crystal-clear voiceover lines.
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
    "gemini-2.5-flash",
    "gemini-3.5-flash",
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
    Generates a high-converting, natural 4-scene commercial script with simple, crystal-clear voiceover copy.
    """
    return {
        "scenes": [
            {
                "scene_number": 1,
                "visual_description": f"Cinematic close-up of {product_name} with crisp studio lighting and ice-cold condensation.",
                "voiceover_line": f"Looking for real energy without the mid-day crash? Meet {product_name}.",
                "duration_seconds": 6
            },
            {
                "scene_number": 2,
                "visual_description": f"Dynamic lifestyle shot showing the struggle of fatigue vs instant refreshment with {brief[:70]}.",
                "voiceover_line": f"Crafted with pure ingredients to keep you sharp, hydrated, and ready for anything.",
                "duration_seconds": 6
            },
            {
                "scene_number": 3,
                "visual_description": f"Vibrant pouring shot with golden sunlight and crystal clear sparkling bubbles.",
                "voiceover_line": f"Every sip delivers crisp, refreshing flavor with zero artificial shortcuts.",
                "duration_seconds": 6
            },
            {
                "scene_number": 4,
                "visual_description": f"Hero brand packshot of {product_name} centered against a sleek studio backdrop with bright logo.",
                "voiceover_line": f"Upgrade your daily routine today. Click below to experience {product_name}.",
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
    Voiceover lines are written in clear, simple, broadcast-grade American English.
    """
    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")
    candidate_models = models or FALLBACK_MODELS

    prompt = f"""You are an elite commercial ad director and copywriter.
Create a high-converting, cinematic 16-20 second video advertisement script (4 scenes, ~4.5 seconds each) for:

Product Name: {product_name}
Creative Brief: {brief}

CRITICAL RULES FOR VOICEOVER LINES:
1. Speak in simple, crystal-clear, highly engaging spoken language.
2. Short, punchy, energetic sentences (8 to 12 words maximum per scene).
3. Highly engaging tone suited to the product and brand.
4. Scene progression:
   - Scene 1 (The Hook): A punchy hook or relatable situation highlighting the craving or need.
   - Scene 2 (The Solution): How {product_name} delivers the perfect answer.
   - Scene 3 (The Key Delight): Crisp, mouth-watering / exciting description of flavor or power.
   - Scene 4 (Call to Action): Clear, memorable invitation to visit, taste, or buy now.

Output ONLY a raw JSON object with NO markdown formatting:
{{
  "scenes": [
    {{
      "scene_number": 1,
      "visual_description": "Vibrant 3D animated cinematic close-up shot of...",
      "voiceover_line": "Simple, punchy, crystal-clear spoken line...",
      "duration_seconds": 4.5
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
                    print(f"  [Notice] Model '{model}' returned status {response.status_code}. Trying next model...")
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
