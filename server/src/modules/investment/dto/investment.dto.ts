import { dynamicsObject } from "@/interfaces"
import { User } from "@/modules/user/dto/user.dto"

export namespace Investment {
  export interface Dto {
    title: string,
    name: string,
    lot: number,
    purchase_price: string,
    formula: string,

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
    expert: User.Dto
  }
}