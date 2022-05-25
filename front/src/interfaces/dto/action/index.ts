import { User } from "../user";

export namespace Action {
  export interface Dto {
    _id: string,
    type: string,
    message: string,
    owner: User.Dto,
    createdAt: Date
  } 
  export enum Props {
    owner = 'owner',
    message = 'message',
    createdAt = 'createdAt',
  }
}