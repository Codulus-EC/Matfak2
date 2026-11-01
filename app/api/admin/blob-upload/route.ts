import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const scheduleTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
  "application/octet-stream",
];

export async function POST(request: Request) {
  // Важно: auth проверяется внутри onBeforeGenerateToken. Callback от Vercel Blob
  // после завершения загрузки не несёт браузерную admin-cookie и должен пройти
  // в handleUpload, где подпись callback проверяется самим SDK.
  const body = await request.json().catch(() => null) as HandleUploadBody | null;
  if (!body) {
    return NextResponse.json({ error: "Некорректный запрос загрузки" }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!sessionFromRequest(request)) throw new Error("Требуется вход администратора");

        let payload: { purpose?: "image" | "schedule"; kind?: "osn" | "spo" } = {};
        try {
          payload = JSON.parse(clientPayload || "{}") as typeof payload;
        } catch {
          throw new Error("Некорректные параметры загрузки");
        }

        if (payload.purpose === "image") {
          if (!pathname.startsWith("cms/images/")) throw new Error("Некорректный путь изображения");
          return {
            allowedContentTypes: imageTypes,
            maximumSizeInBytes: 10 * 1024 * 1024,
            addRandomSuffix: true,
            cacheControlMaxAge: 31_536_000,
            tokenPayload: JSON.stringify(payload),
          };
        }

        if (payload.purpose === "schedule" && (payload.kind === "osn" || payload.kind === "spo")) {
          if (!pathname.startsWith(`cms/schedule/${payload.kind}/`)) throw new Error("Некорректный путь расписания");
          return {
            allowedContentTypes: scheduleTypes,
            maximumSizeInBytes: 20 * 1024 * 1024,
            addRandomSuffix: true,
            cacheControlMaxAge: 31_536_000,
            tokenPayload: JSON.stringify(payload),
          };
        }

        throw new Error("Неизвестный тип загрузки");
      },
      onUploadCompleted: async () => {
        // Метаданные сайта сохраняются отдельным авторизованным API-запросом.
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не удалось подготовить загрузку" },
      { status: 400 },
    );
  }
}
