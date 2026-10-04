import Image from "next/image";
import styles from "./ContactFooter.module.css";

const mapEmbed = "https://yandex.ru/map-widget/v1/?mode=search&text=%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B3%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D1%83%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D0%B5%D1%82%2C%20%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C%2C%201&z=16";
const mapLink = "https://yandex.ru/maps/?text=%D0%92%D0%93%D0%A3%20%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D0%B5%D1%82%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C%201";

export function ContactFooter({ school = false }: { school?: boolean }) {
  const email = school ? "kiseleva@math.vsu.ru" : "deanery@math.vsu.ru";

  return (
    <footer className={styles.contactSection} id={school ? "school-contacts" : "contacts"}>
      <div className={styles.contactScreen}>
        <div className={styles.contactGrid}>
          <div className={styles.contactCopy}>
            <span className={styles.kicker}>КОНТАКТЫ</span>
            <h2>{school ? <>Школьникам<br />и родителям</> : <>Наши<br />контакты</>}</h2>
            <p className={styles.lead}>Воронеж, Университетская площадь, 1</p>

            <div className={styles.contactGroup}>
              <h3>Где мы находимся:</h3>
              <a href={mapLink} target="_blank" rel="noreferrer">
                394018, Россия, г. Воронеж<br />
                Университетская площадь, 1<br />
                главный корпус ВГУ, 3 этаж, ауд. 333А
              </a>
            </div>

            <div className={styles.contactGroup}>
              <h3>Номера телефонов:</h3>
              <a href="tel:+74732208460">+7 (473) 220-84-60</a>
              <a href="tel:+74732208553">+7 (473) 220-85-53</a>
            </div>

            <div className={styles.contactGroup}>
              <h3>Почта:</h3>
              <a href={`mailto:${email}`}>{email}</a>
            </div>

            <div className={styles.socialBlock}>
              <h3>Мы в интернете:</h3>
              <div className={styles.socialRow}>
                <a href="https://vk.com/math_vsu" target="_blank" rel="noreferrer" aria-label="ВКонтакте">
                  <Image src="/images/social/vk.png" alt="ВКонтакте" width={82} height={82} />
                </a>
                <a href="https://t.me/math_vsu" target="_blank" rel="noreferrer" aria-label="Telegram">
                  <Image src="/images/social/telegram.png" alt="Telegram" width={82} height={82} />
                </a>
                <span className={styles.socialPlaceholder} title="Ссылка сообщества MAX будет добавлена позже" aria-label="MAX">
                  <Image src="/images/social/max.png" alt="MAX" width={82} height={82} />
                </span>
              </div>
            </div>

            <a className={styles.contactCta} href={`mailto:${email}`}>
              Остались вопросы? Написать в деканат <b>→</b>
            </a>
          </div>

          <div className={styles.mapWrap}>
            <div className={styles.mapCard}>
              <iframe
                src={mapEmbed}
                title="Математический факультет ВГУ на Яндекс Картах"
                loading="lazy"
                allowFullScreen
              />
              <a href={mapLink} target="_blank" rel="noreferrer">
                ⌖ Открыть в Яндекс Картах <b>→</b>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.footerBrand}>
          <Image src="/images/logo.png" alt="Матфак ВГУ" width={68} height={68} />
          <div>
            <strong>Математический факультет ВГУ</strong>
            <span>Математика — это ключ к будущему!</span>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <strong>Факультет</strong>
          <a href="#why">О факультете</a>
          <a href="#events">Новости</a>
        </div>

        <div className={styles.footerColumn}>
          <strong>Поступление</strong>
          <a href="#programs">Абитуриентам</a>
          <a href="/schoolchildren">Школьникам</a>
        </div>

        <div className={styles.footerColumn}>
          <strong>Деканат</strong>
          <a href="tel:+74732208460">+7 (473) 220-84-60</a>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>

      <div className={styles.copyright}>
        <span>© 2026 Математический факультет ВГУ</span>
        <span>Воронеж, Университетская площадь, 1</span>
        <a href="https://vsu.ru" target="_blank" rel="noreferrer">Официальный сайт ВГУ ↗</a>
      </div>
    </footer>
  );
}
