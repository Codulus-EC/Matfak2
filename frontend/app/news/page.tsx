import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ContactFooter } from "@/components/ContactFooter";
import { QuestionsCallout } from "@/components/QuestionsCallout";
import { NewsArchive } from "./NewsArchive";

export const metadata: Metadata = {
  title: "Новости | Математический факультет ВГУ",
  description: "Архив новостей и событий математического факультета ВГУ.",
};

export default function NewsPage() {
  return (
    <main>
      <Header />
      <NewsArchive />
      <QuestionsCallout />
      <ContactFooter />
    </main>
  );
}
