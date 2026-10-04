"use client";

import { useI18n } from "@/lib/i18n";

export function SchoolHero() {
  const { t } = useI18n();
  return (
    <section className="school-hero" id="school-top">
      <div className="school-hero__bg" />
      <div className="school-hero__shade" />
      <div className="school-hero__content">
        <div className="hero-kicker">{t.heroKicker}</div>
        <h1>{t.schoolTitle}</h1>
        <p>{t.schoolSubtitle}</p>
        <nav className="school-anchor-nav">
          <a href="#olympiad">{t.schoolNav[0]}</a><i>•</i>
          <a href="#olympiad-school">{t.schoolNav[1]}</a><i>•</i>
          <a href="#tasks">{t.schoolNav[2]}</a><i>•</i>
          <a href="#results">{t.schoolNav[3]}</a><i>•</i>
          <a href="#schedule">{t.schoolNav[4]}</a>
        </nav>
      </div>
    </section>
  );
}
