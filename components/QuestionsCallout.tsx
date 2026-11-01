import styles from "./QuestionsCallout.module.css";

export function QuestionsCallout() {
  return (
    <section className={styles.section} aria-labelledby="questions-callout-title">
      <div className={styles.photoLayer} aria-hidden="true">
        <img src="/images/vsu-campus.jpg" alt="" />
      </div>

      <div className={styles.content}>
        <span className={styles.kicker}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</span>
        <h2 id="questions-callout-title">ОСТАЛИСЬ ВОПРОСЫ?</h2>
        <a href="mailto:deanery@math.vsu.ru?subject=Вопрос%20с%20сайта%20математического%20факультета">
          Задай их прямо сейчас! <b aria-hidden="true">›</b>
        </a>
      </div>
    </section>
  );
}
