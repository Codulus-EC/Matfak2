import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ContactFooter } from "@/components/ContactFooter";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "О факультете | Математический факультет ВГУ",
  description:
    "История, наука, международная деятельность и карьерные возможности математического факультета ВГУ.",
};

const todayItems = [
  {
    number: "01",
    title: "Фундаментальная подготовка",
    text: "Математика и программирование как база для работы в IT, производстве, образовании, бизнесе, аналитике, финансах и управлении.",
  },
  {
    number: "02",
    title: "Практика и индустрия",
    text: "Широкая база практик в ведущих компаниях региона и связь обучения с реальными профессиональными задачами.",
  },
  {
    number: "03",
    title: "Традиции и технологии",
    text: "Сохранение традиций математического образования вместе с современными образовательными технологиями.",
  },
  {
    number: "04",
    title: "Научная школа",
    text: "Всемирно известная Воронежская математическая школа и возможность включаться в исследования уже с первых курсов.",
  },
  {
    number: "05",
    title: "Международное признание",
    text: "Диплом математического факультета ВГУ узнаваем за рубежом, а факультет поддерживает международные научные связи.",
  },
  {
    number: "06",
    title: "Студенческая среда",
    text: "Самоуправление, организационная работа, научная активность и насыщенная студенческая жизнь.",
  },
];


const departments = [
  {
    index: "01",
    title: "Кафедра уравнений в частных производных и теории вероятностей",
    text: "Выпускающая кафедра направления 01.03.01 «Математика» и профиля «Дифференциальные уравнения, динамические системы и оптимальное управление».",
    tag: "МАТЕМАТИКА",
  },
  {
    index: "02",
    title: "Кафедра функционального анализа и операторных уравнений",
    text: "Выпускающая кафедра программ по направлению «Математика и компьютерные науки», связанных с математическим и компьютерным моделированием.",
    tag: "МАТЕМАТИКА И КОМПЬЮТЕРНЫЕ НАУКИ",
  },
  {
    index: "03",
    title: "Кафедра математического моделирования",
    text: "В материалах факультета кафедра выступает выпускающей для прикладной математики и программ специалитета «Информационно-аналитические системы безопасности».",
    tag: "МОДЕЛИРОВАНИЕ · ИАСБ",
  },
  {
    index: "04",
    title: "Кафедра теории функций и геометрии",
    text: "Выпускающая кафедра специалитета 01.05.01 «Фундаментальные математика и механика» по программе современных методов теории функций.",
    tag: "ФУНДАМЕНТАЛЬНАЯ МАТЕМАТИКА",
  },
  {
    index: "05",
    title: "Кафедра алгебры и математических методов гидродинамики",
    text: "Выпускающая кафедра магистерской программы 01.04.01 «Математика» — «Математические модели гидродинамики».",
    tag: "ГИДРОДИНАМИКА",
  },
  {
    index: "06",
    title: "Кафедра математического анализа",
    text: "Выпускающая кафедра магистерской программы «Математические методы и компьютерные технологии в естествознании, экономике и управлении».",
    tag: "МАТЕМАТИЧЕСКИЙ АНАЛИЗ",
  },
];

const historyItems = [
  {
    year: "1918",
    title: "Начало истории",
    text: "В числе первых факультетов Воронежского государственного университета был открыт физико-математический факультет.",
  },
  {
    year: "1953–1954",
    title: "Формирование научной школы",
    text: "По приглашению профессора В. И. Соболева в Воронеж приехали М. А. Красносельский и С. Г. Крейн, ставшие основателями всемирно известной Воронежской математической школы.",
  },
  {
    year: "1969",
    title: "Математический факультет",
    text: "После разделения физико-математического факультета факультет получил современное название — математический.",
  },
  {
    year: "СЕГОДНЯ",
    title: "Традиция продолжается",
    text: "Ученики легендарных учёных и новые поколения исследователей продолжают научные традиции в российских и зарубежных университетах и научных центрах.",
  },
];

const scienceDirections = [
  {
    index: "01",
    title: "Дифференциальные уравнения",
    text: "Гидродинамика, краевые и начально-краевые задачи, бифуркационный анализ, колебательные процессы и математическая физика.",
  },
  {
    index: "02",
    title: "Функциональный анализ",
    text: "Банаховы пространства, теория операторов, многозначные отображения, дифференциальные включения и приложения к математической физике.",
  },
  {
    index: "03",
    title: "Математическое моделирование",
    text: "Задачи управления, численные методы, моделирование физических и информационных процессов, машинное обучение, экономика и финансовая математика.",
  },
];

