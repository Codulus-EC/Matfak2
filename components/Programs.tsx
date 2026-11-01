"use client";

import { useState } from "react";
import { programStats, programTabs, programs, type ProgramTab } from "@/lib/data";
import styles from "./Programs.module.css";

export function Programs() {
  const [active, setActive] = useState<ProgramTab>("Бакалавриат");
  const current = programs[active];
  const stats = programStats[active];
  const total = stats.budget + stats.paid;
  const durationNumber = stats.duration.split(" ")[0];
  const durationUnit = stats.duration.replace(durationNumber, "").trim();

  return (
    <section className={styles.section} id="programs">
      <div className={styles.inner}>
        <h2>ПРОГРАММЫ</h2>

        <div className={styles.tabs} role="tablist" aria-label="Уровни образования">
          {programTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={tab === active ? styles.active : ""}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <aside className={styles.stats}>
            <div className={styles.stat}>
              <strong>{durationNumber}</strong>
              <span>{durationUnit || "—"}<br />Срок обучения</span>
            </div>

            <div className={styles.stat}>
              <strong>{stats.budget}</strong>
              <span>Бюджетных<br />мест</span>
            </div>

            <div className={styles.stat}>
              <strong>{stats.paid}</strong>
              <span>Платных<br />мест</span>
            </div>

            <div className={styles.stat}>
              <strong>{total}</strong>
              <span>Мест<br />всего</span>
            </div>
          </aside>

          <div className={styles.cards}>
            {current.map((program, index) => (
              <a
                className={`${styles.card} ${styles[`tone${(index % 4) + 1}`]}`}
                href="#contacts"
                key={`${program.code}-${program.title}-${index}`}
              >
                <small>{program.code || active}</small>
                <h3>{program.title}</h3>
                <span>Подробнее →</span>
              </a>
            ))}

            {current.length === 0 && (
              <div className={styles.empty}>
                По этому уровню пока нет подтверждённых карточек направлений.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
