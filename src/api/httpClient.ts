import { API_CONFIG } from '../config/api.config';

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: any;

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

/**
 * Serializes an object into URL query string, omitting null/undefined values.
 */
function buildQueryString(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Builds the full URL from relative endpoint or absolute URL.
 */
function resolveUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const isAbsolute = /^https?:\/\//i.test(endpoint);
  const base = isAbsolute
    ? endpoint
    : `${API_CONFIG.BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  return `${base}${buildQueryString(params)}`;
}

/**
 * Production HTTP client wrapper using native fetch.
 */
export async function httpClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, timeoutMs = API_CONFIG.TIMEOUT_MS, headers, signal, ...rest } = options;
  const fullUrl = resolveUrl(endpoint, params);

  // Setup timeout abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link caller signal if passed
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(fullUrl, {
      ...rest,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...headers,
      },
    });

    clearTimeout(timeoutId);

    // If HTTP error code, parse error payload if present
    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      const errorMessage =
        (errorData && (errorData.message || errorData.error)) ||
        `HTTP ${response.status}: ${response.statusText || 'Request failed'}`;

      throw new ApiError(errorMessage, response.status, response.statusText, errorData);
    }

    // 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data: T = await response.json();
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms or was aborted`);
    }

    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(
      err.message || 'Network request failed. Please check your backend connection.',
      0,
      'NETWORK_ERROR'
    );
  }
}
