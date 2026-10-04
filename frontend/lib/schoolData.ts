export const schoolRegistrationUrl = "https://forms.yandex.ru/u/6a99309895add539672d9c3f";
export const schoolContactEmail = "kiseleva@math.vsu.ru";

export const schoolLessonTimes = [
  { group: "6–8 классы", time: "10:00–11:20" },
  { group: "5 класс", time: "14:00–15:00" },
  { group: "9–11 классы", time: "15:10–16:30" },
];

export type ResultStage = "qualifying" | "final";

export type ResultArchiveFile = {
  year: number;
  stage: ResultStage;
  title: string;
  fileName: string;
  href: string;
  format: "PDF" | "DOCX";
  description: string;
};

export const resultsArchive: ResultArchiveFile[] = [
  {
    year: 2026,
    stage: "qualifying",
    title: "Итоги 1 тура и список прошедших в заключительный тур",
    fileName: "Итоги 1 тура Региональной олимпиады ВГУ.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/Итоги_1_тура_Региональной_олимпиады_ВГУ_по_математике_для_учащихся-1.pdf",
    format: "PDF",
    description: "Файл, на который ссылается публикация со списками участников, прошедших в заключительный тур Олимпиады 2026.",
  },

  {
    year: 2025,
    stage: "qualifying",
    title: "Итоги 1 тура Региональной олимпиады ВГУ",
    fileName: "Итоги 1 тура Региональной олимпиады ВГУ.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/02/Итоги_1_тура_Региональной_олимпиады_ВГУ_по_математике_для_учащихся-1.pdf",
    format: "PDF",
    description: "Результаты отборочного этапа и список участников, прошедших дальше.",
  },
  {
    year: 2025,
    stage: "final",
    title: "Предварительные итоги очного тура",
    fileName: "Предварительные итоги — очный тур 2025.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/03/Предварительные-итоги-очный-тур-2025-год.pdf",
    format: "PDF",
    description: "Предварительные баллы заключительного (очного) тура 2025 года.",
  },
  {
    year: 2025,
    stage: "final",
    title: "Окончательные итоги: победители и призёры",
    fileName: "Окончательные итоги заключительного тура 2025.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/03/Подведены_окончательные_итоги_заключительного_тура_Региональной.pdf",
    format: "PDF",
    description: "Списки участников, занявших призовые места, и участников, награждённых грамотами.",
  },
  {
    year: 2025,
    stage: "final",
    title: "Результаты рассмотрения апелляций",
    fileName: "Результаты апелляций заключительного тура 2025.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2025/03/Результаты_рассмотрения_апелляций_участников_заключительного_тура.pdf",
    format: "PDF",
    description: "Результаты рассмотрения апелляций участников заключительного тура.",
  },

  {
    year: 2024,
    stage: "qualifying",
    title: "Итоги 1 тура Региональной олимпиады ВГУ",
    fileName: "Итоги 1 тура Региональной олимпиады ВГУ 2024.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/02/Итоги_1_тура_Региональной_олимпиады_ВГУ_по_математике_для_учащихся.pdf",
    format: "PDF",
    description: "Результаты отборочного этапа 2024 года.",
  },
  {
    year: 2024,
    stage: "final",
    title: "Итоги заключительного тура",
    fileName: "Итоги заключительного тура 2024.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/03/Итоги-заключительного-тура-2024.pdf",
    format: "PDF",
    description: "Результаты заключительного (очного) тура 2024 года.",
  },
  {
    year: 2024,
    stage: "final",
    title: "Результаты рассмотрения апелляций",
    fileName: "Результаты апелляций заключительного тура 2024.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2024/03/Результаты_рассмотрения_апелляций_участников_заключительного_тура.pdf",
    format: "PDF",
    description: "Файл с итогами рассмотрения апелляций участников заключительного тура.",
  },

  {
    year: 2023,
    stage: "qualifying",
    title: "Список участников, прошедших в заключительный тур",
    fileName: "Список участников, прошедших в заключительный тур Олимпиады.docx",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/03/Список_участников_прошедших_в_Заключительный_тур_Олимпиады.docx",
    format: "DOCX",
    description: "Список участников, прошедших отборочный этап и допущенных к заключительному туру.",
  },
  {
    year: 2023,
    stage: "final",
    title: "Итоги заключительного тура",
    fileName: "Итоги заключительного тура 2023.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/03/Итоги-Заключительного-тура.pdf",
    format: "PDF",
    description: "Опубликованные итоги заключительного тура 2023 года.",
  },
  {
    year: 2023,
    stage: "final",
    title: "Окончательные итоги: призовые места и грамоты",
    fileName: "Окончательные итоги заключительного тура 2023.pdf",
    href: "https://math.vsu.ru/wp/wp-content/uploads/2023/04/Подведены_итоги_Заключительного_тура_Региональной_олимпиады_ВГУ.pdf",
    format: "PDF",
    description: "Списки участников, занявших призовые места, а также участников, награждённых грамотами.",
  },
];
