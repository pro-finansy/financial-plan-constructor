import { dynamicsObject } from "../interfaces";

declare module 'express' {
  export interface Request {
    user?: any,
  }
}