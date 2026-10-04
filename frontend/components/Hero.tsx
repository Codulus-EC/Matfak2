"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import styles from "./Hero.module.css";

const slides = [
  "/images/hero-board.jpg",
  "/images/hero-board.jpg",
  "/images/hero-board.jpg",
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((v) => (v + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const go = (next: number) => setActive((next + slides.length) % slides.length);

  return (
    <section className={styles.hero} id="top">
      {slides.map((src, index) => (
        <div
          className={`${styles.bg} ${index === active ? styles.activeBg : ""}`}
          key={`${src}-${index}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,35,43,.17), rgba(0,35,43,.24)), url(${src})` }}
        />
      ))}

      <Header />

      <div className={styles.copy}>
        <div className={styles.eyebrow}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</div>
        <h1>
          <span>Мат фак</span>
          <b>это про <em>жизнь</em></b>
        </h1>
        <p>Математика — это ключ к будущему!</p>
        <div className={styles.actions}>
          <a className={`${styles.button} ${styles.primary}`} href="#programs">Подать документы <span>›</span></a>
          <a className={`${styles.button} ${styles.outline}`} href="#programs">Выбрать программу <span>›</span></a>
        </div>
      </div>

      <div className={styles.switcher} aria-label="Переключение hero-слайдов">
        <button onClick={() => go(active - 1)} aria-label="Предыдущий слайд">‹</button>
        <div className={styles.dots}>
          {slides.map((_, index) => (
            <button key={index} className={index === active ? styles.activeDot : ""} onClick={() => go(index)} aria-label={`Слайд ${index + 1}`} />
          ))}
        </div>
        <button onClick={() => go(active + 1)} aria-label="Следующий слайд">›</button>
      </div>
    </section>
  );
}
