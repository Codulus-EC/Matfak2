import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { SchoolHero } from "@/components/SchoolHero";
import { SchoolContent } from "@/components/SchoolContent";
import { SchoolFaq } from "@/components/SchoolFaq";
import { SchoolContactFooter } from "@/components/SchoolContactFooter";

export const metadata: Metadata = { title: "Школьникам | Математический факультет ВГУ" };

export default function SchoolchildrenPage() {
  return <main className="school-page"><Header /><SchoolHero /><SchoolContent /><SchoolFaq /><SchoolContactFooter /></main>;
}
