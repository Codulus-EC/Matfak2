"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { HeroSlide, NewsAccent, NewsItem } from "@/lib/contentTypes";
import styles from "./admin.module.css";

type AuthState = "loading" | "guest" | "admin";

const emptyNews: NewsItem = {
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  dateLabel: "",
  kind: "Новость",
  title: "",
  excerpt: "",
  body: [],
  image: "",
  tags: [],
  featured: false,
  accent: "green",
};

async function jsonRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Ошибка запроса");
  return data as T;
}

export function AdminPanel() {
  const [auth, setAuth] = useState<AuthState>("loading");
  const [configured, setConfigured] = useState(true);
  const [login, setLogin] = useState("admin");
  const [password, setPassword] = useState("");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<NewsItem>(emptyNews);
  const [tagsText, setTagsText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const sortedNews = useMemo(() => [...news].sort((a, b) => b.date.localeCompare(a.date)), [news]);

  const loadAdminData = async () => {
    const [slides, articles] = await Promise.all([
      jsonRequest<HeroSlide[]>("/api/admin/hero"),
      jsonRequest<NewsItem[]>("/api/admin/news"),
    ]);
    setHeroSlides(slides);
    setNews(articles);
  };

  useEffect(() => {
    jsonRequest<{ authenticated: boolean; configured: boolean }>("/api/admin/auth")
      .then(async (status) => {
        setConfigured(status.configured);
        if (status.authenticated) {
          setAuth("admin");
          await loadAdminData();
        } else {
          setAuth("guest");
        }
      })
      .catch(() => setAuth("guest"));
  }, []);

  const flash = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 3200);
  };

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await jsonRequest("/api/admin/auth", { method: "POST", body: JSON.stringify({ login, password }) });
      setAuth("admin");
      setPassword("");
      await loadAdminData();
    } catch (error) {
      flash(error instanceof Error ? error.message : "Не удалось войти");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuth("guest");
    setHeroSlides([]);
    setNews([]);
  };

  const uploadImage = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Не удалось загрузить изображение");
    return String(data.url);
  };

  const replaceHeroImage = async (slideId: string, file: File) => {
    setBusy(true);
    try {
      const image = await uploadImage(file);
      const next = heroSlides.map((slide) => slide.id === slideId ? { ...slide, image } : slide);
      await jsonRequest("/api/admin/hero", { method: "PUT", body: JSON.stringify(next) });
      setHeroSlides(next);
      flash("Главная картинка обновлена");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Не удалось обновить картинку");
    } finally {
      setBusy(false);
    }
  };

  const startNew = () => {
    setEditingSlug(null);
    setDraft({ ...emptyNews, date: new Date().toISOString().slice(0, 10) });
    setTagsText("");
    setBodyText("");
    document.getElementById("news-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const editNews = (item: NewsItem) => {
    setEditingSlug(item.slug);
    setDraft({ ...item });
    setTagsText(item.tags.join(", "));
    setBodyText((item.body || []).join("\n\n"));
    document.getElementById("news-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const saveNews = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const item: NewsItem = {
        ...draft,
        tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
        body: bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      };
      let saved: NewsItem;
      if (editingSlug) {
        saved = await jsonRequest<NewsItem>("/api/admin/news", {
          method: "PUT",
          body: JSON.stringify({ originalSlug: editingSlug, item }),
        });
        setNews((items) => items.map((entry) => entry.slug === editingSlug ? saved : entry));
      } else {
        saved = await jsonRequest<NewsItem>("/api/admin/news", { method: "POST", body: JSON.stringify(item) });
        setNews((items) => [saved, ...items]);
      }
      editNews(saved);
      flash(editingSlug ? "Новость обновлена" : "Новость опубликована");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Не удалось сохранить новость");
    } finally {
      setBusy(false);
    }
  };

  const deleteNews = async (slug: string) => {
    if (!window.confirm("Удалить эту новость?")) return;
    setBusy(true);
    try {
      await jsonRequest(`/api/admin/news?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      setNews((items) => items.filter((item) => item.slug !== slug));
      if (editingSlug === slug) startNew();
      flash("Новость удалена");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Не удалось удалить новость");
    } finally {
      setBusy(false);
    }
  };

  if (auth === "loading") {
    return <main className={styles.page}><div className={styles.loading}>Загрузка админ-панели…</div></main>;
  }

  if (auth === "guest") {
    return (
      <main className={styles.page}>
        <section className={styles.loginCard}>
          <span className={styles.kicker}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</span>
          <h1>Админ-панель</h1>
          <p>Управление главными изображениями и новостями сайта.</p>
          {!configured && <div className={styles.warning}>Сначала задайте MATFAK_ADMIN_PASSWORD в .env.local на сервере.</div>}
          <form onSubmit={signIn}>
            <label>Логин<input value={login} onChange={(event) => setLogin(event.target.value)} autoComplete="username" /></label>
            <label>Пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
            <button disabled={busy || !configured}>Войти</button>
          </form>
        </section>
        {message && <div className={styles.toast}>{message}</div>}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div><span className={styles.kicker}>MATFAK CMS</span><h1>Админ-панель</h1></div>
        <div className={styles.topActions}><a href="/" target="_blank">Открыть сайт ↗</a><button onClick={logout}>Выйти</button></div>
      </header>

      <section className={styles.section} id="hero-admin">
        <div className={styles.sectionHeading}><div><span>ГЛАВНАЯ</span><h2>Hero-картинки</h2></div><p>Меняем фон нужного слайда. Тексты и кнопки остаются как есть.</p></div>
        <div className={styles.heroGrid}>
          {heroSlides.map((slide, index) => (
            <article className={styles.heroCard} key={slide.id}>
              <img src={slide.image} alt="" />
              <div className={styles.heroCardBody}>
                <span>Слайд {index + 1}</span>
                <strong>{slide.top} {slide.bottom}</strong>
                <label className={styles.uploadButton}>
                  Заменить картинку
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void replaceHeroImage(slide.id, file);
                    event.currentTarget.value = "";
                  }} />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><div><span>ПУБЛИКАЦИИ</span><h2>Новости</h2></div><button className={styles.primaryButton} onClick={startNew}>+ Добавить новость</button></div>

        <div className={styles.newsLayout}>
          <form className={styles.editor} id="news-editor" onSubmit={saveNews}>
            <div className={styles.editorTitle}><div><span>{editingSlug ? "РЕДАКТИРОВАНИЕ" : "НОВАЯ ПУБЛИКАЦИЯ"}</span><h3>{editingSlug ? draft.title || "Новость" : "Добавить новость"}</h3></div>{editingSlug && <button type="button" onClick={startNew}>Очистить</button>}</div>

            <div className={styles.formGrid}>
              <label>Дата<input required type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label>
              <label>Тип новости<input required value={draft.kind} onChange={(e) => setDraft({ ...draft, kind: e.target.value })} placeholder="Событие / Наука / Олимпиада" /></label>
            </div>
            <label>Заголовок<input required maxLength={220} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
            <label>Краткое описание<textarea required rows={3} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></label>
            <label>Полный текст <small>Абзацы разделяй пустой строкой</small><textarea rows={8} value={bodyText} onChange={(e) => setBodyText(e.target.value)} /></label>
            <label>Теги <small>Через запятую</small><input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Наука, События, Важно" /></label>

            <div className={styles.formGrid}>
              <label>Акцент<select value={draft.accent} onChange={(e) => setDraft({ ...draft, accent: e.target.value as NewsAccent })}><option value="green">Зелёный</option><option value="lime">Лайм</option><option value="cyan">Бирюзовый</option><option value="blue">Синий</option><option value="yellow">Жёлтый</option></select></label>
              <label className={styles.checkbox}><input type="checkbox" checked={Boolean(draft.featured)} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} /><span>Пометить как «Важно»</span></label>
            </div>

            <div className={styles.coverEditor}>
              {draft.image ? <img src={draft.image} alt="" /> : <div className={styles.coverPlaceholder}>Обложка новости</div>}
              <label className={styles.uploadButton}>Загрузить обложку<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={busy} onChange={async (event) => {
                const input = event.currentTarget;
                const file = input.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  const image = await uploadImage(file);
                  setDraft((current) => ({ ...current, image }));
                }
                catch (error) { flash(error instanceof Error ? error.message : "Ошибка загрузки"); }
                finally { setBusy(false); input.value = ""; }
              }} /></label>
            </div>

            <button className={styles.saveButton} disabled={busy || !draft.image}>{busy ? "Сохраняю…" : editingSlug ? "Сохранить изменения" : "Опубликовать новость"}</button>
          </form>

          <div className={styles.newsList} id="news-list">
            {sortedNews.map((item) => (
              <article className={styles.newsRow} key={item.slug}>
                <img src={item.image} alt="" />
                <div><span>{item.dateLabel} · {item.kind}</span><strong>{item.title}</strong><div className={styles.rowTags}>{item.tags.slice(0, 3).map((tag) => <i key={tag}>{tag}</i>)}</div></div>
                <div className={styles.rowActions}><button onClick={() => editNews(item)}>Изменить</button><button className={styles.danger} onClick={() => deleteNews(item.slug)}>Удалить</button></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {message && <div className={styles.toast}>{message}</div>}
    </main>
  );
}
