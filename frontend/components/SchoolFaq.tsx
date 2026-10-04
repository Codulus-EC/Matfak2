"use client";

import { useState } from "react";
import { schoolContactEmail } from "@/lib/schoolData";
import styles from "./SchoolFaq.module.css";

const questions = [
  ["С какого класса можно заниматься?", "Школа рассчитана на учеников 5–11 классов."],
  ["Нужен ли опыт участия в олимпиадах?", "Нет. Достаточно интереса к математике и готовности решать нестандартные задачи."],
  ["Как проходят занятия?", "Занятия проводят преподаватели ВГУ. Домашняя работа обязательна, на каникулах планируются интенсивы и мини-олимпиады."],
  ["Сколько стоит участие?", "Занятия в школе олимпиадной математики бесплатные."],
  ["Как записаться?", "Через форму регистрации. Ссылка находится в блоке школы и в верхней части страницы."],
  ["Где проходят занятия?", "В главном корпусе ВГУ на Университетской площади, 1. Аудитория сообщается организаторами отдельно."],
  ["Можно ли посмотреть задачи прошлых лет?", "Да, на странице есть раздел с материалами и ссылками на решения прошлых лет."],
  ["Когда появятся даты олимпиады 2027?", "После выхода официального приказа. Пока на странице размещается информация об олимпиаде 2026 года."],
];

export function SchoolFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section} id="school-faq">
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
              Собрали короткие ответы на то, что чаще всего волнует
              школьников и родителей.
            </p>
          </div>

          <div className={styles.grid}>
            {questions.map(([question, answer], index) => {
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
          <p>
            Напиши организаторам школы — поможем разобраться
            с занятиями, олимпиадой и регистрацией.
          </p>
          <a
            href={`mailto:${schoolContactEmail}?subject=Вопрос%20со%20страницы%20для%20школьников`}
          >
            Задать вопрос <b>›</b>
          </a>
        </div>
      </div>
    </section>
  );
}
