import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { degreePages } from "@/lib/internalPages";
export const metadata: Metadata = { title: degreePages.spo.title + " | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={degreePages.spo}/>; }
