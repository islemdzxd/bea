const DEFAULT_ADMIN_API_BASE_URL = 'http://localhost:8080';
const BROWSER_PROXY_PREFIX = '/api-admin';

function isAbsoluteUrl(path: string) {
  return /^https?:\/\//i.test(path);
}

export function getAdminApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL.replace(/\/$/, '');
  }
  if (globalThis.window !== undefined) {
    return BROWSER_PROXY_PREFIX;
  }
  return DEFAULT_ADMIN_API_BASE_URL;
}

function buildUrl(path: string): string {
  if (isAbsoluteUrl(path)) {
    return path;
  }
  const base = getAdminApiBaseUrl();
  if (base === BROWSER_PROXY_PREFIX) {
    return `${BROWSER_PROXY_PREFIX}${path.replace(/^\/api/, '')}`;
  }
  return `${base}${path}`;
}

export function getAdminToken() {
  if (globalThis.window === undefined) return null;
  return globalThis.window.localStorage.getItem('bea_admin_token');
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    if (data?.message) return data.message;
  } catch {
    /* ignore */
  }
  return response.statusText || 'Requête échouée';
}

export async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (init?.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      ...init,
      headers,
    });
  } catch {
    throw new Error(
      'Impossible de joindre bea-admin. Démarrez-le sur le port 8080 (mvn spring-boot:run dans bea-admin).'
    );
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function adminGet<T>(path: string) {
  return adminRequest<T>(path, { method: 'GET' });
}

export function adminPost<T>(path: string, body?: unknown) {
  return adminRequest<T>(path, {
    method: 'POST',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function adminDownload(path: string) {
  const token = getAdminToken();
  const downloadPath = isAbsoluteUrl(path)
    ? path
    : path.startsWith('/api/')
    ? buildUrl(path)
    : `${getAdminApiBaseUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(downloadPath, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new Error('Impossible de télécharger le document (bea-admin indisponible).');
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function adminCreateBlobUrl(path: string) {
  const token = getAdminToken();
  const downloadPath = isAbsoluteUrl(path)
    ? path
    : path.startsWith('/api/')
    ? buildUrl(path)
    : `${getAdminApiBaseUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(downloadPath, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new Error('Impossible de charger le document (bea-admin indisponible).');
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function adminFetchBlob(path: string) {
  const token = getAdminToken();
  const downloadPath = isAbsoluteUrl(path)
    ? path
    : path.startsWith('/api/')
    ? buildUrl(path)
    : `${getAdminApiBaseUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(downloadPath, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch {
    throw new Error('Impossible de charger le document (bea-admin indisponible).');
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return await response.blob();
}
