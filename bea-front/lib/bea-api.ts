const DEFAULT_CLIENT_API_BASE_URL = 'http://localhost:8081';

function resolveApiBaseUrl() {
  return process.env.NEXT_PUBLIC_CLIENT_API_BASE_URL ?? DEFAULT_CLIENT_API_BASE_URL;
}

function readToken() {
  if (globalThis.window === undefined) {
    return null;
  }

  return (
    globalThis.window.localStorage.getItem('bea_client_token') ||
    globalThis.window.sessionStorage.getItem('bea_client_token')
  );
}

async function parseError(response: Response) {
  try {
    const text = await response.text();
    return text.trim() || response.statusText || 'Request failed';
  } catch {
    return response.statusText || 'Request failed';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as T;
}

export function getJson<T>(path: string) {
  return request<T>(path, { method: 'GET' });
}

export function postJson<T>(path: string, body: unknown) {
  return request<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function postFormData<T>(path: string, formData: FormData) {
  return request<T>(path, {
    method: 'POST',
    body: formData,
  });
}