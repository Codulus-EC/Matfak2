import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "matfak_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function adminLogin() {
  return process.env.MATFAK_ADMIN_LOGIN?.trim() || "admin";
}

function adminPassword() {
  return process.env.MATFAK_ADMIN_PASSWORD || "";
}

function secret() {
  const configured = process.env.MATFAK_ADMIN_SECRET?.trim();
  if (configured) return configured;
  return createHmac("sha256", "matfak-admin-fallback")
    .update(adminPassword())
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function isAdminConfigured() {
  return Boolean(adminPassword());
}

export function verifyCredentials(login: string, password: string) {
  if (!isAdminConfigured()) return false;
  return safeEqual(login, adminLogin()) && safeEqual(password, adminPassword());
}

export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({
    login: adminLogin(),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { login?: string; exp?: number };
    return data.login === adminLogin() && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function sessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return verifySessionToken(value ? decodeURIComponent(value) : undefined);
}

export function requestIsSecure(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded) return forwarded === "https";
  return new URL(request.url).protocol === "https:";
}

export function sessionCookie(token: string, secure = false) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookie(secure = false) {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}
