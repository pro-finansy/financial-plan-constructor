import constants from './constants';
import { ROLES, STATUSES } from '../utils/enums';
import { response } from "../utils/response";
import { NextFunction, Request, Response } from 'express';

import questionnaireModel from '../modules/questionnaire/questionnaire.model';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questionnaire = await questionnaireModel.findById(req.params._id).lean();
    if (res.locals.user.role !== ROLES.OWNER && !res.locals.user.accesses.includes(ROLES.EXPERT) && String(questionnaire.expert) != String(res.locals.user._id) && String(questionnaire.student) != String(res.locals.user._id))
      return response(res, STATUSES.FORBIDDEN, false, constants.FORBIDDEN);
    next();
  } catch (e) {
    response(res, STATUSES.NOT_FOUND, false, constants.QUESTIONNAIRE_NOT_FOUND);
  }
};