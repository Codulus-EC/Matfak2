import { promises as fs } from "node:fs";
import path from "node:path";
import { blobStorageEnabled, readLatestBlobJson, writeBlobJsonSnapshot } from "./blobStore";

export type ScheduleKind = "osn" | "spo";

export type ScheduleMetaItem = {
  url: string;
  downloadUrl: string;
  pathname: string;
  originalName: string;
  type: string;
  updatedAt: string;
};

export type ScheduleMeta = Partial<Record<ScheduleKind, ScheduleMetaItem>>;

const BLOB_PREFIX = "cms/schedule-meta/";
const localDir = path.join(process.cwd(), "data", "schedule");
const localMetaPath = path.join(localDir, "meta.json");

export async function readScheduleMeta(): Promise<ScheduleMeta> {
  if (blobStorageEnabled()) {
    try {
      return (await readLatestBlobJson<ScheduleMeta>(BLOB_PREFIX)) || {};
    } catch {
      return {};
    }
  }

  try {
    return JSON.parse(await fs.readFile(localMetaPath, "utf8")) as ScheduleMeta;
  } catch {
    return {};
  }
}

export async function writeScheduleMeta(meta: ScheduleMeta) {
  if (blobStorageEnabled()) {
    await writeBlobJsonSnapshot(BLOB_PREFIX, meta);
    return;
  }

  await fs.mkdir(localDir, { recursive: true });
  await fs.writeFile(localMetaPath, JSON.stringify(meta, null, 2), "utf8");
}
