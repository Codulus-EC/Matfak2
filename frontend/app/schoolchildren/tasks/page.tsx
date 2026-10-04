import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TaskArchiveHero } from "@/components/TaskArchiveHero";
import { TaskArchiveContent } from "@/components/TaskArchiveContent";
import { SchoolFaq } from "@/components/SchoolFaq";
import { SchoolContactFooter } from "@/components/SchoolContactFooter";

export const metadata: Metadata = {
  title: "Архив решённых задач | Математический факультет ВГУ",
  description: "Архив решений задач региональной олимпиады ВГУ по математике прошлых лет.",
};

export default function SolvedTasksArchivePage() {
  return (
    <main className="school-page task-archive-page">
      <Header />
      <TaskArchiveHero />
      <TaskArchiveContent />
      <SchoolFaq />
      <SchoolContactFooter />
    </main>
  );
}
