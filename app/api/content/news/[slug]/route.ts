import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/contentStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await readSiteContent();
  const item = content.newsItems.find((entry) => entry.slug === slug);
  if (!item) return NextResponse.json({ error: "Новость не найдена" }, { status: 404 });
  return NextResponse.json(item, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
