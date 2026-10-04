"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "ru" | "en" | "de" | "fr" | "es" | "it" | "zh" | "ar";

type Dict = {
  nav: [string, string, string, string, string, string];
  deanery: string;
  heroKicker: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  apply: string;
  choose: string;
  schoolTitle: string;
  schoolSubtitle: string;
  schoolNav: [string, string, string, string, string];
};

const dictionaries: Record<Lang, Dict> = {
  ru: {
    nav: ["Обучение", "Абитуриентам", "Студентам", "Школьникам", "Новости", "О факультете"],
    deanery: "Деканат",
    heroKicker: "МАТЕМАТИЧЕСКИЙ ФАКУЛЬТЕТ ВГУ",
    heroTitleA: "Мат фак",
    heroTitleB: "это про жизнь",
    heroSubtitle: "Математика — это ключ к будущему!",
    apply: "Подать документы",
    choose: "Выбрать программу",
    schoolTitle: "ШКОЛЬНИКАМ",
    schoolSubtitle: "Олимпиады, подготовка, задачи прошлых лет и всё нужное — в одном месте.",
    schoolNav: ["Олимпиады", "Школа", "Задачи", "Результаты", "Расписание"],
  },
  en: {
    nav: ["Study", "Applicants", "Students", "Schoolchildren", "News", "About"],
    deanery: "Dean's office",
    heroKicker: "VSU FACULTY OF MATHEMATICS",
    heroTitleA: "Math faculty",
    heroTitleB: "is about life",
    heroSubtitle: "Mathematics is the key to the future!",
    apply: "Apply now",
    choose: "Choose a program",
    schoolTitle: "SCHOOLCHILDREN",
    schoolSubtitle: "Olympiads, preparation, past problems and everything you need in one place.",
    schoolNav: ["Olympiads", "School", "Problems", "Results", "Schedule"],
  },
  de: {
    nav: ["Studium", "Bewerber", "Studierende", "Schüler", "News", "Über uns"],
    deanery: "Dekanat",
    heroKicker: "FAKULTÄT FÜR MATHEMATIK DER VSU",
    heroTitleA: "Mathe-Fakultät",
    heroTitleB: "ist Leben",
    heroSubtitle: "Mathematik ist der Schlüssel zur Zukunft!",
    apply: "Bewerben",
    choose: "Programm wählen",
    schoolTitle: "FÜR SCHÜLER",
    schoolSubtitle: "Olympiaden, Vorbereitung, Aufgaben vergangener Jahre und alles Wichtige an einem Ort.",
    schoolNav: ["Olympiaden", "Schule", "Aufgaben", "Ergebnisse", "Zeitplan"],
  },
  fr: {
    nav: ["Études", "Candidats", "Étudiants", "Scolaires", "Actualités", "Faculté"],
    deanery: "Doyenné",
    heroKicker: "FACULTÉ DE MATHÉMATIQUES DE VSU",
    heroTitleA: "Fac de maths",
    heroTitleB: "c'est la vie",
    heroSubtitle: "Les mathématiques ouvrent l'avenir !",
    apply: "Candidater",
    choose: "Choisir un programme",
    schoolTitle: "SCOLAIRES",
    schoolSubtitle: "Olympiades, préparation, problèmes des années passées et tout le nécessaire au même endroit.",
    schoolNav: ["Olympiades", "École", "Problèmes", "Résultats", "Horaire"],
  },
  es: {
    nav: ["Estudios", "Aspirantes", "Estudiantes", "Escolares", "Noticias", "Facultad"],
    deanery: "Decanato",
    heroKicker: "FACULTAD DE MATEMÁTICAS DE VSU",
    heroTitleA: "Fac de mates",
    heroTitleB: "es vida",
    heroSubtitle: "¡Las matemáticas son la llave del futuro!",
    apply: "Solicitar",
    choose: "Elegir programa",
    schoolTitle: "ESCOLARES",
    schoolSubtitle: "Olimpiadas, preparación, problemas de años anteriores y todo lo necesario en un solo lugar.",
    schoolNav: ["Olimpiadas", "Escuela", "Problemas", "Resultados", "Horario"],
  },
  it: {
    nav: ["Studio", "Candidati", "Studenti", "Scuole", "Notizie", "Facoltà"],
    deanery: "Presidenza",
    heroKicker: "FACOLTÀ DI MATEMATICA VSU",
    heroTitleA: "Facoltà di mate",
    heroTitleB: "è vita",
    heroSubtitle: "La matematica è la chiave del futuro!",
    apply: "Candidati",
    choose: "Scegli programma",
    schoolTitle: "PER LE SCUOLE",
    schoolSubtitle: "Olimpiadi, preparazione, problemi degli anni passati e tutto ciò che serve in un unico posto.",
    schoolNav: ["Olimpiadi", "Scuola", "Problemi", "Risultati", "Orario"],
  },
  zh: {
    nav: ["学习", "申请者", "学生", "中学生", "新闻", "学院"],
    deanery: "院办",
    heroKicker: "沃罗涅日国立大学数学学院",
    heroTitleA: "数学学院",
    heroTitleB: "连接生活",
    heroSubtitle: "数学是通往未来的钥匙！",
    apply: "提交申请",
    choose: "选择专业",
    schoolTitle: "中学生",
    schoolSubtitle: "竞赛、备考、历年题目和所需信息，都在这里。",
    schoolNav: ["竞赛", "学校", "题目", "结果", "时间表"],
  },
  ar: {
    nav: ["الدراسة", "المتقدمون", "الطلاب", "طلاب المدارس", "الأخبار", "عن الكلية"],
    deanery: "العمادة",
    heroKicker: "كلية الرياضيات بجامعة فورونيج",
    heroTitleA: "كلية الرياضيات",
    heroTitleB: "هي الحياة",
    heroSubtitle: "الرياضيات مفتاح المستقبل!",
    apply: "التقديم",
    choose: "اختر البرنامج",
    schoolTitle: "لطلاب المدارس",
    schoolSubtitle: "الأولمبيادات والتحضير ومسائل السنوات السابقة وكل ما تحتاجه في مكان واحد.",
    schoolNav: ["الأولمبيادات", "المدرسة", "المسائل", "النتائج", "الجدول"],
  },
};

type I18nValue = { lang: Lang; setLang: (lang: Lang) => void; t: Dict };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("matfak-lang") as Lang | null;
    if (saved && dictionaries[saved]) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("matfak-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: dictionaries[lang] }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export const languageOptions: Array<{ code: Lang; label: string }> = [
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "AR" },
];
