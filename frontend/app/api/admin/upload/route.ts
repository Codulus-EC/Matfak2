import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowed: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  if (!sessionFromRequest(request)) {
    return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не выбран" }, { status: 400 });
  }
  if (!allowed[file.type]) {
    return NextResponse.json({ error: "Поддерживаются JPG, PNG, WEBP и GIF" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Изображение должно быть меньше 10 МБ" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "admin");
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(5).toString("hex")}.${allowed[file.type]}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  return NextResponse.json({ url: `/uploads/admin/${filename}` }, { status: 201 });
}
