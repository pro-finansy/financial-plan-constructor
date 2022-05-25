import { instrumentTypes, sectionAlternative, sectionBond, sectionStock, sectionTwo, sectionTwoAlternative } from "@/store/modules/questionnaire_/common";
import { COURSES_ENUM } from "@/utils/enums";

export const FIXING_PERCENT = `Мы немного изменили % актива из-за его лотности и цены`;
export const NOT_SELECTED_TARGET_CURRENCY = `Вам необходимо выбрать валюту Вашей цели!`;
export const CORE_TACTIC_ERROR = `Вам необходимо распределить ядро и тактику!`;
export const NOT_SELECTED_TARGET_FV = `Вам необходимо рассчитать сумму цели с учётом инфляции!`;
export const ERROR_ADDED_INSTRUMENT = (percents: string) => `Вы не можете внести такое количество инструментов, чтоб их сумма превышала сумму цели с учетом инфляции! Вы можете заполнить еще ${percents}% от суммы портфеля`;

export const INSTRUMENT_TYPES = [
  ...instrumentTypes(COURSES_ENUM.ONE),
  ...instrumentTypes(COURSES_ENUM.TWO),
];

export const INSTRUMENT_SECTIONS = [
  ...sectionTwo,
  ...sectionTwoAlternative,
  ...sectionStock,
  ...sectionBond,
  ...sectionAlternative,
]