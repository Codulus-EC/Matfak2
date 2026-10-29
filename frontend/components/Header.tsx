"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteLanguages, useSiteTranslator } from "@/lib/siteTranslator";
import styles from "./Header.module.css";

type MenuItem = {
  label: string;
  href: string;
  external?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  menu: MenuItem[];
};

const navItems: NavItem[] = [
  {
    label: "Обучение",
    href: "/",
    menu: [
      { label: "Бакалавриат", href: "/education/bachelor" },
      { label: "Магистратура", href: "/education/master" },
      { label: "Специалитет", href: "/education/specialist" },
      { label: "Аспирантура", href: "/education/postgraduate" },
      { label: "СПО", href: "/education/spo" },
    ],
  },
  {
    label: "Абитуриентам",
    href: "/applicants",
    menu: [
      { label: "Главная абитуриентам", href: "/applicants" },
      { label: "Программы обучения", href: "/applicants#program-choice" },
      { label: "Важная информация", href: "/applicants#important" },
      { label: "Документы", href: "/documents" },
      { label: "Контакты", href: "/contacts" },
    ],
  },
  {
    label: "Студентам",
    href: "/students",
    menu: [
      { label: "Главная студентам", href: "/students" },
      { label: "Расписание", href: "/schedule" },
      { label: "Документы", href: "/documents" },
      { label: "Практика", href: "/students#practice" },
      { label: "Электронные ресурсы", href: "https://edu.vsu.ru/", external: true },
    ],
  },
  {
    label: "Школьникам",
    href: "/schoolchildren",
    menu: [
      { label: "Главная школьникам", href: "/schoolchildren" },
      { label: "Олимпиада", href: "/schoolchildren#olympiad" },
      { label: "Олимпиадная школа", href: "/schoolchildren#olympiad-school" },
      { label: "Примеры задач", href: "/schoolchildren#tasks" },
      { label: "Результаты", href: "/schoolchildren#results" },
      { label: "Расписание", href: "/schoolchildren#schedule" },
      { label: "Архив решённых задач", href: "/schoolchildren/tasks" },
    ],
  },
  {
    label: "Новости",
    href: "/news",
    menu: [
      { label: "Все новости", href: "/news" },
      { label: "Новости и события", href: "/news#section-1" },
      { label: "Открыть публикацию", href: "/news/detail" },
    ],
  },
  {
    label: "О факультете",
    href: "/about",
    menu: [
      { label: "Кафедры", href: "/about#departments" },
      { label: "Контакты", href: "/about#contacts" },
    ],
  },
];

const SCHEDULE_WEEK_REFERENCE = new Date(2026, 8, 7); // 07.09.2026 — знаменатель

