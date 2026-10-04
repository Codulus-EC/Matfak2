"use client";

import { useState } from "react";
import { faq } from "@/lib/data";
import styles from "./Faq.module.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.faqArea}>
        <div className={styles.inner}>
          <div className={styles.headingRow}>
            <div className={styles.headingBlock}>
              <span className={styles.kicker}>FAQ</span>
              <h2>
                ЧАСТЫЕ
                <br />
                ВОПРОСЫ
              </h2>
            </div>

            <p className={styles.intro}>
              Собрали ответы на то, что чаще всего волнует абитуриентов,
              студентов и школьников.
            </p>
          </div>

          <div className={styles.grid}>
            {faq.map(([question, answer], index) => {
              const isOpen = open === index;

              return (
                <article
                  className={`${styles.item} ${isOpen ? styles.open : ""}`}
                  key={question}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <b>{isOpen ? "−" : "+"}</b>
                  </button>

                  {isOpen && <p className={styles.answer}>{answer}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.questionArea}>
        <div className={styles.photoLayer}>
          <img src="/images/vsu-campus.jpg" alt="Главный корпус ВГУ" />
        </div>

        <div className={styles.questionContent}>
          <h3>ОСТАЛИСЬ ВОПРОСЫ?</h3>
          <a href="mailto:deanery@math.vsu.ru?subject=Вопрос%20с%20сайта%20математического%20факультета">
            Задай их прямо сейчас! <b>›</b>
          </a>
        </div>
      </div>
    </section>
  );
}
