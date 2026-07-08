const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tubhyamoffical.onrender.com/api';

// Hard timeout for all API calls (ms). Render free tier can cold-start
// for 30–60+ seconds; this ensures the UI never hangs indefinitely.
const DEFAULT_TIMEOUT_MS = 8000;

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Build a combined AbortController that merges the caller's signal (if
  // any) with a hard timeout, so every request is guaranteed to settle.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const onCallerAbort = () => controller.abort();
  if (options?.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', onCallerAbort);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Distinguish caller abort from our own timeout.
      if (options?.signal?.aborted) throw err;
      throw new ApiError(
        408,
        `Request to ${endpoint} timed out after ${DEFAULT_TIMEOUT_MS}ms (backend may be cold-starting)`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    if (options?.signal) options.signal.removeEventListener('abort', onCallerAbort);
  }
};

export const api = {
  get: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'GET', signal }),
  post: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), signal }),
  put: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), signal }),
  patch: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), signal }),
  delete: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'DELETE', signal }),
};

export { ApiError };
