import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultSiteContent } from "./contentDefaults";
import type { SiteContent } from "./contentTypes";

const dataDir = path.join(process.cwd(), "data");
const contentFile = path.join(dataDir, "site-content.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(contentFile);
  } catch {
    await writeSiteContent(defaultSiteContent);
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  await ensureStore();
  try {
    const raw = await fs.readFile(contentFile, "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      heroSlides: Array.isArray(parsed.heroSlides) && parsed.heroSlides.length
        ? parsed.heroSlides
        : defaultSiteContent.heroSlides,
      newsItems: Array.isArray(parsed.newsItems)
        ? parsed.newsItems
        : defaultSiteContent.newsItems,
    };
  } catch {
    return structuredClone(defaultSiteContent);
  }
}

export async function writeSiteContent(content: SiteContent) {
  await fs.mkdir(dataDir, { recursive: true });
  const tmp = `${contentFile}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2), "utf8");
  await fs.rename(tmp, contentFile);
}

export function getContentFilePath() {
  return contentFile;
}
