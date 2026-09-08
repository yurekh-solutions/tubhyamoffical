/**
 * AI Try-On API Service
 *
 * Calls go through the Express backend proxy (server/routes/tryon.js) using
 * RELATIVE /api/try-on/* paths — in dev the Vite proxy forwards them to
 * localhost:5000, in production Vercel rewrites handle it. The Express proxy
 * then forwards to the Python CatVTON/Stable Diffusion service
 * (ai-tryon-service/server.py, default http://localhost:8000).
 *
 * Set VITE_TRYON_API_URL (e.g. http://localhost:8000) to bypass the proxy and
 * hit the Python service directly.
 *
 * AI generation takes 30–90s on a consumer GPU, so this uses a long timeout
 * (unlike the 8s hard timeout in config/api.ts which is for the main backend).
 */

const TRYON_BASE_URL = import.meta.env.VITE_TRYON_API_URL || '';
const TRYON_TIMEOUT_MS = 180_000; // 3 minutes — AI generation is slow

export type TryOnBodyType = 'slim' | 'average' | 'plus-size';

export interface TryOnOptions {
  personFile: File;
  garmentUrl: string;
  bodyType?: TryOnBodyType;
  skinTone?: string;
  signal?: AbortSignal;
}

/**
 * Check whether the AI try-on service is running.
 */
export async function checkTryOnService(signal?: AbortSignal): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const onCallerAbort = () => controller.abort();
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener('abort', onCallerAbort);
    }

    const res = await fetch(`${TRYON_BASE_URL}/api/try-on/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onCallerAbort);

    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Fetch a product image and convert it to a File so it can be sent
 * to the AI backend as multipart form data.
 */
async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load product image: ${url}`);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

/**
 * Generate a virtual try-on image.
 * Returns an object URL for the generated PNG.
 */
export async function generateTryOn({
  personFile,
  garmentUrl,
  bodyType = 'average',
  skinTone = 'medium',
  signal,
}: TryOnOptions): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRYON_TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort);
  }

  try {
    const garmentFile = await urlToFile(garmentUrl, 'garment.jpg');

    const formData = new FormData();
    formData.append('person_image', personFile);
    formData.append('garment_image', garmentFile);
    formData.append('body_type', bodyType);
    formData.append('skin_tone', skinTone);

    const res = await fetch(`${TRYON_BASE_URL}/api/try-on`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.detail) detail = err.detail;
      } catch { /* ignore parse errors */ }
      throw new Error(detail);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (signal?.aborted) throw err;
      throw new Error('AI generation timed out after 3 minutes. Try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onCallerAbort);
  }
}

export interface AiModelOptions {
  garmentUrl: string;
  bodyType: TryOnBodyType;
  skinTone?: string;
  signal?: AbortSignal;
}

/**
 * Generate an AI fashion model (body type + skin tone controlled) wearing
 * the given garment. Used for products without pre-generated try-on photos.
 */
export async function generateAiModel({
  garmentUrl,
  bodyType,
  skinTone = 'medium',
  signal,
}: AiModelOptions): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRYON_TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort);
  }

  try {
    const garmentFile = await urlToFile(garmentUrl, 'garment.jpg');

    const formData = new FormData();
    formData.append('garment_image', garmentFile);
    formData.append('body_type', bodyType);
    formData.append('skin_tone', skinTone);

    const res = await fetch(`${TRYON_BASE_URL}/api/try-on/ai-model`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.detail) detail = err.detail;
      } catch { /* ignore parse errors */ }
      throw new Error(detail);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (signal?.aborted) throw err;
      throw new Error('AI generation timed out after 3 minutes. Try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onCallerAbort);
  }
}
