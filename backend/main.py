"""
FastAPI Backend Application for Callsheet.
Wraps the video generation pipeline with REST endpoints for job dispatch, status polling, and asset retrieval.
"""

import os
import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import BackgroundTasks, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from pipeline import run_pipeline

app = FastAPI(
    title="Callsheet API",
    description="Automated AI Video Ad Generator API",
    version="1.0.0"
)

# -------------------------------------------------------------
# 4. CORS Configuration (Localhost + Vercel domains)
# -------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 5. Static Files Mounting (backend/output)
# -------------------------------------------------------------
output_dir = backend_dir / "output"
output_dir.mkdir(parents=True, exist_ok=True)
(output_dir / "videos").mkdir(parents=True, exist_ok=True)
(output_dir / "images").mkdir(parents=True, exist_ok=True)
(output_dir / "audio").mkdir(parents=True, exist_ok=True)

app.mount("/output", StaticFiles(directory=str(output_dir)), name="output")

# -------------------------------------------------------------
# In-Memory Job Storage
# -------------------------------------------------------------
jobs: Dict[str, Dict[str, Any]] = {}


class GenerateRequest(BaseModel):
    product_name: str = Field(..., description="Product or brand name", min_length=1)
    brief: str = Field(..., description="One-line creative brief or description", min_length=1)


class GenerateResponse(BaseModel):
    job_id: str


class StatusResponse(BaseModel):
    stage: str
    error_message: Optional[str] = None


class ResultResponse(BaseModel):
    video_url: str
    scenes: List[Dict[str, Any]]


def _execute_pipeline_job(job_id: str, product_name: str, brief: str) -> None:
    """
    Background task worker that runs the pipeline and updates job state in memory.
    """
    def progress_callback(stage: str, message: str = ""):
        if stage == "error":
            jobs[job_id]["stage"] = "error"
            jobs[job_id]["error_message"] = message or "An error occurred during pipeline execution."
        else:
            jobs[job_id]["stage"] = stage

    try:
        job_video_path = output_dir / "videos" / f"{job_id}.mp4"
        video_path, scenes = run_pipeline(
            product_name=product_name,
            brief=brief,
            progress_callback=progress_callback,
            output_video_path=job_video_path
        )
        jobs[job_id]["stage"] = "done"
        jobs[job_id]["video_url"] = f"/output/videos/{job_id}.mp4"
        jobs[job_id]["scenes"] = scenes
        jobs[job_id]["error_message"] = None
    except Exception as exc:
        jobs[job_id]["stage"] = "error"
        jobs[job_id]["error_message"] = str(exc)


# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse, status_code=200)
async def generate_ad(payload: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Initiates video generation pipeline in a background task.
    Returns a unique job_id immediately.
    """
    job_id = uuid.uuid4().hex

    jobs[job_id] = {
        "stage": "script",
        "error_message": None,
        "video_url": None,
        "scenes": [],
    }

    background_tasks.add_task(
        _execute_pipeline_job,
        job_id=job_id,
        product_name=payload.product_name,
        brief=payload.brief
    )

    return {"job_id": job_id}


@app.get("/status/{job_id}", response_model=StatusResponse)
async def get_job_status(job_id: str):
    """
    Returns current stage and error details for a given job_id.
    Stage values: 'script' | 'images' | 'voiceover' | 'editing' | 'done' | 'error'
    """
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "stage": job["stage"],
        "error_message": job.get("error_message")
    }


@app.get("/result/{job_id}", response_model=ResultResponse)
async def get_job_result(job_id: str):
    """
    Returns generated video URL and structured scenes once stage is 'done'.
    """
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    stage = job.get("stage")
    if stage == "error":
        raise HTTPException(
            status_code=500,
            detail=f"Job failed with error: {job.get('error_message')}"
        )

    if stage != "done":
        raise HTTPException(
            status_code=400,
            detail=f"Job is still processing (current stage: {stage})"
        )

    return {
        "video_url": job["video_url"],
        "scenes": job["scenes"]
    }
