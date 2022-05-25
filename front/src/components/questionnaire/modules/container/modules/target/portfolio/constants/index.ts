import { Type } from "../interfaces";

export const TABLE_CORE_TYPES: Type[] = [
  {
    id: "stock",
    one_name: "Класс актива: Акции",
    two_name: "Рисковая часть",
    one_total: "Итого акций",
    two_total: "Итого рисковой части",
  },
  {
    id: "bond",
    one_name: "Класс актива: Облигации",
    two_name: "Консервативная часть",
    one_total: "Итого облигаций",
    two_total: "Итого консервативной части",
  },
  {
    id: "alternative",
    one_name: "Защита (Альтернатива)",
    two_name: "Защитная часть",
    one_total: "Итого защита",
    two_total: "Итого защитной части",
  },
];

export const TABLE_CORE_TYPE_MIXED: Type = {
  id: 'mixed',
  two_name: 'Смешанные фонды',
  two_total: "Итого смешанных фондов",
  one_total: '',
  one_name: ''
}

export const TABLE_BOND_SORT = ['Вклады', 'Валютные счета', 'Деньги', 'Надёжные облигации', 'Облигации', 'ВДО', 'ETF и БПИФ на облигации'];