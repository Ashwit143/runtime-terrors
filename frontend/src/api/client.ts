// Determine API Base URL from environment variable or relative /api
function getApiBase(): string {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  return '/api';
}

const API_BASE = getApiBase();

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
    if (contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}));
      errorMessage = errorData.error || errorData.message || errorMessage;
    } else {
      const text = await response.text().catch(() => '');
      if (text) {
        errorMessage = `${errorMessage} (${text.slice(0, 100)})`;
      }
    }
    throw new Error(errorMessage);
  }

  if (contentType.includes('application/json')) {
    return response.json();
  }

  // Fallback if server returned text/empty
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Expected JSON response from ${url}, but received content-type '${contentType}': ${text.slice(0, 80)}`);
  }
}
