export function TaskArchiveHero() {
  return (
    <section className="school-hero task-archive-hero" id="archive-top">
      <div className="school-hero__bg" />
      <div className="school-hero__shade" />
      <div className="school-hero__content">
        <div className="hero-kicker">МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ</div>
        <h1>АРХИВ ЗАДАЧ</h1>
        <p>Решения олимпиадных задач прошлых лет — от самых свежих материалов к более ранним.</p>
        <nav className="school-anchor-nav" aria-label="Навигация по архиву задач">
          <a href="/schoolchildren">← Школьникам</a><i>•</i>
          <a href="#year-2025">2025</a><i>•</i>
          <a href="#year-2024">2024</a><i>•</i>
          <a href="#year-2023">2023</a><i>•</i>
          <a href="#school-contacts">Контакты</a>
        </nav>
      </div>
    </section>
  );
}
