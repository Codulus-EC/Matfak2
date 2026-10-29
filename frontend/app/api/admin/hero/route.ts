import { NextResponse } from "next/server";
import { sessionFromRequest } from "@/lib/adminAuth";
import { readSiteContent, writeSiteContent } from "@/lib/contentStore";
import type { HeroSlide } from "@/lib/contentTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Требуется вход администратора" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  const content = await readSiteContent();
  return NextResponse.json(content.heroSlides);
}

export async function PUT(request: Request) {
  if (!sessionFromRequest(request)) return unauthorized();
  const slides = await request.json().catch(() => null) as HeroSlide[] | null;
  if (!Array.isArray(slides) || !slides.length || slides.length > 10) {
    return NextResponse.json({ error: "Некорректный список слайдов" }, { status: 400 });
  }
  for (const slide of slides) {
    if (!slide?.id || !slide?.image || !slide?.mode || !Array.isArray(slide.buttons)) {
      return NextResponse.json({ error: "Некорректные данные слайда" }, { status: 400 });
    }
  }
  const content = await readSiteContent();
  content.heroSlides = slides;
  await writeSiteContent(content);
  return NextResponse.json({ ok: true, heroSlides: slides });
}
