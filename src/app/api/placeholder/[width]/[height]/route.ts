import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  _req: Request,
  context: { params: { width?: string; height?: string } }
) {
  const { width = '150', height = '150' } = context.params || {};

  const w = Math.max(16, Math.min(1024, parseInt(width as string, 10) || 150));
  const h = Math.max(16, Math.min(1024, parseInt(height as string, 10) || 150));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE1D3" />
      <stop offset="100%" stop-color="#F3D8F7" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="${Math.floor(
    Math.min(w, h) / 6
  )}" font-family="-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial" fill="#FF7F50">${w}×${h}</text>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
