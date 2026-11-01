import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { schedulePage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Расписание | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={schedulePage}/>; }
