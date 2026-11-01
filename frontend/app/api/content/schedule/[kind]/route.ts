import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { blobStorageEnabled } from "@/lib/blobStore";
import { readScheduleMeta, type ScheduleKind } from "@/lib/scheduleStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallback: Record<ScheduleKind, string> = {
  osn: "/files/schedule/Raspisanie_26-27__1_semestr_4_sentyabrya.xlsx",
  spo: "/files/schedule/SPO_Raspisanie_1_semestr.xlsx",
};

function contentDisposition(filename: string) {
  const safeAscii = filename.replace(/[^\x20-\x7E]+/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${safeAscii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(request: Request, context: { params: Promise<{ kind: string }> }) {
  const { kind: rawKind } = await context.params;
  if (rawKind !== "osn" && rawKind !== "spo") {
    return NextResponse.json({ error: "Расписание не найдено" }, { status: 404 });
  }
  const kind = rawKind as ScheduleKind;

  if (blobStorageEnabled()) {
    const meta = await readScheduleMeta();
    const item = meta[kind];
    if (item?.downloadUrl && item.downloadUrl.startsWith("https://")) {
      return NextResponse.redirect(item.downloadUrl, 307);
    }
    return NextResponse.redirect(new URL(fallback[kind], request.url), 307);
  }

  // Локальный режим: если через админку был загружен файл, отдаем его напрямую.
  const dir = path.join(process.cwd(), "data", "schedule");
  try {
    const meta = JSON.parse(await fs.readFile(path.join(dir, "meta.json"), "utf8")) as Record<string, { storedName?: string; originalName?: string; type?: string }>;
    const item = meta[kind];
    if (item?.storedName) {
      const buffer = await fs.readFile(path.join(dir, item.storedName));
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": item.type || "application/octet-stream",
          "Content-Disposition": contentDisposition(item.originalName || item.storedName),
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  } catch {
    // Используем статический fallback ниже.
  }

  return NextResponse.redirect(new URL(fallback[kind], request.url), 307);
}
