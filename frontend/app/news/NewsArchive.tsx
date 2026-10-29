"use client";

import { useEffect, useMemo, useState } from "react";
import { featuredNewsTags, newsItems as fallbackNewsItems } from "@/lib/newsData";
import type { NewsItem } from "@/lib/contentTypes";
import styles from "./news.module.css";

type SortMode = "newest" | "oldest";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("ru");
}

export function NewsArchive() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNewsItems);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("Все");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [showAllTags, setShowAllTags] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/content/news", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((items: NewsItem[]) => {
        if (Array.isArray(items)) setNewsItems(items);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { authenticated?: boolean }) => setIsAdmin(Boolean(data.authenticated)))
      .catch(() => setIsAdmin(false));
  }, []);

  const allNewsTags = useMemo(
    () => Array.from(new Set(newsItems.flatMap((item) => item.tags))).sort((a, b) => a.localeCompare(b, "ru")),
    [newsItems],
  );

  const visibleNews = useMemo(() => {
    const needle = normalize(query);

    return [...newsItems]
      .filter((item) => {
        const byTag = activeTag === "Все" || item.tags.includes(activeTag) || item.kind === activeTag;
        if (!byTag) return false;

        if (dateFrom && item.date < dateFrom) return false;
        if (dateTo && item.date > dateTo) return false;

        if (!needle) return true;

        const haystack = normalize(
          [item.title, item.excerpt, item.kind, ...item.tags].join(" "),
        );
        return haystack.includes(needle);
      })
      .sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortMode === "newest" ? diff : -diff;
      });
  }, [activeTag, dateFrom, dateTo, query, sortMode]);

  const tags = showAllTags
    ? ["Все", ...allNewsTags.filter((tag) => tag !== "Все")]
    : [...featuredNewsTags];

  const hasFilters = Boolean(query || activeTag !== "Все" || dateFrom || dateTo);

  const resetFilters = () => {
    setQuery("");
    setActiveTag("Все");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.colorTracks} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className={styles.heroInner}>
          <span className={styles.heroKicker}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</span>
          <h1>НОВОСТИ</h1>
          <p>
            Все важные события факультета, олимпиады, лекции и объявления —
            в одном архиве новостей ниже.
          </p>
          {isAdmin && (
            <div className={styles.newsAdminWrap}>
              <button className={styles.newsAdminButton} type="button" onClick={() => setAdminMenuOpen((value) => !value)}>✎ Редактировать новости</button>
              {adminMenuOpen && <div className={styles.newsAdminMenu}><strong>Управление новостями</strong><a href="/admin#news-editor">+ Добавить новость</a><a href="/admin#news-list">Изменить существующие →</a></div>}
            </div>
          )}

          <a className={styles.heroLink} href="#archive">
            Перейти к архиву <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className={styles.archive} id="archive">
        <div className={styles.shell}>
          <header className={styles.archiveHeading}>
            <div>
              <span>АРХИВ ПУБЛИКАЦИЙ</span>
              <h2>Все новости</h2>
            </div>
            <p>
              Найдите нужную публикацию по словам, теме или периоду — архив
              автоматически отфильтруется ниже.
            </p>
          </header>

          <div className={styles.controls}>
            <div className={styles.searchLine}>
              <label className={styles.searchBox}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск по новостям"
                  type="search"
                />
                {query && (
                  <button
                    className={styles.clearSearch}
                    type="button"
                    aria-label="Очистить поиск"
                    onClick={() => setQuery("")}
                  >
                    ×
                  </button>
                )}
              </label>
            </div>

            <div className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Период публикации</span>
                <div className={styles.dateControls}>
                  <label className={styles.dateBox}>
                    <span>С</span>
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo || undefined}
                      onChange={(event) => setDateFrom(event.target.value)}
                    />
                  </label>
                  <span className={styles.dateArrow} aria-hidden="true">→</span>
                  <label className={styles.dateBox}>
                    <span>По</span>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom || undefined}
                      onChange={(event) => setDateTo(event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <label className={styles.sortBox}>
                <span className={styles.filterLabel}>Порядок</span>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                >
                  <option value="newest">Сначала новые</option>
                  <option value="oldest">Сначала старые</option>
                </select>
              </label>
            </div>

            <div className={styles.tagsBlock}>
              <div className={styles.tagHeader}>
                <div>
                  <strong>Темы</strong>
                  <span>Можно выбрать одну тему</span>
                </div>
                <button
                  className={styles.allTagsButton}
                  type="button"
                  onClick={() => setShowAllTags((value) => !value)}
                >
                  {showAllTags ? "Скрыть дополнительные" : "Все теги"}
                  <span aria-hidden="true">{showAllTags ? "−" : "+"}</span>
                </button>
              </div>

              <div className={styles.tagCloud} aria-label="Фильтр по тегам">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={activeTag === tag ? styles.activeTag : ""}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.resultMeta}>
            <span>
              Найдено публикаций: <strong>{visibleNews.length}</strong>
            </span>
            {hasFilters && (
              <button type="button" onClick={resetFilters}>
                Сбросить фильтры ×
              </button>
            )}
          </div>

          {visibleNews.length > 0 ? (
            <div className={styles.newsGrid}>
              {visibleNews.map((item) => (
                <article
                  className={`${styles.newsCard} ${styles[`accent_${item.accent}`]}`}
                  key={item.slug}
                >
                  <a className={styles.imageWrap} href={`/news/detail?slug=${item.slug}`}>
                    <img src={item.image} alt="" />
                    <span className={styles.kind}>{item.kind}</span>
                    {item.featured && <span className={styles.featured}>ВАЖНО</span>}
                  </a>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <time dateTime={item.date}>{item.dateLabel}</time>
                      <span>{item.tags[0]}</span>
                    </div>

                    <h3>
                      <a href={`/news/detail?slug=${item.slug}`}>{item.title}</a>
                    </h3>
                    <p>{item.excerpt}</p>

                    <div className={styles.cardFooter}>
                      <div className={styles.cardTags}>
                        {item.tags.map((tag) => (
                          <button key={tag} type="button" onClick={() => setActiveTag(tag)}>
                            {tag}
                          </button>
                        ))}
                      </div>
                      <a className={styles.readMore} href={`/news/detail?slug=${item.slug}`}>
                        Читать <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>Ничего не найдено</span>
              <p>Измените запрос, тему или период публикации.</p>
              <button type="button" onClick={resetFilters}>
                Показать все новости
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
