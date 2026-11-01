import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import type { InternalPageData } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Контакты | Математический факультет ВГУ" };
const data: InternalPageData = {
  title: "КОНТАКТЫ",
  label: "МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ",
  description: "Все способы связаться с математическим факультетом и быстро найти главный корпус ВГУ.",
  theme: "green",
  heroLinks: [{label:"Карта",href:"#contacts"},{label:"Почта",href:"mailto:deanery@math.vsu.ru"}],
  sections: [],
};
export default function Page(){ return <InternalPage data={data} contacts/>; }
