import type { Metadata } from "next";
import { InternalPage } from "@/components/InternalPage";
import { departmentDetailPage } from "@/lib/internalPages";
export const metadata: Metadata = { title: "Кафедра | Математический факультет ВГУ" };
export default function Page(){ return <InternalPage data={departmentDetailPage}/>; }
