import { dynamicsObject } from "@/interfaces"
import { User } from "../user";

export namespace Instrument {
  export interface Dto {
    title: string,
    name: string,
    lot: number,
    purchase_price: string,
    formula: number,
    number_papers: number,
    percent: number | string,

    instrument_type_one: string,
    instrument_type_two: string,

    class_one: string,
    class_two: string,
    class_one_id: string,
    class_two_id: string,

    country_one: string,
    country_two: string,
    country_one_id: string,
    country_two_id: string,

    currency_one: string,
    currency_two: string,
    currency_one_id: string,
    currency_two_id: string,

    base_currency_one: string,
    base_currency_two: string,
    base_currency_one_id: string,
    base_currency_two_id: string,

    section_one: string,
    section_two: string,

    price: number,
    blocked: boolean,
    entryPoint: string,
    exitPoint: string,
    commnets: Array<dynamicsObject>,
    expert: User.Dto | null,

    dublicateStudent: boolean,
    dublicateExpert: boolean,
    dublicateExisting: boolean,
    [key: string]: any
  }
  export interface Module {
    data: Dto
  }
  export interface Input {
    required: boolean,
    name: string,
    placeholder: string,
    id: string,
    grid: string,
    type: string,
    drop: boolean,
    dropBox?: boolean,
    showDrop?: boolean,
    drop_data: Array<dynamicsObject>,
    show?: boolean,
    error?: boolean,
    datepicker?: boolean
    formula_element?: string,
    mask?: string,
    unsearch?: boolean,
    uncheck?: boolean,
  }
}