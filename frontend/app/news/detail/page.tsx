import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ContactFooter } from "@/components/ContactFooter";
import { NewsDetail } from "./NewsDetail";

export const metadata: Metadata = {
  title: "Новость | Математический факультет ВГУ",
};

export default function NewsDetailPage() {
  return (
    <main>
      <Header />
      <Suspense fallback={null}>
        <NewsDetail />
      </Suspense>
      <ContactFooter />
    </main>
  );
}
