import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { teachersPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Преподаватели | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={teachersPage}/>; }
