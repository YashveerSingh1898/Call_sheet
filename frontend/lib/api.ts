/**
 * Callsheet API Client Library.
 * Communicates with the FastAPI backend for ad generation and status polling.
 */

export interface Scene {
  scene_number: number;
  image_url: string;
  duration_seconds: number;
  visual_description?: string;
  voiceover_line?: string;
}

export interface GenerationResponse {
  job_id: string;
}

export interface StatusResponse {
  stage: "script" | "images" | "voiceover" | "editing" | "done" | "error" | string;
  error_message: string | null;
}

export interface ResultResponse {
  video_url: string;
  scenes: Scene[];
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/**
 * Helper to ensure relative URLs (like /output/videos/...) point to the backend API host.
 */
export function getAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Initiates ad generation by posting product name and brief to the backend.
 */
export async function startGeneration(
  productName: string,
  brief: string
): Promise<GenerationResponse> {
  const res = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_name: productName,
      brief: brief,
    }),
  });

  if (!res.ok) {
    let errorDetail = "Failed to start generation";
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      // Fallback to HTTP status text
      errorDetail = `Server error: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

/**
 * Polls the current processing status of a generation job.
 */
export async function pollStatus(jobId: string): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE_URL}/status/${jobId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    let errorDetail = `Failed to fetch status for job ${jobId}`;
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `Status check error: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

/**
 * Fetches the final video result and scene data once the job stage is 'done'.
 */
export async function getResult(jobId: string): Promise<ResultResponse> {
  const res = await fetch(`${API_BASE_URL}/result/${jobId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    let errorDetail = `Failed to fetch result for job ${jobId}`;
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorDetail;
    } catch {
      errorDetail = `Result fetch error: ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }

  const data: ResultResponse = await res.json();

  // Normalize relative output URLs with base URL for cross-origin frontend consumption
  return {
    video_url: getAssetUrl(data.video_url),
    scenes: (data.scenes || []).map((scene) => ({
      ...scene,
      image_url: scene.image_url
        ? getAssetUrl(scene.image_url)
        : getAssetUrl(`/output/images/scene_${scene.scene_number}.png`),
    })),
  };
}
