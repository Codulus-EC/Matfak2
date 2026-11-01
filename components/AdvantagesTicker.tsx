import { advantages } from "@/lib/data";
import styles from "./AdvantagesTicker.module.css";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...advantages, ...advantages];

  return (
    <div className={styles.row}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ""}`}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}

export function AdvantagesTicker({
  showArrow = false,
}: {
  showArrow?: boolean;
}) {
  return (
    <section
      className={`${styles.ticker} ${showArrow ? styles.beforePrograms : styles.afterHero}`}
      aria-label="Преимущества"
    >
      <Row />
      <Row reverse />

      {showArrow && (
        <div className={styles.bridgeArrow} aria-hidden="true">
          <i />
          <b>↓</b>
        </div>
      )}
    </section>
  );
}
