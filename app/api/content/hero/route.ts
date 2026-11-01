import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/contentStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(content.heroSlides, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
