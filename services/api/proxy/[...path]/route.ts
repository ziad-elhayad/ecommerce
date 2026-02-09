import { NextResponse } from 'next/server';

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1';

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const url = `${BASE_URL}/${params.path.join('/')}`;
  const res = await fetch(url, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
    },
    cache: 'no-store',
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const body = await req.json();
  const url = `${BASE_URL}/${params.path.join('/')}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.get('authorization') || '',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