const scienceBase = [
  {
    title: "Научно-исследовательский институт математики",
    href: "http://www.science.vsu.ru/niim",
  },
  {
    title: "Совместная лаборатория ВГУ и ИПУ РАН «Математическое моделирование сложных нелинейных процессов и структур»",
  },
  {
    title: "Лаборатория математической гидродинамики НИИ математики",
    href: "https://math.vsu.ru/mfdl/index.html",
  },
  {
    title: "Лаборатория «Моделирование и проектирование информационных и аналитических систем»",
  },
  {
    title: "Лаборатория технологий и программно-аппаратных средств обеспечения информационной безопасности",
  },
];

const countries = [
  "Австралия",
  "Вьетнам",
  "Германия",
  "Израиль",
  "Испания",
  "Казахстан",
  "Польша",
  "США",
  "Франция",
  "Тайвань",
];

const employers = [
  "Яндекс",
  "RedCollar",
  "Лига цифровой экономики",
  "Философия.ИТ",
  "Ситроникс Ай Ти",
  "Первый Бит",
  "НЛМК-ИТ",
  "Инобитек",
  "Информсвязь",
  "Сбер",
  "ДОМ.РФ",
  "Альфа-Банк",
  "ПСБ",
  "Концерн «Созвездие»",
  "КБ «Химавтоматика»",
];

