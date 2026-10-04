import styles from "./WhyMatfac.module.css";

export function WhyMatfac() {
  return (
    <section className={styles.section} id="why">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h2>
            ПОЧЕМУ
            <br />
            ВЫБИРАЮТ
          </h2>
          <p>Мат фак?</p>
        </div>

        <div className={styles.mosaic}>
          <article className={`${styles.card} ${styles.years}`}>
            <strong>108 лет</strong>
            <span>
              ЛИДЕР
              <br />
              по качеству
              <br />
              образования
            </span>
          </article>

          <article className={`${styles.card} ${styles.science}`}>
            Научная
            <br />
            работа с
            <br />
            первых
            <br />
            курсов
          </article>

          <article className={`${styles.card} ${styles.international}`}>
            МЕЖДУНАРОДНЫЕ СВЯЗИ
          </article>

          <article className={`${styles.card} ${styles.researchInstitute}`}>
            НИИ
            <br />
            МАТЕМАТИКИ
          </article>

          <article className={`${styles.card} ${styles.practice}`}>
            ПРАКТИКА
            <br />
            В ВЕДУЩИХ
            <br />
            КОМПАНИЯХ
            <br />
            СТРАНЫ
          </article>

          <div className={styles.stack}>
            <article className={`${styles.card} ${styles.diploma}`}>
              ДИПЛОМ
              <br />
              ПРИЗНАЁТСЯ
              <br />
              ЗА РУБЕЖОМ
            </article>

            <article className={`${styles.card} ${styles.careers}`}>
              IT
              <br />
              АНАЛИТИКА
              <br />
              ФИНАНСЫ
            </article>

            <article className={`${styles.card} ${styles.labs}`}>
              НАУЧНЫЕ
              <br />
              ЛАБОРАТОРИИ
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
