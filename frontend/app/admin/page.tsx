import type { Metadata } from "next";
import { AdminPanel } from "./AdminPanel";

export const metadata: Metadata = {
  title: "Админ-панель | Матфак ВГУ",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
