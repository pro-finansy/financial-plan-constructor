import { dynamicsObject, valueof } from "@/interfaces";
import { ACCESSES, ROLES } from "@/utils/enums";

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
    name: string,
    email: string,
    role: valueof<typeof ROLES>,
    active: boolean,
    password: string | null,
    showChat: boolean,
    phone: string,
    accesses: Array<ACCESSES>,
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