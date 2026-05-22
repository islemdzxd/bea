import { NextRequest } from 'next/server';

const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? 'http://localhost:8080';

function isAllowedDocumentPath(path: string) {
  return /^\/api\/(credits|allocations)\/[^/]+\/documents\/[^/]+$/i.test(path);
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') ?? '';
  const token = request.nextUrl.searchParams.get('token') ?? '';

  if (!path || !isAllowedDocumentPath(path)) {
    return new Response('Invalid document path', { status: 400 });
  }

  if (!token) {
    return new Response('Missing token', { status: 401 });
  }

  // Log incoming request for debugging (server-side)
  try {
    // eslint-disable-next-line no-console
    console.log('[document-view] proxy request path=%s hasToken=%s', path, !!token);
  } catch (e) {
    /* ignore logging errors */
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    // eslint-disable-next-line no-console
    console.log('[document-view] fetched from admin status=%s content-type=%s', response.status, response.headers.get('Content-Type'));
  } catch (e) {
    /* ignore logging errors */
  }

  if (!response.ok || !response.body) {
    const message = await response.text().catch(() => 'Unable to load document');
    try {
      // eslint-disable-next-line no-console
      console.log('[document-view] admin error response status=%s body=%s', response.status, message);
    } catch (e) {
      /* ignore logging errors */
    }
    return new Response(message || 'Unable to load document', { status: response.status });
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Disposition': response.headers.get('Content-Disposition') ?? 'inline',
      'Cache-Control': 'no-store',
    },
  });
}