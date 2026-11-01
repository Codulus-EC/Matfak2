import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { applicantsPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Абитуриентам | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={applicantsPage}/>; }