function getCurrentWeekType() {
  const today = new Date();
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const referenceDate = new Date(
    SCHEDULE_WEEK_REFERENCE.getFullYear(),
    SCHEDULE_WEEK_REFERENCE.getMonth(),
    SCHEDULE_WEEK_REFERENCE.getDate(),
  );
  const weekDiff = Math.floor((currentDate.getTime() - referenceDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.abs(weekDiff) % 2 === 0 ? "Знаменатель" : "Числитель";
}

const CURRENT_WEEK_TYPE = getCurrentWeekType();

const scheduleFiles = [
  { key: "osn", label: "Расписание ОСН", href: "/api/content/schedule/osn" },
  { key: "spo", label: "Расписание СПО", href: "/api/content/schedule/spo" },
] as const;

function isActive(pathname: string, label: string, href: string) {
  if (label === "Обучение") return pathname === "/" || pathname.startsWith("/education/");
  if (label === "О факультете") {
    return pathname === "/about" || pathname.startsWith("/departments");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AccessibilitySettings = {
  scale: number;
  highContrast: boolean;
  hideImages: boolean;
  moreSpacing: boolean;
};

const ACCESSIBILITY_STORAGE_KEY = "matfak-accessibility";
const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  scale: 100,
  highContrast: false,
  hideImages: false,
  moreSpacing: false,
};

function applyAccessibility(settings: AccessibilitySettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.accessScale = String(settings.scale);
  root.dataset.accessContrast = settings.highContrast ? "on" : "off";
  root.dataset.accessImages = settings.hideImages ? "off" : "on";
  root.dataset.accessSpacing = settings.moreSpacing ? "on" : "off";
}

function ScheduleMenu({ canEdit }: { canEdit: boolean }) {
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState<"osn" | "spo" | null>(null);
  const [message, setMessage] = useState("");

  const uploadSchedule = async (kind: "osn" | "spo", file?: File) => {
    if (!file) return;
    setUploading(kind);
    setMessage("");
    try {
      const form = new FormData();
      form.append("kind", kind);
      form.append("file", file);
      const response = await fetch("/api/admin/schedule", { method: "POST", body: form });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Не удалось загрузить расписание");
      setMessage(kind === "osn" ? "Расписание ОСН обновлено" : "Расписание СПО обновлено");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ошибка загрузки");
    } finally {
      setUploading(null);
    }
  };

  return (
    <section className={`${styles.schedulePanel} notranslate`} translate="no" role="dialog" aria-modal="false" aria-labelledby="schedule-title">
      <span className={styles.scheduleKicker}>УЧЕБНЫЙ ПРОЦЕСС</span>
      <strong id="schedule-title" className={styles.scheduleTitle}>Расписание</strong>
      <span className={styles.scheduleCurrentType}>{CURRENT_WEEK_TYPE}</span>
      <div className={styles.scheduleLinks}>
        {scheduleFiles.map((file) => (
          <a key={file.href} href={file.href} className={styles.scheduleLink}>
            <span className={styles.scheduleLinkText}>{file.label}</span>
            <span className={styles.scheduleLinkIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
                <path d="M7 10.5L12 15.5L17 10.5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 19H20" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
              </svg>
            </span>
          </a>
        ))}
      </div>
      {canEdit && (
        <div className={styles.scheduleAdmin}>
          <button type="button" className={styles.scheduleEditButton} onClick={() => { setEditing((value) => !value); setMessage(""); }}>
            {editing ? "Скрыть редактирование" : "✎ Редактировать расписание"}
          </button>
          {editing && (
            <div className={styles.scheduleUploadArea}>
              <label className={`${styles.scheduleUploadButton} ${uploading === "osn" ? styles.scheduleUploadBusy : ""}`}>
                <span>{uploading === "osn" ? "Загрузка…" : "Заменить ОСН"}</span>
                <input type="file" accept=".xlsx,.xls,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf" disabled={Boolean(uploading)} onChange={(event) => { void uploadSchedule("osn", event.target.files?.[0]); event.currentTarget.value = ""; }} />
              </label>
              <label className={`${styles.scheduleUploadButton} ${uploading === "spo" ? styles.scheduleUploadBusy : ""}`}>
                <span>{uploading === "spo" ? "Загрузка…" : "Заменить СПО"}</span>
                <input type="file" accept=".xlsx,.xls,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf" disabled={Boolean(uploading)} onChange={(event) => { void uploadSchedule("spo", event.target.files?.[0]); event.currentTarget.value = ""; }} />
              </label>
              <small className={styles.scheduleUploadHint}>XLSX, XLS или PDF · до 20 МБ</small>
              {message && <span className={styles.scheduleUploadMessage}>{message}</span>}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AccessibilityMenu({
  settings,
  onChange,
  onClose,
}: {
  settings: AccessibilitySettings;
  onChange: (next: AccessibilitySettings) => void;
  onClose: () => void;
}) {
  const update = (patch: Partial<AccessibilitySettings>) =>
    onChange({ ...settings, ...patch });

  const decreaseScale = () => update({ scale: Math.max(90, settings.scale - 10) });
  const increaseScale = () => update({ scale: Math.min(120, settings.scale + 10) });

  return (
    <section
      className={`${styles.accessibilityPanel} notranslate`}
      translate="no"
      role="dialog"
      aria-modal="false"
      aria-labelledby="accessibility-title"
    >
      <div className={styles.accessibilityHeader}>
        <div>
          <span className={styles.accessibilityEyebrow}>ДОСТУПНОСТЬ</span>
          <h2 id="accessibility-title">Версия для слабовидящих</h2>
        </div>
        <button className={styles.accessibilityClose} type="button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <div className={styles.accessibilityScale}>
        <span className={styles.accessibilityLabel}>Размер страницы</span>
        <div className={styles.scaleControls}>
          <button type="button" onClick={decreaseScale} disabled={settings.scale <= 90}>A−</button>
          <strong>{settings.scale}%</strong>
          <button type="button" onClick={increaseScale} disabled={settings.scale >= 120}>A+</button>
        </div>
      </div>

      <div className={styles.accessibilityOptions}>
        <button
          type="button"
          className={settings.highContrast ? styles.accessibilityOptionActive : ""}
          aria-pressed={settings.highContrast}
          onClick={() => update({ highContrast: !settings.highContrast })}
        >
          Высокий контраст
        </button>
        <button
          type="button"
          className={settings.hideImages ? styles.accessibilityOptionActive : ""}
          aria-pressed={settings.hideImages}
          onClick={() => update({ hideImages: !settings.hideImages })}
        >
          Без изображений
        </button>
        <button
          type="button"
          className={settings.moreSpacing ? styles.accessibilityOptionActive : ""}
          aria-pressed={settings.moreSpacing}
          onClick={() => update({ moreSpacing: !settings.moreSpacing })}
        >
          Больше интервал
        </button>
      </div>

      <button
        className={styles.accessibilityReset}
        type="button"
        onClick={() => onChange(DEFAULT_ACCESSIBILITY)}
      >
        Обычная версия
      </button>
    </section>
  );
}

function LanguageModal({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, ready } = useSiteTranslator();
  const main = siteLanguages.filter((item) => item.group === "main");
  const cis = siteLanguages.filter((item) => item.group === "cis");
  const east = siteLanguages.filter((item) => item.group === "east");

  return (
      <section className={`${styles.languageModal} notranslate`} translate="no" role="dialog" aria-modal="false" aria-labelledby="language-modal-title">
        <div className={styles.languageModalHeader}>
          <div>
            <span className={styles.languageEyebrow}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</span>
            <h2 id="language-modal-title">Язык сайта</h2>
          </div>
          <button className={styles.languageClose} type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className={styles.languageGrid}>
          {main.map((item) => (
            <button
              key={item.code}
              type="button"
              className={`${styles.languageOption} ${language.code === item.code ? styles.languageOptionActive : ""}`}
              onClick={() => {
                setLanguage(item.code);
                onClose();
              }}
            >
              <img className={styles.languageFlagImage} src={item.flagSrc} alt="" aria-hidden="true" />
              <span>{item.label}</span>
              {language.code === item.code && <span className={styles.languageCheck}>✓</span>}
            </button>
          ))}
        </div>

        <div className={styles.languageSection}>
          <span className={styles.languageSectionTitle}>ЯЗЫКИ СНГ</span>
          <div className={styles.languageGrid}>
            {cis.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`${styles.languageOption} ${language.code === item.code ? styles.languageOptionActive : ""}`}
                onClick={() => {
                  setLanguage(item.code);
                  onClose();
                }}
              >
                <img className={styles.languageFlagImage} src={item.flagSrc} alt="" aria-hidden="true" />
                <span>{item.label}</span>
                {language.code === item.code && <span className={styles.languageCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.languageSection}>
          <span className={styles.languageSectionTitle}>БЛИЖНИЙ ВОСТОК</span>
          <div className={styles.languageGrid}>
            {east.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`${styles.languageOption} ${language.code === item.code ? styles.languageOptionActive : ""}`}
                onClick={() => {
                  setLanguage(item.code);
                  onClose();
                }}
              >
                <img className={styles.languageFlagImage} src={item.flagSrc} alt="" aria-hidden="true" />
                <span dir={item.dir}>{item.label}</span>
                {language.code === item.code && <span className={styles.languageCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.languageFooter}>
          <span className={`${styles.translationDot} ${ready ? styles.translationDotReady : ""}`} aria-hidden="true" />
          <span>{ready ? "Перевод выполняется автоматически для всего сайта." : "Сервис перевода загружается…"}</span>
        </div>
      </section>
  );
}

export function Header() {
  const pathname = usePathname();
  const { language } = useSiteTranslator();
  const [scrolled, setScrolled] = useState(false);
  const [deaneryOpen, setDeaneryOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const deaneryRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const accessibilityRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDeaneryOpen(false);
    setScheduleOpen(false);
    setLanguageOpen(false);
    setAccessibilityOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch("/api/admin/auth", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { authenticated?: boolean }) => setAdminAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAdminAuthenticated(false));
  }, [pathname]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
      if (!saved) {
        applyAccessibility(DEFAULT_ACCESSIBILITY);
        return;
      }
      const parsed = JSON.parse(saved) as Partial<AccessibilitySettings>;
      const restored: AccessibilitySettings = {
        scale: [90, 100, 110, 120].includes(Number(parsed.scale)) ? Number(parsed.scale) : 100,
        highContrast: Boolean(parsed.highContrast),
        hideImages: Boolean(parsed.hideImages),
        moreSpacing: Boolean(parsed.moreSpacing),
      };
      setAccessibility(restored);
      applyAccessibility(restored);
    } catch {
      applyAccessibility(DEFAULT_ACCESSIBILITY);
    }
  }, []);

  const updateAccessibility = (next: AccessibilitySettings) => {
    setAccessibility(next);
    applyAccessibility(next);
    try {
      window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage может быть недоступен в приватном режиме — настройки всё равно применятся в текущей вкладке.
    }
  };

  useEffect(() => {
    if (!deaneryOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!deaneryRef.current?.contains(event.target as Node)) setDeaneryOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeaneryOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deaneryOpen]);

  useEffect(() => {
    if (!scheduleOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!scheduleRef.current?.contains(event.target as Node)) setScheduleOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScheduleOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [scheduleOpen]);

  useEffect(() => {
    if (!languageOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [languageOpen]);

  useEffect(() => {
    if (!accessibilityOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!accessibilityRef.current?.contains(event.target as Node)) setAccessibilityOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccessibilityOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accessibilityOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const logoutAdmin = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAdminAuthenticated(false);
    setAccountOpen(false);
    window.location.reload();
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <a className={styles.logo} href="/" aria-label="Математический факультет ВГУ">
          <Image src="/images/logo.png" alt="Матфак ВГУ" width={120} height={120} priority />
        </a>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <div className={styles.navItem} key={item.label}>
              <a
                href={item.href}
                className={`${styles.navLink} ${isActive(pathname, item.label, item.href) ? styles.active : ""}`}
              >
                {item.label}
              </a>

              <div className={styles.dropdown} aria-label={`Подразделы: ${item.label}`}>
                <span className={styles.dropdownTitle}>{item.label}</span>
                <div className={styles.dropdownLinks}>
                  {item.menu.map((subItem) => (
                    <a
                      href={subItem.href}
                      key={`${item.label}-${subItem.label}`}
                      target={subItem.external ? "_blank" : undefined}
                      rel={subItem.external ? "noreferrer" : undefined}
                    >
                      {subItem.label}
                      {subItem.external && <span aria-hidden="true">↗</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.scheduleWrap} ref={scheduleRef}>
            <button
              className={`${styles.iconButton} ${scheduleOpen ? styles.scheduleButtonActive : ""}`}
              type="button"
              aria-label="Расписание занятий"
              aria-expanded={scheduleOpen}
              aria-controls="site-schedule-popover"
              onClick={() => {
                setDeaneryOpen(false);
                setLanguageOpen(false);
                setAccessibilityOpen(false);
                setAccountOpen(false);
                setScheduleOpen((value) => !value);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                <path d="M7 3.8v3.4M17 3.8v3.4M3.5 9.5h17M8 13h3M13 13h3M8 16.5h3" />
              </svg>
            </button>

            {scheduleOpen && (
              <div id="site-schedule-popover" className={styles.schedulePopover}>
                <ScheduleMenu canEdit={adminAuthenticated} />
              </div>
            )}
          </div>

          <div className={styles.deaneryWrap} ref={deaneryRef}>
            <button
              className={`${styles.deanery} ${deaneryOpen ? styles.deaneryActive : ""}`}
              type="button"
              aria-expanded={deaneryOpen}
              aria-controls="deanery-contact-menu"
              onClick={() => {
                setScheduleOpen(false);
                setLanguageOpen(false);
                setAccessibilityOpen(false);
                setAccountOpen(false);
                setDeaneryOpen((value) => !value);
              }}
            >
              Деканат
            </button>

            <div
              id="deanery-contact-menu"
              className={`${styles.deaneryPanel} ${deaneryOpen ? styles.deaneryPanelOpen : ""}`}
            >
              <span className={styles.deaneryKicker}>СВЯЗАТЬСЯ</span>
              <strong>Деканат</strong>
              <span className={styles.deaneryPlace}>Главный корпус ВГУ · 3 этаж · ауд. 333А</span>
              <div className={styles.deaneryContacts}>
                <a href="tel:+74732208460">+7 (473) 220-84-60</a>
                <a href="tel:+74732208553">+7 (473) 220-85-53</a>
                <a href="mailto:deanery@math.vsu.ru">deanery@math.vsu.ru</a>
              </div>
              <a className={styles.deaneryMore} href="/contacts">Все контакты →</a>
            </div>
          </div>

          <div className={styles.accountWrap} ref={accountRef}>
            <button
              className={`${styles.iconButton} ${accountOpen ? styles.accountButtonActive : ""}`}
              type="button"
              aria-label="Управление сайтом"
              aria-expanded={accountOpen}
              onClick={() => {
                setDeaneryOpen(false);
                setScheduleOpen(false);
                setAccessibilityOpen(false);
                setLanguageOpen(false);
                setAccountOpen((value) => !value);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20v-2.7A5.7 5.7 0 0 1 11.2 11.6h1.6a5.7 5.7 0 0 1 5.7 5.7V20" /></svg>
            </button>
            {accountOpen && (
              <div className={`${styles.accountPopover} notranslate`} translate="no">
                <span className={styles.accountKicker}>УПРАВЛЕНИЕ САЙТОМ</span>
                <strong>{adminAuthenticated ? "Администратор" : "Вход"}</strong>
                <p>{adminAuthenticated ? "Режим редактирования включён." : "Авторизуйтесь, чтобы редактировать сайт."}</p>
                {adminAuthenticated ? (
                  <>
                    <a href="/admin">Открыть админ-панель →</a>
                    <button type="button" onClick={() => void logoutAdmin()}>Выйти</button>
                  </>
                ) : (
                  <a className={styles.accountPrimary} href="/admin">Войти в админ-панель →</a>
                )}
              </div>
            )}
          </div>
          <div className={styles.accessibilityWrap} ref={accessibilityRef}>
            <button
              className={`${styles.iconButton} ${accessibilityOpen ? styles.accessibilityButtonActive : ""}`}
              type="button"
              aria-label="Версия для слабовидящих"
              aria-expanded={accessibilityOpen}
              aria-controls="site-accessibility-popover"
              onClick={() => {
                setDeaneryOpen(false);
                setScheduleOpen(false);
                setLanguageOpen(false);
                setAccountOpen(false);
                setAccessibilityOpen((value) => !value);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.6 12s3.4-5.2 9.4-5.2S21.4 12 21.4 12 18 17.2 12 17.2 2.6 12 2.6 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>
            </button>

            {accessibilityOpen && (
              <div id="site-accessibility-popover" className={styles.accessibilityPopover}>
                <AccessibilityMenu
                  settings={accessibility}
                  onChange={updateAccessibility}
                  onClose={() => setAccessibilityOpen(false)}
                />
              </div>
            )}
          </div>
          <div className={styles.languageWrap} ref={languageRef}>
            <button
              className={`${styles.iconButton} ${styles.lang} notranslate ${languageOpen ? styles.langActive : ""}`}
              translate="no"
              type="button"
              aria-label={`Язык сайта: ${language.label}`}
              aria-expanded={languageOpen}
              aria-controls="site-language-popover"
              onClick={() => {
                setDeaneryOpen(false);
                setScheduleOpen(false);
                setAccessibilityOpen(false);
                setAccountOpen(false);
                setLanguageOpen((value) => !value);
              }}
            >
              <img className={styles.headerLanguageFlagImage} src={language.flagSrc} alt="" aria-hidden="true" />
            </button>

            {languageOpen && (
              <div id="site-language-popover" className={styles.languagePopover}>
                <LanguageModal onClose={() => setLanguageOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </header>

    </>
  );
}
