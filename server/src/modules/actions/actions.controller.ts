import { Request, Response } from 'express';

import { dynamicsObject } from '../../interfaces';

import actionsModel from "./actions.model";

import { ROLES, STATUSES } from '../../utils/enums';
import { getsResponse } from "../../utils/response";
import { definePagination } from '../../utils/defines';

export const createAction = async function (owner: string, message: string, type: string) {
  const action = new actionsModel({ owner, message, type });
  await action.save();
};

export const get = async function (req: Request, res: Response) {
  const filters = {
    sort: { createdAt: -1 }
  };

  definePagination(filters, req.query);

  const query: dynamicsObject = {};
  if (res.locals.user.role === ROLES.EXPERT && !res.locals.user.accesses.includes(ROLES.EXPERT)) query.owner = res.locals.user._id;
  if (req.query.search) query.message = { '$regex': req.query.search, '$options': 'i' };

  const actions = await actionsModel.find(query, null, filters).populate('owner');
  const total = await actionsModel.countDocuments(query);
  getsResponse(res, STATUSES.OK, true, null, actions, total);
};

export default { createAction, get };