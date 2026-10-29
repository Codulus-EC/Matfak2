import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ScheduleKind = "osn" | "spo";
type ScheduleMeta = { storedName: string; originalName: string; type: string; updatedAt: string };
const fallback: Record<ScheduleKind, { path: string; name: string; type: string }> = {
  osn: { path: path.join(process.cwd(), "public", "files", "schedule", "Raspisanie_26-27__1_semestr_4_sentyabrya.xlsx"), name: "Расписание ОСН.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  spo: { path: path.join(process.cwd(), "public", "files", "schedule", "SPO_Raspisanie_1_semestr.xlsx"), name: "Расписание СПО.xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
};
function contentDisposition(filename: string) {
  const safeAscii = filename.replace(/[^\x20-\x7E]+/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
export async function GET(_request: Request, context: { params: Promise<{ kind: string }> }) {
  const { kind: rawKind } = await context.params;
  if (rawKind !== "osn" && rawKind !== "spo") return NextResponse.json({ error: "Расписание не найдено" }, { status: 404 });
  const kind = rawKind as ScheduleKind;
  const dir = path.join(process.cwd(), "data", "schedule");
  let meta: Record<string, ScheduleMeta> = {};
  try { meta = JSON.parse(await fs.readFile(path.join(dir, "meta.json"), "utf8")); } catch { meta = {}; }
  const item = meta[kind];
  if (item?.storedName) {
    try {
      const buffer = await fs.readFile(path.join(dir, item.storedName));
      return new NextResponse(buffer, { status: 200, headers: { "Content-Type": item.type || "application/octet-stream", "Content-Disposition": contentDisposition(item.originalName || item.storedName), "Cache-Control": "no-store, max-age=0" } });
    } catch {}
  }
  try {
    const source = fallback[kind];
    const buffer = await fs.readFile(source.path);
    return new NextResponse(buffer, { status: 200, headers: { "Content-Type": source.type, "Content-Disposition": contentDisposition(source.name), "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ error: "Файл расписания пока не загружен" }, { status: 404 });
  }
}
