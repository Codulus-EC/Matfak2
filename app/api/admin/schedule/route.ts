import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";
import { blobStorageEnabled } from "@/lib/blobStore";
import { readScheduleMeta, writeScheduleMeta, type ScheduleKind } from "@/lib/scheduleStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedExtensions = new Set([".xlsx", ".xls", ".pdf"]);
const allowedMimeTypes = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "application/octet-stream",
]);

function validKind(value: string): value is ScheduleKind {
  return value === "osn" || value === "spo";
}

function validBlobHost(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function saveBlobMetadata(request: Request) {
  const body = await request.json().catch(() => null) as {
    kind?: string;
    originalName?: string;
    blob?: { url?: string; downloadUrl?: string; pathname?: string; contentType?: string };
  } | null;

  const kind = String(body?.kind || "");
  const originalName = String(body?.originalName || "").trim();
  const blob = body?.blob;
  if (!validKind(kind) || !originalName || !blob?.url || !blob.pathname) {
    return NextResponse.json({ error: "Некорректные данные расписания" }, { status: 400 });
  }

  const ext = path.extname(originalName).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return NextResponse.json({ error: "Поддерживаются XLSX, XLS и PDF" }, { status: 400 });
  }
  if (!blob.pathname.startsWith(`cms/schedule/${kind}/`) || !validBlobHost(blob.url)) {
    return NextResponse.json({ error: "Некорректный файл Blob" }, { status: 400 });
  }

  const contentType = String(blob.contentType || "application/octet-stream");
  if (contentType && !allowedMimeTypes.has(contentType)) {
    return NextResponse.json({ error: "Недопустимый тип файла" }, { status: 400 });
  }

  const meta = await readScheduleMeta();
  meta[kind] = {
    url: blob.url,
    downloadUrl: String(blob.downloadUrl || `${blob.url}?download=1`),
    pathname: blob.pathname,
    originalName,
    type: contentType,
    updatedAt: new Date().toISOString(),
  };
  await writeScheduleMeta(meta);

  return NextResponse.json({ ok: true, kind, name: originalName });
}

async function saveLocalFile(request: Request) {
  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      { error: "Vercel Blob не подключён. Создайте Public Blob store в Storage проекта." },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const kind = String(form.get("kind") || "");
  const file = form.get("file");
  if (!validKind(kind)) return NextResponse.json({ error: "Неизвестный тип расписания" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  if (file.size <= 0 || file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "Файл должен быть меньше 20 МБ" }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.has(ext) || (file.type && !allowedMimeTypes.has(file.type))) {
    return NextResponse.json({ error: "Поддерживаются XLSX, XLS и PDF" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "data", "schedule");
  await fs.mkdir(dir, { recursive: true });
  const storedName = `${kind}${ext}`;
  await fs.writeFile(path.join(dir, storedName), Buffer.from(await file.arrayBuffer()));

  const metaPath = path.join(dir, "meta.json");
  let meta: Record<string, { storedName: string; originalName: string; type: string; updatedAt: string }> = {};
  try { meta = JSON.parse(await fs.readFile(metaPath, "utf8")); } catch { meta = {}; }
  const previous = meta[kind]?.storedName;
  if (previous && previous !== storedName) await fs.rm(path.join(dir, previous), { force: true }).catch(() => undefined);
  meta[kind] = { storedName, originalName: file.name, type: file.type || "application/octet-stream", updatedAt: new Date().toISOString() };
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf8");

  return NextResponse.json({ ok: true, kind, name: file.name });
}

export async function POST(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    if (!blobStorageEnabled()) {
      return NextResponse.json({ error: "Vercel Blob не настроен" }, { status: 503 });
    }
    return saveBlobMetadata(request);
  }

  return saveLocalFile(request);
}
