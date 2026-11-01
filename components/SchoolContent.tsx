"use client";

import { useMemo, useState } from "react";
import { resultsArchive, schoolContactEmail, schoolLessonTimes, schoolRegistrationUrl, type ResultStage } from "@/lib/schoolData";
import regionalStyles from "./RegionalOlympiadIntro.module.css";
import schoolStyles from "./OlympiadSchoolLayout.module.css";
import cardStyles from "./OlympiadSchoolCards.module.css";
import "./SchoolExpandedBlocks.css";

type TaskMaterial = {
  year: number;
  group: string;
  href: string;
  label: string;
};

const taskMaterials: TaskMaterial[] = [
  {
    year: 2025,
    group: "5 класс",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/5-класс-заочный-тур-решения.pdf",
  },
  {
    year: 2025,
    group: "6–7 классы",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/6-7-класс-заочный-тур-решения.pdf",
  },
  {
    year: 2025,
    group: "8–9 классы",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/8-9-класс-заочный-тур-решения.pdf",
  },
  {
    year: 2025,
    group: "10–11 классы",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/10-11-класс-заочный-тур-решения.pdf",
  },
  {
    year: 2024,
    group: "6–7 классы",
    label: "Отборочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/02/6-7-класс-отборочный-тур-решения.pdf",
  },
  {
    year: 2024,
    group: "8–9 классы",
    label: "Отборочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/02/8-9-класс-отборочный-тур-решения.pdf",
  },
  {
    year: 2024,
    group: "10–11 классы",
    label: "Отборочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/02/10-11-класс-отборочный-тур-решение.pdf",
  },
  {
    year: 2023,
    group: "6 класс",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/02/Zaochny_tur_Olimpiada_reshenia_6_klass.pdf",
  },
  {
    year: 2023,
    group: "7 класс",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/02/Zaochny_tur_Olimpiada_reshenia_7_klass.pdf",
  },
  {
    year: 2023,
    group: "8–9 классы",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/02/Zaochny_tur_Olimpiada_reshenia_8-9_klass.pdf",
  },
  {
    year: 2023,
    group: "10–11 классы",
    label: "Заочный тур →",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/02/Zaochny_tur_Olimpiada_reshenia10-11klass.pdf",
  },
];

