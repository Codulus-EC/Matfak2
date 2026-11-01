import { promises as fs } from "node:fs";
import path from "node:path";
import initialSiteContentJson from "@/data/site-content.json";
import { defaultSiteContent } from "./contentDefaults";
import { blobStorageEnabled, readLatestBlobJson, writeBlobJsonSnapshot } from "./blobStore";
import type { SiteContent } from "./contentTypes";

const dataDir = path.join(process.cwd(), "data");
const contentFile = path.join(dataDir, "site-content.json");
const BLOB_PREFIX = "cms/site-content/";

const initialSiteContent = initialSiteContentJson as SiteContent;

function normalizeContent(parsed: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    heroSlides: Array.isArray(parsed?.heroSlides) && parsed.heroSlides.length
      ? parsed.heroSlides
      : initialSiteContent.heroSlides?.length
        ? initialSiteContent.heroSlides
        : defaultSiteContent.heroSlides,
    newsItems: Array.isArray(parsed?.newsItems)
      ? parsed.newsItems
      : Array.isArray(initialSiteContent.newsItems)
        ? initialSiteContent.newsItems
        : defaultSiteContent.newsItems,
  };
}

async function ensureLocalStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(contentFile);
  } catch {
    await fs.writeFile(contentFile, JSON.stringify(initialSiteContent, null, 2), "utf8");
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  if (blobStorageEnabled()) {
    try {
      const stored = await readLatestBlobJson<Partial<SiteContent>>(BLOB_PREFIX);
      return normalizeContent(stored || initialSiteContent);
    } catch {
      return normalizeContent(initialSiteContent);
    }
  }

  await ensureLocalStore();
  try {
    const raw = await fs.readFile(contentFile, "utf8");
    return normalizeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return structuredClone(normalizeContent(initialSiteContent));
  }
}

export async function writeSiteContent(content: SiteContent) {
  const normalized = normalizeContent(content);

  if (blobStorageEnabled()) {
    await writeBlobJsonSnapshot(BLOB_PREFIX, normalized);
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${contentFile}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(normalized, null, 2), "utf8");
  await fs.rename(tmp, contentFile);
}

export function getContentFilePath() {
  return contentFile;
}
