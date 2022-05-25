export const COMMENTS = [
  {
    id: 1,
    name: "Цель",
    sections: [
      { id: "target", name: "Комментарий по формированию цели" },
    ],
  },
  {
    id: 2,
    name: "Стартовый портфель",
    sections: [
      {
        id: "existing",
        name: "Комментарии эксперта на стартовый портфель",
      },
    ],
  },
  {
    id: 3,
    name: "Портфель студента",
    sections: [
      { id: "stock", name: "Обзор рисковой части" },
      { id: "bond", name: "Обзор консервативной части" },
      { id: "alternative", name: "Обзор защитной части" },
      { id: "tactic", name: "Тактические идеи" },
    ],
  },
  {
    id: 3,
    name: "Портфель эксперта",
    sections: [
      {
        id: "expert",
        name: "Комментарии эксперта на портфель",
      },
    ],
  },
  {
    id: 4,
    name: "Итоговый комментарий",
    sections: [{ id: "common", name: "Итоговый комментарий" }],
  },
]

export const PROFILE_INPUTS = [
  { id: 'name', placeholder: 'ФИО', name: 'ФИО', grid: '1 / 10', type: 'text', drop: false, error: false, required: false, show: true },
  { id: 'phone', placeholder: '+71234567890', name: 'Телефон', mask: '+############', grid: '1 / 10', type: 'phone', drop: false, error: false, required: false, show: true },
  { id: 'days', placeholder: 'Выберите даты работы в чате', datepicker: true, name: 'Даты работы в чате', grid: '1 / 10', type: 'text', drop: false, error: false, required: false, show: true },
  { id: 'times', placeholder: '00:00 - 00:00', name: 'Время работы в чате', mask: '##:## - ##:##', grid: '1 / 10', type: 'text', drop: false, error: false, required: false, show: true },
  { id: 'password', placeholder: 'Введите новый пароль', name: 'Пароль', grid: '1 / 10', type: 'password', drop: false, error: false, required: false, show: true },
  { id: 'reset_password', placeholder: 'Повторите пароль', name: 'Повторите пароль', grid: '1 / 10', type: 'password', drop: false, error: false, required: false, show: true },
]