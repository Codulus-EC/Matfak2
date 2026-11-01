import { del, list, put } from "@vercel/blob";

const JSON_CACHE_SECONDS = 60;

export function blobStorageEnabled() {
  return Boolean(
    process.env.VERCEL === "1" ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_OIDC_TOKEN,
  );
}

function snapshotPath(prefix: string) {
  const stamp = String(Date.now()).padStart(13, "0");
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}${stamp}-${random}.json`;
}

export async function readLatestBlobJson<T>(prefix: string): Promise<T | null> {
  if (!blobStorageEnabled()) return null;

  const result = await list({ prefix, limit: 1000 });
  if (!result.blobs.length) return null;

  const latest = [...result.blobs].sort((a, b) => a.pathname.localeCompare(b.pathname)).at(-1);
  if (!latest) return null;

  const response = await fetch(`${latest.url}?v=${encodeURIComponent(latest.pathname)}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;

  return await response.json() as T;
}

export async function writeBlobJsonSnapshot(prefix: string, value: unknown) {
  if (!blobStorageEnabled()) {
    throw new Error("Vercel Blob не настроен");
  }

  const stored = await put(snapshotPath(prefix), JSON.stringify(value, null, 2), {
    access: "public",
    addRandomSuffix: false,
    cacheControlMaxAge: JSON_CACHE_SECONDS,
    contentType: "application/json; charset=utf-8",
  });

  // Оставляем несколько последних снимков как простой rollback, старые чистим.
  try {
    const result = await list({ prefix, limit: 1000 });
    const ordered = [...result.blobs].sort((a, b) => a.pathname.localeCompare(b.pathname));
    const stale = ordered.slice(0, Math.max(0, ordered.length - 10)).map((blob) => blob.url);
    if (stale.length) await del(stale);
  } catch {
    // Очистка не должна ломать сохранение контента.
  }

  return stored;
}
