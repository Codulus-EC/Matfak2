import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { departmentsPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Кафедры | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={departmentsPage}/>; }
