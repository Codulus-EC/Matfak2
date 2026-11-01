"use client";

import type { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

export type AdminUploadPurpose = "image" | "schedule";

function safeFilename(name: string) {
  const cleaned = name
    .replace(/[\\/\0?#%]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(-140) || "file";
}

async function directBlobUpload(
  file: File,
  purpose: AdminUploadPurpose,
  kind?: "osn" | "spo",
): Promise<PutBlobResult> {
  const filename = safeFilename(file.name);
  const prefix = purpose === "schedule"
    ? `cms/schedule/${kind || "unknown"}`
    : "cms/images";

  return await upload(`${prefix}/${Date.now()}-${filename}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/blob-upload",
    clientPayload: JSON.stringify({ purpose, kind }),
    multipart: file.size > 4 * 1024 * 1024,
  });
}

export async function uploadAdminImage(file: File) {
  try {
    const blob = await directBlobUpload(file, "image");
    return blob.url;
  } catch (blobError) {
    // Локальная разработка без Vercel Blob остаётся рабочей через старый filesystem-upload.
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await response.json().catch(() => ({})) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      throw new Error(data.error || (blobError instanceof Error ? blobError.message : "Не удалось загрузить изображение"));
    }
    return data.url;
  }
}

export async function uploadAdminSchedule(kind: "osn" | "spo", file: File) {
  try {
    const blob = await directBlobUpload(file, "schedule", kind);
    const response = await fetch("/api/admin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        originalName: file.name,
        blob: {
          url: blob.url,
          downloadUrl: blob.downloadUrl,
          pathname: blob.pathname,
          contentType: blob.contentType,
        },
      }),
    });
    const data = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) throw new Error(data.error || "Не удалось сохранить расписание");
    return;
  } catch (blobError) {
    // Fallback только для локального next dev без Blob.
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", file);
    const response = await fetch("/api/admin/schedule", { method: "POST", body: form });
    const data = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || (blobError instanceof Error ? blobError.message : "Не удалось загрузить расписание"));
    }
  }
}
