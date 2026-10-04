"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

const navItems = [
  ["Обучение", "/#top"],
  ["Абитуриентам", "/#programs"],
  ["Студентам", "/#events"],
  ["Школьникам", "/schoolchildren"],
  ["Новости", "/#events"],
  ["О факультете", "/#why"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isSchool = pathname.startsWith("/schoolchildren");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <a className={styles.logo} href="/" aria-label="Математический факультет ВГУ">
        <Image src="/images/logo.png" alt="Матфак ВГУ" width={120} height={120} priority />
      </a>

      <nav className={styles.nav} aria-label="Основная навигация">
        {navItems.map(([label, href], index) => {
          const active = isSchool ? label === "Школьникам" : index === 0;
          return (
            <a key={label} href={href} className={active ? styles.active : ""}>
              {label}
            </a>
          );
        })}
      </nav>

      <div className={styles.actions}>
        <a className={styles.deanery} href={isSchool ? "#school-contacts" : "#contacts"}>
          Деканат
        </a>

        <button className={styles.iconButton} type="button" aria-label="Личный кабинет">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 20v-2.7A5.7 5.7 0 0 1 11.2 11.6h1.6a5.7 5.7 0 0 1 5.7 5.7V20" />
          </svg>
        </button>

        <button className={styles.iconButton} type="button" aria-label="Версия для слабовидящих">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.6 12s3.4-5.2 9.4-5.2S21.4 12 21.4 12 18 17.2 12 17.2 2.6 12 2.6 12Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </button>

        <button className={`${styles.iconButton} ${styles.lang}`} type="button" aria-label="Язык: русский">
          <span className={styles.flag} aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
    </header>
  );
}
