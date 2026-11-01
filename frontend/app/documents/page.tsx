import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { documentsPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Документы | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={documentsPage}/>; }
