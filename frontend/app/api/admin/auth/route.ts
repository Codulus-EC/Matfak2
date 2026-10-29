import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  createSessionToken,
  isAdminConfigured,
  requestIsSecure,
  sessionCookie,
  sessionFromRequest,
  verifyCredentials,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return NextResponse.json({
    authenticated: sessionFromRequest(request),
    configured: isAdminConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Админка не настроена: задайте MATFAK_ADMIN_PASSWORD" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({})) as { login?: string; password?: string };
  if (!verifyCredentials(String(body.login || ""), String(body.password || ""))) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionCookie(createSessionToken(), requestIsSecure(request)));
  return response;
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookie(requestIsSecure(request)));
  return response;
}
