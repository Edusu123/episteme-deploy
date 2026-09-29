import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.json();

  const prefix = process.env.NODE_ENV === 'development' ? '__Dev-' : '';

  const cookieStore = await cookies();
  const payload = {
    refreshToken: cookieStore.get(`${prefix}dbp.refresh-token` as any)?.value,
    userId: body.userID
  };

  // change it with your own endpoint
  const res = await fetch(`${process.env.API_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  return Response.json({
    success: res.ok,
    status: res.status,
    data
  });
}
