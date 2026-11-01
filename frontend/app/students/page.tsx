import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { studentsPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Студентам | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={studentsPage}/>; }
