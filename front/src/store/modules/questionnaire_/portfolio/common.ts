import { dynamicsObject, valueof } from '@/interfaces';
import store from '@/store';
import { COURSES_ENUM, ROLES_ENUM } from '@/utils/enums';
import { classes, instrumentCountries, instrumentTypes, sectionTwo } from '../common/index';

const portfolioDistribution = {
  data: {
    core: '',
    tactic: '',
  },
  inputs: [
    { show: true, id: 'core', name: 'Ядро портфеля', placeholder: 'Процент ядра портфеля', type: 'number', drop: false, error: false, required: true },
    { show: true, id: 'tactic', name: 'Тактические идеи', placeholder: 'Процент тактических идей', type: 'number', drop: false, error: false, required: true },
  ]
}

const portfolioInstrument = {
  data: {
    name: '',
    price: '',
    number_papers: '',
    currency_one: '',
    currency_two: '',
    currency_one_id: '',
    currency_two_id: '',
    instrument_type_one: '',
    instrument_type_two: '',
    instrument_type_one_id: '',
    instrument_type_two_id: '',
    lot: '',
    base_currency_one: '',
    base_currency_two: '',
    base_currency_one_id: '',
    base_currency_two_id: '',
    class_one: '',
    class_two: '',
    class_one_id: '',
    class_two_id: '',
    section_one: '',
    section_two: '',
    section_one_id: '',
    section_two_id: '',
    comment: '',
    entryPoint: '',
    exitPoint: '',
    dublicateStudent: false,
    dublicateExpert: false,
    dublicateExisting: false,
  }
}

const twoInputs = [
  { show: true, id: 'entryPoint', name: 'Точка входа', placeholder: 'Введите точку входа', type: 'text', drop: false, error: false, required: false },
  { show: true, id: 'exitPoint', name: 'Точка выхода/условие выхода', placeholder: 'Введите точку выхода/условие выхода', type: 'text', drop: false, error: false, required: false },
]

