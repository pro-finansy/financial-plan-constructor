import { NextFunction, Request, Response } from "express";
import constants from './constants';
import { response } from "../utils/response";
import { STATUSES } from "../utils/enums";
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) return response(res, STATUSES.UNAUTHORIZED, false, constants.TOKEN_LIFETIME);
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_KEY || '');
    next();
  } catch (e) {
    response(res, STATUSES.UNAUTHORIZED, false, constants.TOKEN_LIFETIME);
  }
};