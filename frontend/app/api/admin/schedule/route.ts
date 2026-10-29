import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ScheduleKind = "osn" | "spo";
const allowedExtensions = new Set([".xlsx", ".xls", ".pdf"]);
const allowedMimeTypes = new Set(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", "application/pdf", "application/octet-stream"]);

export async function POST(request: Request) {
  if (!sessionFromRequest(request)) return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 });
  const form = await request.formData();
  const kind = String(form.get("kind") || "") as ScheduleKind;
  const file = form.get("file");
  if (kind !== "osn" && kind !== "spo") return NextResponse.json({ error: "Неизвестный тип расписания" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  if (file.size <= 0 || file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "Файл должен быть меньше 20 МБ" }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.has(ext) || (file.type && !allowedMimeTypes.has(file.type))) return NextResponse.json({ error: "Поддерживаются XLSX, XLS и PDF" }, { status: 400 });
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
