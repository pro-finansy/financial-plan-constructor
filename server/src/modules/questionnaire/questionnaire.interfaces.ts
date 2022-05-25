import { dynamicsObject } from "../../interfaces/index";

// Enums
enum DURATIONS {
  "MONTH" = "MONTH",
  "YEAR" = "YEAR"
}

// Interfaces controllers
export interface QuestionnaireListQuery {
  [key: string]: any
}

export interface QuestionnaireListFilter {
  sort: {
    [key: string]: number
  },
  limit: number,
  skip: number
}

// Interfaces calculation
export interface chartFill {
  (resourses: Array<dynamicsObject>, term: number, period: number, month: number, profitability: number, targetCurrency: string, targetCurrencySign: string, getCurrectCurrency: Function, course: string, currentR: number): Array<dynamicsObject>
}

export interface FV {
  (income: string, type: number, term: number): string | number
}

export interface Term {
  term: number,
  duration: string,
  duration_id: keyof typeof DURATIONS
}

export interface currentTerm {
  (term: Term): number
}

export interface currentDate {
  (id: string): number
}