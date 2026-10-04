import Image from "next/image";
import { events } from "@/lib/data";

export function Achievements() {
  return (
    <section className="events-section" id="achievements">
      <div className="section-shell events-shell">
        <header><h2>ДОСТИЖЕНИЯ</h2><p>И СОБЫТИЯ</p></header>
        <div className="event-list">
          {events.map((event) => (
            <article className="event-card" key={event.title}>
              <Image src={event.image} alt="" fill sizes="(max-width: 900px) 100vw, 1400px" />
              <div className="event-overlay" />
              <div className="event-meta"><span>{event.kind}</span><time>{event.date}</time></div>
              <h3>{event.title}</h3>
              <span className="event-read-more">Подробнее →</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
