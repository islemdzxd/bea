import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

const UPLOADS_ROOT = path.resolve(process.cwd(), '..', 'bea-client', 'uploads');

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

function resolveFilePath(parts: string[]) {
  const safeParts = parts.flatMap((segment) => segment.split(/[\\/]+/)).filter(Boolean);
  const resolvedPath = path.resolve(UPLOADS_ROOT, ...safeParts);
  const relativePath = path.relative(UPLOADS_ROOT, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return resolvedPath;
}

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await context.params;
  const filePath = resolveFilePath(pathSegments);

  if (!filePath) {
    return new Response('Invalid file path', { status: 400 });
  }

  try {
    const file = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);

    return new Response(file, {
      headers: {
        'Content-Type': getContentType(filePath),
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('File not found', { status: 404 });
  }
}