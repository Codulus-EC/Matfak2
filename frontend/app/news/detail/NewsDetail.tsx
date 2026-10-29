"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { newsItems as fallbackNews } from "@/lib/newsData";
import type { NewsItem } from "@/lib/contentTypes";
import styles from "./detail.module.css";

export function NewsDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const fallback = fallbackNews.find((entry) => entry.slug === slug) ?? fallbackNews[0];
  const [item, setItem] = useState<NewsItem>(fallback);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/content/news/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((news: NewsItem) => setItem(news))
      .catch(() => undefined);
  }, [slug]);

  return (
    <article className={styles.page}>
      <div className={styles.shell}>
        <a className={styles.back} href="/news">← Назад к новостям</a>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span>{item.kind}</span>
            <time dateTime={item.date}>{item.dateLabel}</time>
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
          <div className={styles.tags}>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </header>
        <figure className={styles.cover}><img src={item.image} alt="" /></figure>
        <section className={styles.body}>
          {(item.body?.length ? item.body : ["Полный текст публикации будет добавлен позже."]).map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 30)}`}>{paragraph}</p>
          ))}
        </section>
      </div>
    </article>
  );
}
