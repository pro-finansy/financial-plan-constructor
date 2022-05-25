import { NextFunction, Request, Response } from "express";

import constants from './constants';
import { ROLES, STATUSES } from '../utils/enums';
import { response } from "../utils/response";

export default (accessesExpert: boolean, ...roles: Array<keyof typeof ROLES>) => (_req: Request, res: Response, next: NextFunction) => {
  const check = accessesExpert ? !res.locals.user.accesses.includes(ROLES.EXPERT) : false;
  if (!roles.includes(res.locals.user.role) && check) return response(res, STATUSES.FORBIDDEN, false, constants.FORBIDDEN);
  next();
};