import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Математический факультет ВГУ",
  description: "Математический факультет Воронежского государственного университета",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
