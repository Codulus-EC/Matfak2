"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/contentTypes";
import { uploadAdminImage } from "@/lib/adminBlobClient";
import styles from "./Hero.module.css";

const fallbackSlides: HeroSlide[] = [
  {
    id: "main",
    image: "/images/hero-board.jpg",
    eyebrow: "МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ",
    mode: "main",
    top: "Мат фак",
    bottom: "это про",
    italic: "жизнь",
    subtitle: "Математика — это ключ к будущему!",
    buttons: [
      { label: "Подать документы ›", href: "#programs", variant: "primary" },
      { label: "Выбрать программу ›", href: "#programs", variant: "outline" },
    ],
  },
  {
    id: "school-opening",
    image: "/images/hero-school-opening.png",
    eyebrow: "ШКОЛА ОЛИМПИАДНОЙ МАТЕМАТИКИ",
    mode: "news",
    top: "Школа",
    bottom: "открыта!",
    subtitle: "Набор на 2026 год уже открыт. Разборы задач, подготовка к олимпиадам и живые занятия на матфаке ВГУ.",
    buttons: [
      { label: "Узнать подробнее ›", href: "/schoolchildren#olympiad-school", variant: "primary" },
      { label: "Записаться ›", href: "/schoolchildren#registration-form", variant: "outline" },
      { label: "Мы в ВК! ›", href: "https://vk.ru/school_math_vsu", variant: "vk", external: true },
    ],
  },
  {
    id: "school-first-lesson",
    image: "/images/hero-school-first-lesson.jpg",
    eyebrow: "ШКОЛА ОЛИМПИАДНОЙ МАТЕМАТИКИ",
    mode: "news",
    top: "Первое занятие",
    bottom: "уже прошло!",
    subtitle: "На прошлой неделе участники познакомились с форматом школы и разобрали первые олимпиадные задачи.",
    buttons: [
      { label: "Узнать подробнее ›", href: "/schoolchildren#olympiad-school", variant: "primary" },
      { label: "Записаться ›", href: "/schoolchildren#registration-form", variant: "outline" },
      { label: "Мы в ВК! ›", href: "https://vk.ru/school_math_vsu", variant: "vk", external: true },
    ],
  },
];

export function Hero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [active, setActive] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/content/hero", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((items: HeroSlide[]) => {
        if (Array.isArray(items) && items.length) {
          setSlides(items);
          setActive((current) => Math.min(current, items.length - 1));
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    fetch("/api/admin/auth", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { authenticated?: boolean }) => setIsAdmin(Boolean(data.authenticated)))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (!editOpen) return;
    const close = (event: MouseEvent) => { if (!editRef.current?.contains(event.target as Node)) setEditOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [editOpen]);

  const quickReplaceImage = async (file: File) => {
    setUploading(true);
    try {
      const imageUrl = await uploadAdminImage(file);
      const next = slides.map((item, index) => index === active ? { ...item, image: imageUrl } : item);
      const saveResponse = await fetch("/api/admin/hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      if (!saveResponse.ok) throw new Error("Не удалось сохранить hero");
      setSlides(next); setEditOpen(false);
    } catch (error) { window.alert(error instanceof Error ? error.message : "Не удалось заменить картинку"); }
    finally { setUploading(false); }
  };

  const go = (next: number) => setActive((next + slides.length) % slides.length);
  const slide = slides[active] ?? fallbackSlides[0];

  return (
    <section className={styles.hero} id="top">
      {slides.map((item, index) => (
        <div
          className={`${styles.bg} ${index === active ? styles.activeBg : ""} ${item.mode === "news" ? styles.newsBg : ""}`}
          key={item.id || `${item.image}-${index}`}
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ))}

      <div className={`${styles.copy} ${slide.mode === "news" ? styles.newsCopy : ""}`}>
        <div className={styles.eyebrow}>{slide.eyebrow}</div>

        {slide.mode === "main" ? (
          <h1>
            <span>{slide.top}</span>
            <b>{slide.bottom} {slide.italic && <em>{slide.italic}</em>}</b>
          </h1>
        ) : (
          <h1 className={styles.newsTitle}>
            <span>{slide.top}</span>
            <b>{slide.bottom}</b>
          </h1>
        )}

        <p>{slide.subtitle}</p>

        <div className={styles.actions}>
          {slide.buttons.map((button) => (
            <a
              key={`${active}-${button.label}`}
              className={`${styles.button} ${button.variant === "primary" ? styles.primary : button.variant === "vk" ? styles.vk : styles.outline}`}
              href={button.href}
              target={button.external ? "_blank" : undefined}
              rel={button.external ? "noreferrer" : undefined}
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className={styles.inlineAdmin} ref={editRef}>
          <button className={styles.inlineEditButton} type="button" onClick={() => setEditOpen((value) => !value)}>✎ Редактировать</button>
          {editOpen && (
            <div className={styles.inlineEditMenu}>
              <span>СЛАЙД {active + 1}</span>
              <strong>{slide.top} {slide.bottom}</strong>
              <label className={styles.inlineUpload}>{uploading ? "Загрузка…" : "Заменить картинку"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void quickReplaceImage(file); event.currentTarget.value = ""; }} /></label>
              <a href="/admin#hero-admin">Полное редактирование →</a>
            </div>
          )}
        </div>
      )}

      {slides.length > 1 && (
        <div className={styles.switcher} aria-label="Переключение hero-слайдов">
          <button type="button" onClick={() => go(active - 1)} aria-label="Предыдущий слайд">‹</button>
          <div className={styles.dots}>
            {slides.map((item, index) => (
              <button type="button" key={item.id || index} className={index === active ? styles.activeDot : ""} onClick={() => go(index)} aria-label={`Слайд ${index + 1}`} />
            ))}
          </div>
          <button type="button" onClick={() => go(active + 1)} aria-label="Следующий слайд">›</button>
        </div>
      )}
    </section>
  );
}
