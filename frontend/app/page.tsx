import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AdvantagesTicker } from "@/components/AdvantagesTicker";
import { WhyMatfac } from "@/components/WhyMatfac";
import { Programs } from "@/components/Programs";
import { Achievements } from "@/components/Achievements";
import { Faq } from "@/components/Faq";
import { ContactFooter } from "@/components/ContactFooter";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />

      {/* Плашки №1: между Hero и «Почему выбирают Мат фак?» */}
      <AdvantagesTicker />

      <WhyMatfac />

      {/* Плашки №2: между «Почему выбирают» и «Программами» */}
      <AdvantagesTicker showArrow />

      <Programs />
      <Achievements />

      {/* FAQ уже содержит блок «Остались вопросы?» */}
      <Faq />

      <ContactFooter />
    </main>
  );
}
