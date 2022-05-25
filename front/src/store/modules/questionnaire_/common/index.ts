import { valueof } from "@/interfaces";
import { COURSES_ENUM } from "@/utils/enums";

const typesInsurance = [
  {id: 1, name: 'РСЖ'},
  {id: 2, name: 'НСЖ'},
  {id: 3, name: 'ИСЖ'},
  {id: 4, name: 'ДМС'},
  {id: 5, name: 'Unit Linked'},
  {id: 6, name: 'Прочее'},
]

const targetTypes = [
  { _id: 1, name: 'Накопление суммы к сроку' },
  { _id: 2, name: 'Пассивный доход' },
];
const studentTypes = [
  { _id: 1, name: 'Да' },
  { _id: 2, name: 'Нет' },
  { _id: 3, name: 'Нерезидент РФ' },
];
const countries = [
  { _id: 'USA', name: 'США' },
  { _id: 'RUS', name: 'Россия' },
  { _id: 'KAZ', name: 'Казахстан' },
  { _id: 'ATR', name: 'Азиатско-тихоокеанский регион' },
  { _id: 'BLG', name: 'Болгария' },
  { _id: 'BEL', name: 'Беларусь' },
  { _id: 'BRA', name: 'Бразилия' },
  { _id: 'GBR', name: 'Великобритания' },
  { _id: 'DEU', name: 'Германия' },
  { _id: 'GRC', name: 'Греция' },
  { _id: 'DNK', name: 'Дания' },
  { _id: 'IND', name: 'Индия' },
  { _id: 'ESP', name: 'Испания' },
  { _id: 'ITA', name: 'Италия' },
  { _id: 'CAN', name: 'Канада' },
  { _id: 'CHN', name: 'Китай' },
  { _id: 'LVA', name: 'Латвия' },
  { _id: 'LTU', name: 'Литва' },
  { _id: 'NLD', name: 'Нидерланды' },
  { _id: 'ARE', name: 'ОАЭ' },
  { _id: 'POL', name: 'Польша' },
  { _id: 'SVK', name: 'Словакия' },
  { _id: 'TUR', name: 'Турция' },
  { _id: 'UKR', name: 'Украина' },
  { _id: 'FIN', name: 'Финляндия' },
  { _id: 'FRA', name: 'Франция' },
  { _id: 'CZE', name: 'Чехия' },
  { _id: 'CHE', name: 'Швейцария' },
  { _id: 'SWE', name: 'Швеция' },
  { _id: 'EST', name: 'Эстония' },
  { _id: 'JPN', name: 'Япония' },
  { _id: 'OTH', name: 'Другая' },
];
const instrumentCountries = [
  { _id: 'GLB', name: 'Глобальный рынок' }, 
  { _id: 'GLBNU', name: 'Глобальный рынок без США' }, 
  { _id: 'RUS', name: 'Россия' },
  { _id: 'EUS', name: 'Европа' },
  { _id: 'USA', name: 'США' },
  { _id: 'KAZ', name: 'Казахстан' },
  { _id: 'ATR', name: 'Азиатско-тихоокеанский регион' },
  { _id: 'AZZ', name: 'Азия' },
  { _id: 'BLG', name: 'Болгария' },
  { _id: 'BRA', name: 'Бразилия' },
  { _id: 'GBR', name: 'Великобритания' },
  { _id: 'DEU', name: 'Германия' },
  { _id: 'GRC', name: 'Греция' },
  { _id: 'DNK', name: 'Дания' },
  { _id: 'IND', name: 'Индия' },
  { _id: 'ESP', name: 'Испания' },
  { _id: 'ITA', name: 'Италия' },
  { _id: 'CAN', name: 'Канада' },
  { _id: 'CHN', name: 'Китай' },
  { _id: 'LVA', name: 'Латвия' },
  { _id: 'LTU', name: 'Литва' },
  { _id: 'NLD', name: 'Нидерланды' },
  { _id: 'ARE', name: 'ОАЭ' },
  { _id: 'POL', name: 'Польша' },
  { _id: 'RC', name: 'Развитые страны' }, 
  { _id: 'RCNUSA', name: 'Развитые страны, кроме США' }, 
  { _id: 'RCC', name: 'Развивающиеся страны' },
  { _id: 'SVK', name: 'Словакия' },
  { _id: 'TUR', name: 'Турция' },
  { _id: 'UKR', name: 'Украина' },
  { _id: 'FIN', name: 'Финляндия' },
  { _id: 'FRA', name: 'Франция' },
  { _id: 'CZE', name: 'Чехия' },
  { _id: 'CHE', name: 'Швейцария' },
  { _id: 'SWE', name: 'Швеция' },
  { _id: 'EST', name: 'Эстония' },
  { _id: 'JPN', name: 'Япония' },
  { _id: 'OTH', name: 'Другая' },
];

const currenciesTwo = [
  { _id: 'RUB', name: 'Рубль', sign: '₽' },
  { _id: 'UAH', name: 'Гривна', sign: '₴' },
  { _id: 'KZT', name: 'Тенге', sign: '₸' },
];

const duration = [
  { _id: 'MONTH', name: 'месяцев' },
  { _id: 'YEAR', name: 'лет' },
];

const periods = [
  { _id: 'NOT_PERIOD', name: 'Без пополнений' },
  { _id: 'MONTHLY', name: 'Ежемесячно' },
  { _id: 'QUARTERLY', name: 'Ежеквартально' },
  { _id: 'SEMIANNUALLY', name: 'Раз в полгода' },
  { _id: 'ANNUALLY', name: 'Ежегодно' },
];

