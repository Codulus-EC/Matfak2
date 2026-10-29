import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";
import { readSiteContent, writeSiteContent } from "@/lib/contentStore";
import type { NewsAccent, NewsItem } from "@/lib/contentTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const accents = new Set<NewsAccent>(["green", "lime", "cyan", "blue", "yellow"]);

function unauthorized() {
  return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 });
}

function transliterate(value: string) {
  const map: Record<string, string> = {
    а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
  };
  return value.toLowerCase().split("").map((char) => map[char] ?? char).join("");
}

function slugify(value: string) {
  return transliterate(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || `news-${Date.now()}`;
}

function dateLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(year, month - 1, day))
    .replace(" г.", "");
}

function cleanItem(raw: Partial<NewsItem>, forcedSlug?: string): NewsItem {
  const title = String(raw.title || "").trim().slice(0, 220);
  const excerpt = String(raw.excerpt || "").trim().slice(0, 1200);
  const kind = String(raw.kind || "Новость").trim().slice(0, 80);
  const date = String(raw.date || "").trim();
  const image = String(raw.image || "").trim();
  if (!title || !excerpt || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !image.startsWith("/")) {
    throw new Error("Заполните заголовок, описание, дату и изображение");
  }
  const tags = Array.from(new Set((Array.isArray(raw.tags) ? raw.tags : [])
    .map((tag) => String(tag).trim().slice(0, 60))
    .filter(Boolean))).slice(0, 8);
  const body = (Array.isArray(raw.body) ? raw.body : [])
    .map((paragraph) => String(paragraph).trim().slice(0, 5000))
    .filter(Boolean)
    .slice(0, 30);
  const accent = accents.has(raw.accent as NewsAccent) ? raw.accent as NewsAccent : "green";
  return {
    slug: forcedSlug || slugify(String(raw.slug || title)),
    date,
    dateLabel: dateLabel(date),
    kind,
    title,
    excerpt,
    body,
    image,
    tags,
    featured: Boolean(raw.featured),
    accent,
  };
}

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  const content = await readSiteContent();
  return NextResponse.json(content.newsItems);
}

export async function POST(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  try {
    const body = await request.json() as Partial<NewsItem>;
    const item = cleanItem(body);
    const content = await readSiteContent();
    let slug = item.slug;
    let index = 2;
    while (content.newsItems.some((entry) => entry.slug === slug)) {
      slug = `${item.slug}-${index++}`;
    }
    item.slug = slug;
    content.newsItems.unshift(item);
    await writeSiteContent(content);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Не удалось создать новость" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  try {
    const body = await request.json() as { originalSlug?: string; item?: Partial<NewsItem> };
    const originalSlug = String(body.originalSlug || "");
    if (!originalSlug) throw new Error("Не указана редактируемая новость");
    const content = await readSiteContent();
    const index = content.newsItems.findIndex((entry) => entry.slug === originalSlug);
    if (index < 0) return NextResponse.json({ error: "Новость не найдена" }, { status: 404 });
    const item = cleanItem(body.item || {}, originalSlug);
    content.newsItems[index] = item;
    await writeSiteContent(content);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Не удалось обновить новость" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") || "";
  const content = await readSiteContent();
  const next = content.newsItems.filter((entry) => entry.slug !== slug);
  if (next.length === content.newsItems.length) {
    return NextResponse.json({ error: "Новость не найдена" }, { status: 404 });
  }
  content.newsItems = next;
  await writeSiteContent(content);
  return NextResponse.json({ ok: true });
}
