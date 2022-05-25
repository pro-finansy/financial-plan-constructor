import { Response } from "express";
import { dynamicsObject } from "../interfaces";
import { STATUSES } from "./enums";


export const response = (res: Response, statusCode: typeof STATUSES[keyof typeof STATUSES], success: boolean, message: string | null, data: dynamicsObject | string | null = null) => {
  return res.status(statusCode).json({ success, message, data });
};

export const getsResponse = (res: Response, statusCode: typeof STATUSES[keyof typeof STATUSES], success: boolean, message: string | null, data: dynamicsObject | string | null = null, total: number = 0) => {
  return res.status(statusCode).json({ success, message, data, total });
};

export default { response, getsResponse }