const portfolios = [
  { _id: 'careful', name: 'Осторожный' },
  { _id: 'conservative', name: 'Консервативный' },
  { _id: 'moderate', name: 'Умеренный' },
  { _id: 'aggressive', name: 'Агрессивный' },
  { _id: 'stocks', name: 'Акции 100%' },
];

const classes = (course: valueof<COURSES_ENUM>) => {
  const one = [
    { _id: 'stock', name: 'Акция' },
    { _id: 'bond', name: 'Облигация' },
    { _id: 'alternative', name: 'Альтернативные инвестиции' },
  ];
  const two = [
    { _id: 'stock', name: 'Рисковая часть' },
    { _id: 'bond', name: 'Консервативная часть' },
    { _id: 'alternative', name: 'Защитная часть' },
  ];
  return course === COURSES_ENUM.ONE ? one : two;
};

const sectionTwo = [
  {_id: '13', name: 'Другое'},
  {_id: '5', name: 'Золотодобытчики'},
  {_id: '14', name: 'Здравоохранение и биотехнологии'},
  {_id: '11', name: 'IT'},
  {_id: '4', name: 'Металлургический'},
  {_id: '1', name: 'Нефтегазовый'},
  {_id: '9', name: 'Потребительский'},
  {_id: '12', name: 'Смешанная стратегия'},
  {_id: '8', name: 'Строительный'},
  {_id: '6', name: 'Телекоммуникационный'},
  {_id: '10', name: 'Транспортный'},
  {_id: '3', name: 'Финансовый'},
  {_id: '7', name: 'Химический'},
  {_id: '2', name: 'Электроэнергетика'},
];

const sectionTwoAlternative = [
  { _id: '3', name: 'Другое' },
  { _id: '1', name: 'Металлы' },
  { _id: '2', name: 'Недвижимость' },
]

const sectionStock = [
  { _id: '1', name: 'Смешанная стратегия' },
  { _id: '2', name: 'Финансы' },
  { _id: '3', name: 'Нефтегазовый' },
  { _id: '4', name: 'Технологии (IT)' },
  { _id: '5', name: 'Недвижимость' },
  { _id: '6', name: 'Металлы и добыча' },
  { _id: '7', name: 'Потребительский длительного использования' },
  { _id: '8', name: 'Потребительский ежедневного использования' },
  { _id: '9', name: 'Электроэнергетика' },
  { _id: '10', name: 'Промышленный' },
  { _id: '11', name: 'Здравоохранение и биотех' },
  { _id: '12', name: 'Медиа и телекоммуникация' },
  { _id: '13', name: 'Коммунальные услуги' },
  { _id: '14', name: 'Другое' },
];

const sectionBond = [
  { _id: '0', name: 'Валюта' },
  { _id: '1', name: 'Государственные (казначейские)' },
  { _id: '2', name: 'Государственные (казначейские) с защитой от инфляции' },
  { _id: '3', name: 'Корпоративные высокого рейтинга' },
  { _id: '4', name: 'Корпоративные среднего рейтинга' },
  { _id: '5', name: 'Корпоративные высокодоходные' },
  { _id: '6', name: 'Другое' },
];

const sectionAlternative = [
  { _id: '1', name: 'Металлы' },
  { _id: '2', name: 'Недвижимость' },
  { _id: '3', name: 'Другое' },
];

const instrumentTypes = (course: valueof<COURSES_ENUM>) => {
  const one = [
    { _id: '1', name: 'Акции' },
    { _id: '2', name: 'Облигации' },
    { _id: '3', name: 'Фонды акций' },
    { _id: '4', name: 'Фонды облигаций' },
    { _id: '5', name: 'Фонд смешанных инвестиций' },
    { _id: '6', name: 'Фонд денежного рынка' },
    { _id: '7', name: 'Деньги' },
    { _id: '8', name: 'Фонды недвижимости' },
    { _id: '9', name: 'Товарные фонды' },
    { _id: '10', name: 'Криптовалюта' },
    { _id: '11', name: 'Фонд на криптовалюту' },
  ];
  const two = [
    { _id: '7', name: 'Акции' },
    { _id: '11', name: 'Альтернативные инвестиции' },
    { _id: '14', name: 'Биржевые ноты' },
    { _id: '2', name: 'Валютные счета' },
    { _id: '5', name: 'ВДО' },
    { _id: '1', name: 'Вклады' },
    { _id: '3', name: 'Деньги' },
    { _id: '6', name: 'ETF и БПИФ  на облигации' },
    { _id: '10', name: 'ETF и БПИФ на акции широкого рынка (не отраслевые)' },
    { _id: '13', name: 'Криптовалюта' },
    { _id: '4', name: 'Надёжные облигации' },
    { _id: '8', name: 'Облигации' },
    { _id: '9', name: 'Отраслевые ETF и БПИФ' },
    { _id: '12', name: 'Фонды смешанных активов' },
  ];
  return course === COURSES_ENUM.ONE ? one : two;
}

export { typesInsurance, instrumentCountries, sectionTwoAlternative, currenciesTwo, classes, sectionTwo, portfolios, targetTypes, studentTypes, countries, duration, periods, sectionStock, sectionBond, sectionAlternative, instrumentTypes };