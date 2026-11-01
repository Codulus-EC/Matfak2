"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { newsItems as fallbackNews } from "@/lib/newsData";
import type { NewsItem } from "@/lib/contentTypes";

export function Achievements() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNews);

  useEffect(() => {
    fetch("/api/content/news", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((items: NewsItem[]) => {
        if (Array.isArray(items)) setNewsItems(items);
      })
      .catch(() => undefined);
  }, []);

  const latestNews = useMemo(
    () => [...newsItems].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [newsItems],
  );

  return (
    <section className="events-section" id="achievements">
      <div className="section-shell events-shell">
        <header>
          <h2>ДОСТИЖЕНИЯ</h2>
          <p>И СОБЫТИЯ</p>
        </header>

        <div className="event-list">
          {latestNews.map((item) => (
            <article className="event-card" key={item.slug}>
              <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 1240px" unoptimized />
              <div className="event-overlay" />
              <div className="event-meta">
                <span>{item.kind}</span>
                <time dateTime={item.date}>{item.dateLabel}</time>
              </div>
              <h3>{item.title}</h3>
              <a href={`/news/detail?slug=${item.slug}`}>Подробнее →</a>
            </article>
          ))}
        </div>

        <a className="events-more" href="/news" aria-label="Смотреть все новости">
          <span className="events-more-line" aria-hidden="true" />
          <span className="events-more-label">Смотреть больше!</span>
          <span className="events-more-line" aria-hidden="true" />
          <span className="events-more-arrow" aria-hidden="true">V</span>
        </a>
      </div>
    </section>
  );
}