const existingPortfolioInstrument = (course: valueof<COURSES_ENUM>, type: string, role: keyof typeof ROLES_ENUM, owner?: keyof typeof ROLES_ENUM): dynamicsObject => {
  const comment = role === ROLES_ENUM.STUDENT ? [
    { show: true, id: 'commentStudent', name: 'Комментарий для эксперта', placeholder: 'Комментарий для эксперта', type: 'textarea', drop: false, error: false, required: false },
  ] : [
    { show: true, id: 'comment', name: 'Комментарий эксперта', placeholder: 'Введите комментарий эксперта', type: 'textarea', drop: false, error: false, required: false },
  ];
  const formula = course === COURSES_ENUM.ONE ?
    { show: true, id: 'formula', name: 'Итого на инструмент', placeholder: 'Поле высчитывается автоматически', type: 'number', drop: false, formula: 'purchase_price * number_papers', error: false, required: true } :
    { show: true, id: 'formula', name: 'Текущая рыночная цена * Количество бумаг', placeholder: 'Поле высчитывается автоматически', type: 'number', drop: false, formula: 'price * number_papers', error: false, required: true }
  const additional = (type === 'tactic' && course === COURSES_ENUM.TWO ? twoInputs : []);
  const lot = course === COURSES_ENUM.ONE ? [] : [
    { show: true, id: 'lot', name: 'Лотность', placeholder: 'Введите лотность', formula_element: true, type: 'number', drop: false, error: false, required: true }
  ];
  return {
    data: {
      purchase_price: '',
      formula: '',
      ...portfolioInstrument.data,
    },
    inputs: [
      { show: true, id: 'name', name: 'Инструмент', placeholder: 'Введите инструмент', type: 'text', drop: true, error: false, required: true, uncheck: true },
      { show: true, id: 'purchase_price', name: 'Цена покупки', placeholder: 'Введите цену покупки', formula_element: true, type: 'number', drop: false, error: false, required: !(role === ROLES_ENUM.EXPERT && owner === ROLES_ENUM.STUDENT) },
      { show: true, id: 'price', name: 'Текущая цена', placeholder: 'Введите текущую цену', formula_element: true, type: 'number', drop: false, error: false, required: true },
      { show: true, id: 'number_papers', name: 'Количество бумаг', placeholder: 'Введите количество бумаг', formula_element: true, type: 'number', drop: false, error: false, required: true },
      ...lot,
      formula,
      { show: true, id: 'currency_' + course, name: 'Валюта покупки инструмента', placeholder: 'Выберите валюту покупки инструмента', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'base_currency_' + course, name: 'Базовая валюта для подсчета валютной диверсификации', placeholder: 'Выберите валюту для подсчета валютной диверсификации', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'instrument_type_' + course, name: 'Тип инструмента', placeholder: 'Выберите тип инструмента', type: 'drop', drop: true, showDrop: false, drop_data: instrumentTypes(course), error: false, required: true, uncheck: true },
      { show: true, id: 'class_' + course, name: 'Класс активов', placeholder: 'Выберите класс активов', type: 'drop', drop: true, showDrop: false, drop_data: classes(course), error: false, required: true },
      { show: true, id: 'country_' + course, name: 'Страна', placeholder: 'Выберите страну', type: 'drop', drop: true, showDrop: false, drop_data: instrumentCountries, error: false, required: true },
      { show: true, id: 'section_' + course, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', type: 'text', drop: !!(course === COURSES_ENUM.TWO), showDrop: false, drop_data: course === COURSES_ENUM.ONE ? [] : sectionTwo, error: false, required: false, uncheck: true },
      ...additional,
      ...comment,
    ]
  }
};

const studentPortfolioInstrument = (course: valueof<COURSES_ENUM>, type: string, role: keyof typeof ROLES_ENUM, owner?: keyof typeof ROLES_ENUM): dynamicsObject => {
  const comment = role === ROLES_ENUM.STUDENT ? [
    { show: true, id: 'commentStudent', name: 'Комментарий для эксперта', placeholder: 'Комментарий для эксперта', type: 'textarea', drop: false, error: false, required: false },
  ] : [
    { show: true, id: 'comment', name: 'Комментарий эксперта', placeholder: 'Введите комментарий эксперта', type: 'textarea', drop: false, error: false, required: false },
  ];
  const additional = (type === 'tactic' && course === COURSES_ENUM.TWO ? twoInputs : []);
  const lot = course === COURSES_ENUM.ONE ? [] : [
    { show: true, id: 'lot', name: 'Лотность', placeholder: 'Введите лотность', formula_element: true, type: 'number', drop: false, error: false, required: true }
  ];
  return {
    data: {
      percent: '',
      ...portfolioInstrument.data,
    },
    inputs: [
      { show: true, id: 'name', name: 'Инструмент', placeholder: 'Введите инструмент', type: 'text', drop: true, error: false, required: true, uncheck: true },
      { show: true, id: 'price', name: 'Текущая цена', placeholder: 'Введите текущую цену', formula_element: true, type: 'number', drop: false, error: false, required: true },
      { show: true, id: 'number_papers', name: 'Количество бумаг', placeholder: 'Введите количество бумаг', formula_element: true, type: 'number', drop: false, error: false, required: true },
      ...lot,
      { show: true, id: 'formula', name: 'Итого на инструмент', placeholder: 'Поле высчитывается автоматически', type: 'number', drop: false, formula: 'price * number_papers', error: false, required: true },
      { show: true, id: 'currency_' + course, name: 'Валюта покупки инструмента', placeholder: 'Выберите валюту покупки инструмента', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'base_currency_' + course, name: 'Базовая валюта для подсчета валютной диверсификации', placeholder: 'Выберите валюту для подсчета валютной диверсификации', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'instrument_type_' + course, name: 'Тип инструмента', placeholder: 'Выберите тип инструмента', type: 'drop', drop: true, showDrop: false, drop_data: instrumentTypes(course), error: false, required: true, uncheck: true },
      { show: true, id: 'class_' + course, name: 'Класс активов', placeholder: 'Выберите класс активов', type: 'drop', drop: true, showDrop: false, drop_data: classes(course), error: false, required: true },
      { show: true, id: 'country_' + course, name: 'Страна', placeholder: 'Выберите страну', type: 'drop', drop: true, showDrop: false, drop_data: instrumentCountries, error: false, required: true },
      { show: true, id: 'section_' + course, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', type: 'text', drop: !!(course === 'two'), showDrop: false, drop_data: course === COURSES_ENUM.ONE ? [] : sectionTwo, error: false, required: false, uncheck: true },
      ...additional,
      ...comment,
    ]
  }
};

const expertPortfolioInstrument = (course: valueof<COURSES_ENUM>, type: string, role: keyof typeof ROLES_ENUM, owner?: keyof typeof ROLES_ENUM): dynamicsObject => {
  const comment = role === ROLES_ENUM.STUDENT ? [] : [
    { show: true, id: 'comment', name: 'Комментарий эксперта', placeholder: 'Введите комментарий эксперта', type: 'textarea', drop: false, error: false, required: false },
  ];
  const additional = (type === 'tactic' && course === COURSES_ENUM.TWO ? twoInputs : []);
  const lot = course === COURSES_ENUM.ONE ? [] : [
    { show: true, id: 'lot', name: 'Лотность', placeholder: 'Введите лотность', formula_element: true, type: 'number', drop: false, error: false, required: true }
  ];
  return {
    data: {
      percent: '',
      ...portfolioInstrument.data,
    },
    inputs: [
      { show: true, id: 'name', name: 'Инструмент', placeholder: 'Введите инструмент', type: 'text', drop: true, error: false, required: true, uncheck: true },
      { show: true, id: 'price', name: 'Рыночная цена', placeholder: 'Введите текущую рыночную цена', formula_element: true, type: 'number', drop: false, error: false, required: true },
      { show: true, id: 'percent', name: 'Процент от ядра', placeholder: 'Введите процент от ядра', portfolio: 'expert', type: 'number', drop: false, error: false, required: true },
      { show: true, id: 'number_papers', name: 'Количество ' + (course === COURSES_ENUM.ONE ? 'бумаг' : 'лотов'), placeholder: 'Введите количество бумаг', formula_element: true, type: 'number', drop: false, error: false, required: true },
      ...lot,
      { show: true, id: 'formula', name: 'Итого на инструмент', placeholder: 'Поле высчитатается автоматически', type: 'number', drop: false, formula: 'price * number_papers', error: false, required: true },
      { show: true, id: 'currency_' + course, name: 'Валюта покупки инструмента', placeholder: 'Выберите валюту покупки инструмента', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'base_currency_' + course, name: 'Базовая валюта для подсчета валютной диверсификации', placeholder: 'Выберите базовую валюту для подсчета валютной диверсификации', type: 'drop', drop: true, showDrop: false, drop_data: store?.getters?.currencyList, error: false, required: true },
      { show: true, id: 'instrument_type_' + course, name: 'Тип инструмента', placeholder: 'Выберите тип инструмента', type: 'drop', drop: true, showDrop: false, drop_data: instrumentTypes(course), error: false, required: true, uncheck: true },
      { show: true, id: 'class_' + course, name: 'Класс активов', placeholder: 'Выберите класс активов', type: 'drop', drop: true, showDrop: false, drop_data: classes(course), error: false, required: true },
      { show: true, id: 'country_' + course, name: 'Страна', placeholder: 'Выберите страну', type: 'drop', drop: true, showDrop: false, drop_data: instrumentCountries, error: false, required: true },
      { show: true, id: 'section_' + course, name: 'Сектор экономики', placeholder: 'Выберите сектор экономики', type: 'text', drop: !!(course === COURSES_ENUM.TWO), showDrop: false, drop_data: course === COURSES_ENUM.ONE ? [] : sectionTwo, error: false, required: false, uncheck: true },
      ...additional,
      ...comment,
    ]
  }
};

export { portfolioDistribution, portfolioInstrument, existingPortfolioInstrument, expertPortfolioInstrument, studentPortfolioInstrument };