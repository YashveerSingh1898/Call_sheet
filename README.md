# Callsheet

Callsheet is an automated AI-driven video generation pipeline with a FastAPI backend and a Next.js frontend.

## Project Structure

```
callsheet/
├── backend/
│   ├── main.py                # FastAPI app (built later)
│   ├── pipeline.py            # Orchestrator
│   ├── modules/
│   │   ├── script_gen.py      # Script generation (Google GenAI)
│   │   ├── image_gen.py       # Image generation
│   │   ├── voice_gen.py       # Voice generation (ElevenLabs)
│   │   └── video_stitch.py    # Video assembly (MoviePy)
│   ├── assets/
│   │   └── music/             # Royalty-free background music tracks
│   ├── output/                # Generated media and video files
│   ├── .env                   # API keys & environment config (not committed)
│   ├── requirements.txt       # Python dependencies
│   └── render.yaml            # Render deployment configuration
├── frontend/                  # Next.js app, built in Part B
├── .gitignore
└── README.md
```

## Setup & Installation

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure your `.env` file with required API keys:
   - `GEMINI_API_KEY`
   - `ELEVENLABS_API_KEY`

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend

The Next.js frontend will be implemented in Part B.
