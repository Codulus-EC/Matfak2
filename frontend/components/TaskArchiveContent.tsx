import { solvedTaskArchive } from "./TaskArchiveData";
import "./TaskArchive.css";

const yearOrder = [2025, 2024, 2023];
const stageOrder = ["Заключительный тур", "Отборочный тур"] as const;

export function TaskArchiveContent() {
  return (
    <section className="task-archive-content" aria-labelledby="archive-list-title">
      <div className="task-archive-shell">
        <header className="task-archive-intro">
          <span>МАТЕРИАЛЫ ПРОШЛЫХ ЛЕТ</span>
          <h2 id="archive-list-title">РЕШЁННЫЕ<br />ЗАДАЧИ</h2>
          <p>
            Никаких больших превью — только аккуратно собранные PDF с решениями.
            Материалы идут от новых к старым и разделены по году и этапу олимпиады.
          </p>
        </header>

        {yearOrder.map((year) => {
          const yearItems = solvedTaskArchive.filter((item) => item.year === year);
          return (
            <section className="task-archive-year" id={`year-${year}`} key={year}>
              <div className="task-archive-year-heading">
                <span>АРХИВ</span>
                <h3>{year}</h3>
              </div>

              {stageOrder.map((stage) => {
                const items = yearItems.filter((item) => item.stage === stage);
                if (!items.length) return null;

                return (
                  <div className="task-file-group" key={`${year}-${stage}`}>
                    <div className="task-file-group-title">
                      <h4>{stage}</h4>
                      <span>{items.length} {items.length === 1 ? "файл" : items.length < 5 ? "файла" : "файлов"}</span>
                    </div>

                    <div className="task-file-list">
                      {items.map((item) => (
                        <article className="task-file-row" key={`${item.year}-${item.stage}-${item.group}`}>
                          <div className="task-file-type" aria-hidden="true">PDF</div>
                          <div className="task-file-copy">
                            <strong>{item.fileName}</strong>
                            <span>{item.group} · {item.description}</span>
                          </div>
                          <a href={item.href} target="_blank" rel="noreferrer">
                            Открыть PDF ↗
                          </a>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </section>
  );
}
