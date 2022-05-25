import { Response } from "express";
import { STATUSES } from "./enums";

export = (res: Response, error: Error) => {
  res.status(STATUSES.SERVER).json(error.message ? error.message : error);
};