export function SchoolContent() {
  const [year, setYear] = useState(2026);
  const [stage, setStage] = useState<ResultStage>("qualifying");
  const [taskYear, setTaskYear] = useState(2025);
  const currentFiles = useMemo(() => resultsArchive.filter((item) => item.year === year && item.stage === stage), [year, stage]);
  const currentTaskMaterials = useMemo(() => taskMaterials.filter((item) => item.year === taskYear), [taskYear]);

  return (
    <>
      <section className={regionalStyles.section} id="olympiad">
        <div className={regionalStyles.inner}>
          <h2 className={regionalStyles.title}>
            РЕГИОНАЛЬНАЯ
            <br />
            ОЛИМПИАДА
          </h2>

          <p className={regionalStyles.description}>
            Для школьников, которым интересно
            <br />
            выйти за рамки обычной школьной
            <br />
            программы и попробовать себя в
            <br />
            решении нестандартных
            <br />
            математических задач.
          </p>

          <div className={regionalStyles.cards}>
            <article className={`${regionalStyles.card} ${regionalStyles.cardPurple}`}>
              <span>Доступно для школьников</span>
              <strong>5–11</strong>
              <b>КЛАССОВ</b>
            </article>

            <article className={`${regionalStyles.card} ${regionalStyles.cardBlue}`}>
              <strong className={regionalStyles.twoStages}>2 ЭТАПА</strong>
              <div className={regionalStyles.stagePill}>Отборочный</div>
              <div className={regionalStyles.stagePill}>Заключительный</div>
            </article>

            <article className={`${regionalStyles.card} ${regionalStyles.cardPink}`}>
              <span>Заключительный этап проходит</span>
              <strong className={regionalStyles.mainBuilding}>
                в ГЛАВНОМ
                <br />
                КОРПУСЕ
              </strong>
            </article>
          </div>
        </div>
      </section>

      <section className={schoolStyles.section} id="olympiad-school">
        <div className={schoolStyles.guides} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={schoolStyles.inner}>
          <h2 className={schoolStyles.title}>
            ШКОЛА
            <br />
            ОЛИМПИАДНОЙ
            <br />
            МАТЕМАТИКИ
          </h2>

          <div className={schoolStyles.placeholderGrid} aria-label="О Школе олимпиадной математики">
            <article className={`${schoolStyles.placeholder} ${schoolStyles.placeholderTall} ${cardStyles.card} ${cardStyles.mainCard}`}>
              <span className={cardStyles.eyebrow}>ФОРМАТ</span>
              <h3>КАК ПРОХОДЯТ<br />ЗАНЯТИЯ</h3>

              <div className={cardStyles.lessonList}>
                <div>
                  <strong>Олимпиадные задачи</strong>
                  <span>Нестандартные задачи за рамками обычной школьной программы</span>
                </div>
                <div>
                  <strong>Разбор решений</strong>
                  <span>Обсуждение подходов и способов решения</span>
                </div>
                <div>
                  <strong>Домашние задания</strong>
                  <span>Практика между занятиями для закрепления материала</span>
                </div>
              </div>
            </article>

            <div className={schoolStyles.rightStack}>
              <article className={`${schoolStyles.placeholder} ${cardStyles.card} ${cardStyles.factCard}`}>
                <span className={cardStyles.eyebrow}>ПРЕПОДАВАТЕЛИ</span>
                <h3>Ведут лучшие<br />преподаватели ВГУ</h3>
              </article>

              <article className={`${schoolStyles.placeholder} ${cardStyles.card} ${cardStyles.freeCard}`}>
                <span className={cardStyles.eyebrow}>СТОИМОСТЬ</span>
                <div className={cardStyles.freeMark}>0 ₽</div>
                <h3>Бесплатное обучение</h3>
              </article>
            </div>
          </div>

          <a
            className={schoolStyles.signup}
            href={schoolRegistrationUrl}
            target="_blank"
            rel="noreferrer"
          >
            Записаться
          </a>
        </div>
      </section>

      <section className="school-section school-schedule" id="schedule">
        <div className="section-shell school-shell schedule-shell">
          <header className="schedule-title-block">
            <h2>РАСПИСАНИЕ</h2>
            <div className="schedule-underlined">Аудиторию сообщат дополнительно</div>
            <p>
              Занятия проходят еженедельно по субботам в Главном корпусе ВГУ,
              Университетская площадь, 1.
            </p>
          </header>

          <div className="schedule-grid">
            {schoolLessonTimes.map((item) => (
              <article key={item.group}>
                <span>{item.group}</span>
                <strong>{item.time}</strong>
                <small>Главный корпус ВГУ</small>
              </article>
            ))}
          </div>

          <div className="schedule-timeline" aria-label="Основные даты Школы олимпиадной математики 2026">
            <div className="timeline-step">
              <strong>до 04.10.26</strong>
              <a href={schoolRegistrationUrl} target="_blank" rel="noreferrer">
                Регистрация в школу
              </a>
            </div>

            <div className="timeline-arrow" aria-hidden="true">↓</div>

            <div className="timeline-step">
              <strong>ОКТЯБРЬ 2026</strong>
              <span>Старт занятий</span>
            </div>

            <div className="timeline-arrow" aria-hidden="true">↓</div>

            <div className="timeline-step">
              <strong>КАЖДУЮ СУББОТУ</strong>
              <span>Занятия по группам</span>
            </div>

            <div className="timeline-arrow" aria-hidden="true">↓</div>

            <div className="timeline-step timeline-step-final">
              <strong>ШКОЛЬНЫЕ КАНИКУЛЫ</strong>
              <span>Очные интенсивы и мини-олимпиады</span>
            </div>
          </div>
        </div>
      </section>

      <section className="school-section tasks-section" id="tasks">
        <div className="section-shell school-shell compact">
          <div className="school-heading light tasks-heading-row">
            <div>
              <span>МАТЕРИАЛЫ</span>
              <h2>ПРИМЕРЫ<br />ЗАДАЧ</h2>
            </div>

            <div className="task-year-filters" aria-label="Выбрать год материалов">
              {[2025, 2024, 2023].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={taskYear === item ? "is-active" : ""}
                  onClick={() => setTaskYear(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="task-cards">
            {currentTaskMaterials.map((item) => (
              <a href={`/schoolchildren/tasks#year-${item.year}`} key={`${item.year}-${item.group}`}>
                {item.group}
                <span>Архив решений →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="school-section results-section" id="results">
        <div className="section-shell school-shell compact">
          <div className="school-heading">
            <span>АРХИВ</span>
            <h2>РЕЗУЛЬТАТЫ<br />ПРОШЛЫХ ЛЕТ</h2>
          </div>

          <div className="result-filters">
            <div>
              {[2026, 2025, 2024, 2023].map((item) => (
                <button type="button" className={year === item ? "is-active" : ""} onClick={() => setYear(item)} key={item}>
                  {item}
                </button>
              ))}
            </div>
            <div>
              <button type="button" className={stage === "qualifying" ? "is-active" : ""} onClick={() => setStage("qualifying")}>Заочный этап</button>
              <button type="button" className={stage === "final" ? "is-active" : ""} onClick={() => setStage("final")}>Очный этап</button>
            </div>
          </div>

          {currentFiles.length ? (
            <details className="github-result-box" open>
              <summary>
                <span className="github-result-folder">▾</span>
                <strong>{year} · {stage === "qualifying" ? "Заочный этап" : "Очный этап"}</strong>
                <em>{currentFiles.length} {currentFiles.length === 1 ? "файл" : currentFiles.length < 5 ? "файла" : "файлов"}</em>
              </summary>

              <div className="github-result-list">
                {currentFiles.map((file) => (
                  <article className="github-result-row" key={file.href}>
                    <span className={`github-file-badge github-file-${file.format.toLowerCase()}`}>{file.format}</span>
                    <div className="github-file-copy">
                      <h3>{file.fileName}</h3>
                      <p><strong>{file.title}</strong> · {file.description}</p>
                    </div>
                    <a href={file.href} target="_blank" rel="noreferrer" aria-label={`Открыть ${file.fileName}`}>
                      Скачать ↗
                    </a>
                  </article>
                ))}
              </div>
            </details>
          ) : (
            <div className="results-empty">
              <strong>Файл пока не найден в переданных материалах</strong>
              <span>Для выбранного года и этапа в исходном архиве сайта нет подтверждённого файла результатов.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
