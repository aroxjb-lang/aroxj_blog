import { put } from '@vercel/blob';

export async function POST(req: Request) {
  const { pathname, fileUrl, contentType } = await req.json();

  const resp = await fetch(fileUrl);
  if (!resp.ok) return new Response('Fetch failed', { status: 400 });

  const ab = await resp.arrayBuffer();
  const buf = Buffer.from(ab);               // <-- FIX: Node Buffer

  const blob = await put(pathname, buf, {
    access: 'public',
    addRandomSuffix: false,
    contentType: contentType || resp.headers.get('content-type') || undefined,
  });

  return Response.json({ ok: true, blob });
}
