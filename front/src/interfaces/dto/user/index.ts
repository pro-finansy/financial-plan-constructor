import { dynamicsObject, valueof } from "@/interfaces";
import { ACCESSES_ENUM, ROLES_ENUM } from "@/utils/enums";

export namespace User {
  export interface UComments {
    target: string,
    expert: string,
    existing: string,
    student: string,
    stock: string,
    bond: string,
    alternative: string,
    tactic: string,
    common: string,
  }

  export interface Dto {
    _id: string,
    name: string,
    email: string,
    role: valueof<typeof ROLES_ENUM>,
    active: boolean,
    password: string | null,
    showChat: boolean,
    phone: string,
    accesses: Array<ACCESSES_ENUM>,
    times: string,
    days: string,
    dayLength: number,
    token: string | null,
    reset: string | null,
    courses: boolean,
    course: dynamicsObject,
    avatar: dynamicsObject,
    comments: UComments,
    
  } 
}