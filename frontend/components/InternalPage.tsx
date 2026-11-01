import { Header } from "@/components/Header";
import { ContactFooter } from "@/components/ContactFooter";
import type { InternalPageData, PageSection } from "@/lib/internalPages";
import styles from "./InternalPage.module.css";

function Section({ section, index }: { section: PageSection; index: number }) {
  const cols = section.columns ?? 3;
  const sectionId = section.id ?? `section-${index + 1}`;

  return (
    <section id={sectionId} className={`${styles.section} ${styles[section.variant ?? "plain"]}`}>
      <div className={styles.sectionInner}>
        <header className={styles.sectionHead}>
          {section.kicker && <span>{section.kicker}</span>}
          <h2>{section.title}</h2>
          {section.text && <p>{section.text}</p>}
        </header>
        {section.cards && (
          <div className={styles.cardGrid} style={{ "--cols": cols } as React.CSSProperties}>
            {section.cards.map((card, cardIndex) => {
              const content = (
                <>
                  {(card.eyebrow || card.meta) && <span className={styles.cardEyebrow}>{card.eyebrow ?? card.meta}</span>}
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  {card.href && <b className={styles.cardArrow}>Подробнее →</b>}
                </>
              );

              return card.href ? (
                <a
                  className={styles.card}
                  href={card.href}
                  key={`${card.title}-${cardIndex}`}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                >
                  {content}
                </a>
              ) : (
                <article className={styles.card} key={`${card.title}-${cardIndex}`}>{content}</article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqBlock({ items }: { items: NonNullable<InternalPageData["faq"]> }) {
  return (
    <section className={`${styles.section} ${styles.faqSection}`}>
      <div className={styles.faqInner}>
        <div className={styles.faqTitle}>
          <span>FAQ</span>
          <h2>ЧАСТЫЕ<br />ВОПРОСЫ</h2>
          <p>Собрали основные ответы, которые уже были заложены в исходной версии раздела.</p>
        </div>
        <div className={styles.faqList}>
          {items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}<i>+</i></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildHeroLinks(data: InternalPageData) {
  if (data.heroLinks?.length) return data.heroLinks;

  return data.sections.slice(0, 5).map((section, index) => ({
    label: section.kicker ?? section.title,
    href: `#${section.id ?? `section-${index + 1}`}`,
  }));
}

export function InternalPage({ data, contacts = false }: { data: InternalPageData; contacts?: boolean }) {
  const heroLinks = buildHeroLinks(data);

  return (
    <main className={styles.page}>
      <Header />

      <section className={`${styles.hero} ${styles[`theme_${data.theme ?? "green"}`]}`}>
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <span className={styles.heroLabel}>{data.label ?? "МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ"}</span>
          <h1>{data.title}</h1>
          <p>{data.description}</p>

          {heroLinks.length > 0 && (
            <nav className={styles.heroLinks} aria-label="Навигация по разделу">
              {heroLinks.map((item, index) => (
                <span className={styles.heroLinkItem} key={`${item.label}-${item.href}`}>
                  <a href={item.href}>{item.label}</a>
                  {index < heroLinks.length - 1 && <i aria-hidden="true">•</i>}
                </span>
              ))}
            </nav>
          )}
        </div>
      </section>

      {data.sections.map((section, index) => <Section key={`${section.title}-${index}`} section={section} index={index} />)}
      {data.faq && <FaqBlock items={data.faq} />}

      {!contacts && (
        <section className={styles.cta}>
          <div><span>НУЖНА ПОМОЩЬ?</span><h2>Свяжитесь с факультетом</h2><p>Деканат поможет уточнить информацию по разделу и подскажет, где найти нужные материалы.</p></div>
          <div className={styles.ctaActions}><a href="/contacts">Контакты →</a><a href="mailto:deanery@math.vsu.ru">Написать на почту ↗</a></div>
        </section>
      )}

      <ContactFooter />
    </main>
  );
}
