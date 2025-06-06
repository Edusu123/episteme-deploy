import { cookies } from "next/headers";

export async function POST(request: Request) {
  // const body = await request.json();

  // change with your own endpoint
  // const res = await fetch(`${process.env.API_BASE_URL}/logout`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     Authorization: `Bearer ${body.accessToken}`
  //   }
  // });

  const prefix = process.env.NODE_ENV === "development" ? "__Dev-" : "";
  // remove cookies after
  const cookieStore = await cookies();
  cookieStore.getAll().map((cookie) => {
    if (cookie.name.startsWith(`${prefix}dbp.`)) cookieStore.delete(cookie.name as any);
  });

  return Response.json({
    success: true,
    status: 200,
  });
}
