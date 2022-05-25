import { COURSES_ENUM } from "@/utils/enums";
import { CommonDatas } from "./commonDatas.namespace";

export const ACCESSES: Array<CommonDatas.Accesses> = [
  { _id: 'HOMEWORK', name: 'Доступ к курсу "Капитал"' },
  { _id: 'INVESTMENT', name: 'Доступ к курсу "Я - Инвестор 2.0"' },
  { _id: 'EXPERT', name: 'Доступ к экспертам' },
];

export const ROLES = {
  OWNER: 'OWNER',
  EXPERT: 'EXPERT',
  SUPPORT: 'SUPPORT',
  STUDENT: 'STUDENT',
};

export const COURSES_TYPE = [
  { id: 'stock', one: 'Акции', two: 'Рисковая часть', comment: 'Обзор рисковой части' },
  { id: 'bond', one: 'Облигации', two: 'Консервативная часть', comment: 'Обзор консервативной части' },
  { id: 'alternative', one: 'Альтернативные инвестиции', two: 'Альтернативные инвестиции', comment: 'Обзор альтернативной части' },
]

export const QUESTIONNAIRE_STATUS: Array<CommonDatas.QuestionnaireStatuses> = [
  { _id: 'NOTSENT', name: 'Не отправлено' },
  { _id: 'NOTVERIFIED', name: 'Ожидает проверки' },
  { _id: 'PROCESS', name: 'Проверяется' },
  { _id: 'VERIFIED', name: 'Проверено' },
  { _id: 'SENDED', name: 'Отправлено студенту' },
  { _id: 'process', name: 'В процессе (*)' },
  { _id: 'ready', name: 'Готово (*)' },
];

export const COURSE_ELEMENT_STATUS: Array<CommonDatas.CourseElementStatuses> = [
  { _id: 'NOTSENT', name: 'Не создано / Не отправлено' },
  { _id: 'SENT', name: 'Ожидает проверки' },
  { _id: 'PROCESS', name: 'Проверяется / Проверено' },
  { _id: 'VERIFIED', name: 'Отправлено студенту' }
]

export const NAVIGATION = {
  OWNER: [
    { name: "Эксперты", link: "/experts" },
    { name: "Анкеты", link: "/questionnaires" },
    { name: "Студенты", link: "/expert/students" },
    { name: "Аналитика", link: "/analytics" },
  ],
  EXPERT: [
    { name: "Работы", link: "/expert/notverified" },
    { name: "В процессе", link: "/expert/process" },
    { name: "Готовые отчёты", link: "/expert/ready" },
    { name: "Студенты", link: "/expert/students" },
    { name: "Моя статистика", link: "/analytics" },
  ],
  STUDENT: [
    { name: 'Мои работы', link: "/student/works" }
  ],
  SUPPORT: [
    { name: "Студенты", link: "/expert/students" },
    { name: "Аналитика", link: "/analytics" },
  ]
}

export const HELP_LIST = [
  { id: COURSES_ENUM.ONE, optimal: [
    { id: 1, error: '', name: 'в ядре портфеля - 15', value: 0 },
    { id: 1, error: '', name: 'в тактике - от 5 до 7', value: 0 },
  ], max: [
    { id: 1, error: 'ядра', name: 'в ядре портфеля', rules: 'Ядро', value: 25 },
    { id: 2, error: 'тактики', name: 'в тактике', rules: 'Тактика', value: 10 },
  ] },
  { id: COURSES_ENUM.TWO, max: [
    { id: 1, error: 'надёжных облигаций', name: 'Надёжные облигации (государственные и муниципальные облигации регионов-доноров)', rules: 'Надёжные облигации', value: 5 },
    { id: 1, error: 'облигаций', name: 'Облигации (Корпоративные)', rules: 'Облигации', value: 5 },
    { id: 2, error: 'вдо', name: 'ВДО', rules: 'ВДО', value: 10 },
    { id: 3, error: 'фондов с облигациями', name: 'Фонды с облигациями', rules: 'ETF и БПИФ  на облигации', value: 4 },
    { id: 4, error: 'акций', name: 'Акции', rules: 'Акции', value: 25 },
    { id: 5, error: 'фондов с акциями', name: 'Фонды с акциями', rules: 'ETF и БПИФ на акции широкого рынка (не отраслевые)', value: 7 },
    { id: 6, error: 'защитных инструментов', name: 'Защитные инструменты', rules: 'Защита', value: 3 },
    { id: 7, error: 'тактических идей', name: 'Тактические идеи', rules: 'Тактика', value: 5 },
  ] }
]

export const FILTER_MAX_MIX = [
  { name: 'От мин. к макс.', _id: 1 },
  { name: 'От макс. к мин.', _id: -1 },
]

export const FILTER_FILE_PRESENT = [
  { _id: 'present', name: 'Есть' },
  { _id: 'absent', name: 'Отсутствует' },
]