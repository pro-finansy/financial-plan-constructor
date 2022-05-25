import { User } from "@/modules/user/dto/user.dto";

export namespace Action {
  export interface Dto {
    type: string,
    message: string,
    owner: User.Dto,
    createdAt: Date
  } 
}