const careers = [
  "программисты и IT-специалисты",
  "инженеры и инженеры-конструкторы",
  "аналитики данных и финансовые аналитики",
  "экономисты, бухгалтеры и актуарии",
  "управленцы и специалисты по проектной работе",
  "исследователи и научные сотрудники",
  "преподаватели школ и вузов",
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <Header />

      <section className={styles.hero} id="about-top">
        <div className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrid} aria-hidden="true" />

        <div className={styles.heroContent}>
          <span className={styles.kicker}>МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</span>
          <h1>О ФАКУЛЬТЕТЕ</h1>
          <p>
            Фундаментальная математика, программирование, наука и люди,
            которые продолжают традиции Воронежской математической школы.
          </p>

          <nav className={styles.anchorNav} aria-label="Навигация по странице">
            <a href="#today">Сегодня</a><i>•</i>
            <a href="#departments">Кафедры</a><i>•</i>
            <a href="#history">История</a><i>•</i>
            <a href="#science">Наука</a><i>•</i>
            <a href="#international">Международная деятельность</a><i>•</i>
            <a href="#career">Выпускники</a>
          </nav>
        </div>

        <div className={styles.heroStamp}>
          <strong>1918</strong>
          <span>начало истории</span>
        </div>
      </section>

      <section className={styles.today} id="today">
        <div className={styles.shell}>
          <header className={styles.sectionHeader}>
            <span>ФАКУЛЬТЕТ СЕГОДНЯ</span>
            <h2>Математика как основа для будущего</h2>
            <p>
              Факультет объединяет фундаментальную подготовку, программирование,
              научную работу и практику в компаниях — от первых курсов до профессиональной карьеры.
            </p>
          </header>

          <div className={styles.todayGrid}>
            {todayItems.map((item) => (
              <article className={styles.todayCard} key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.departments} id="departments">
        <div className={styles.shell}>
          <div className={styles.departmentsIntro}>
            <header className={styles.sectionHeader}>
              <span>КАФЕДРЫ</span>
              <h2>Научные школы внутри факультета</h2>
              <p>
                В материалах для нового сайта перечислены выпускающие кафедры,
                которые ведут подготовку по ключевым математическим, прикладным
                и информационно-аналитическим программам факультета.
              </p>
            </header>
            <div className={styles.departmentsCount}>06</div>
          </div>

          <div className={styles.departmentsGrid}>
            {departments.map((item) => (
              <article className={styles.departmentCard} key={item.index}>
                <div className={styles.departmentMeta}>
                  <span>{item.index}</span>
                  <small>{item.tag}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.history} id="history">
        <div className={styles.shell}>
          <div className={styles.historyIntro}>
            <div>
              <span className={styles.kickerDark}>ИСТОРИЯ</span>
              <h2>Больше века математической традиции</h2>
            </div>
            <p>
              История факультета начинается вместе с историей ВГУ. Через поколения преподавателей,
              исследователей и выпускников сформировалась сильная математическая школа,
              известная далеко за пределами Воронежа.
            </p>
          </div>

          <div className={styles.historyLayout}>
            <figure className={styles.historyPhoto}>
              <img
                src="/images/vsu-campus.jpg"
                alt="Главный корпус ВГУ"
              />
              <figcaption>Главный корпус ВГУ</figcaption>
            </figure>

            <div className={styles.timeline}>
              {historyItems.map((item) => (
                <article className={styles.timelineItem} key={item.year}>
                  <strong>{item.year}</strong>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.science} id="science">
        <div className={styles.shell}>
          <header className={`${styles.sectionHeader} ${styles.sectionHeaderLight}`}>
            <span>НАУЧНАЯ ДЕЯТЕЛЬНОСТЬ</span>
            <h2>Исследования, которые продолжают школу</h2>
            <p>
              На факультете развиваются фундаментальные и прикладные направления —
              от математической физики до машинного обучения и финансовой математики.
            </p>
          </header>

          <div className={styles.scienceGrid}>
            {scienceDirections.map((item) => (
              <article className={styles.scienceCard} key={item.index}>
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.resources}>
            <div className={styles.resourcesTitle}>
              <span>НАУЧНАЯ БАЗА</span>
              <h3>Институты и лаборатории</h3>
            </div>
            <div className={styles.resourceList}>
              {scienceBase.map((item, index) => (
                <div key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        title={`Перейти на сайт: ${item.title}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "baseline",
                          gap: "10px",
                        }}
                      >
                        {item.title}
                        <span
                          aria-hidden="true"
                          style={{
                            color: "#b9ced9",
                            fontSize: "14px",
                            fontWeight: 900,
                          }}
                        >
                          ↗
                        </span>
                      </a>
                    ) : (
                      item.title
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.international} id="international">
        <div className={styles.shell}>
          <div className={styles.internationalTop}>
            <header className={styles.sectionHeader}>
              <span>МЕЖДУНАРОДНАЯ ДЕЯТЕЛЬНОСТЬ</span>
              <h2>Наука без границ</h2>
              <p>
                Сотрудники факультета ведут совместные исследования и международные проекты,
                а студенты участвуют в программах академической мобильности.
              </p>
            </header>
            <div className={styles.bigNumber}>10</div>
          </div>

          <div className={styles.countryCloud}>
            {countries.map((country) => <span key={country}>{country}</span>)}
          </div>

          <div className={styles.internationalCards}>
            <article>
              <span>НАУЧНЫЕ ПАРТНЁРЫ</span>
              <h3>Совместные исследования</h3>
              <p>
                В материалах факультета перечислены научные связи с университетами Австралии,
                Испании, Польши, Израиля, США, Германии и Вьетнама.
              </p>
            </article>
            <article>
              <span>МОБИЛЬНОСТЬ</span>
              <h3>Учёба за рубежом</h3>
              <p>
                Студенты факультета участвовали в обменных программах в Тарту,
                Циндао и Люблине.
              </p>
            </article>
            <article>
              <span>МЕЖДУНАРОДНАЯ СРЕДА</span>
              <h3>Студенты из разных стран</h3>
              <p>
                На факультете обучаются иностранные студенты и аспиранты,
                в том числе из Эквадора, Чада, Сирии, Ирана, Ирака и Туркмении.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.career} id="career">
        <div className={styles.shell}>
          <header className={styles.careerTitle}>
            <span>ВЫПУСКНИКИ</span>
            <h2>От математики — в любую сложную профессию</h2>
          </header>

          <div className={styles.careerLayout}>
            <div className={styles.careerColumn}>
              <h3>Где работают</h3>
              <div className={styles.tags}>
                {employers.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className={styles.careerColumn}>
              <h3>Кем становятся</h3>
              <ol className={styles.careerList}>
                {careers.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ecosystem}>
        <div className={styles.shell}>
          <header className={styles.sectionHeader}>
            <span>НАУЧНАЯ ЭКОСИСТЕМА</span>
            <h2>Публикации, конференции, гранты</h2>
          </header>

          <div className={styles.ecosystemGrid}>
            <article>
              <span>01</span>
              <h3>«Вестник ВГУ»</h3>
              <p>Факультет совместно с физическим факультетом издаёт серию «Физика. Математика».</p>
            </article>
            <article>
              <span>02</span>
              <h3>Диссертационный совет</h3>
              <p>На факультете работает диссертационный совет по дифференциальным уравнениям и математической физике.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Математические школы</h3>
              <p>Ежегодные международные научные форумы объединяют российских и зарубежных исследователей.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Гранты и сотрудничество</h3>
              <p>Сотрудники участвуют в научных грантах и совместной работе с ведущими научными организациями.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span>ПРОДОЛЖИТЬ ЗНАКОМСТВО</span>
          <h2>Посмотрите направления подготовки</h2>
          <p>Программы бакалавриата, специалитета, магистратуры, аспирантуры и СПО — в разделе «Обучение».</p>
        </div>
        <div className={styles.ctaActions}>
          <a href="/applicants">Абитуриентам →</a>
          <a href="/contacts">Контакты →</a>
        </div>
      </section>

      <ContactFooter theme="about" />
    </main>
  );
}
