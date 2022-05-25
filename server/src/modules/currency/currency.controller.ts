import { Request, Response } from "express";

import currencyModel from "./currency.model";

import constants from './currency.contants';
import errorHandler from "../../utils/handler";
import { getsResponse, response } from "../../utils/response";
import { STATUSES } from '../../utils/enums';
import { definePagination } from "../../utils/defines";
import { dynamicsObject } from "@/interfaces";
import { createAction } from "../actions/actions.controller";

export const onGet = async function (_req: Request, res: Response) {
  try {
    const currencies = await currencyModel.find().lean();
    response(res, STATUSES.OK, true, null, currencies);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onGets = async function (req: Request, res: Response) {
  try {
    const filters = {};
    definePagination(filters, req.query);
    const query: dynamicsObject = { $or: [{ name: { $regex: req.query.search, $options: "i" } }, { code: { $regex: req.query.search, $options: "i" } }] };

    const currencies = await currencyModel.find(query, null, filters).lean();
    const total = await currencyModel.countDocuments(query);

    getsResponse(res, STATUSES.OK, true, null, currencies, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onPost = async function (req: Request, res: Response) {
  try {
    const candidate = await currencyModel.findOne({ $or: [{ name: req.body.name }, { code: req.body.code }] });
    if (candidate) return response(res, STATUSES.CONFLICT, false, constants.EXISTING_CURRENCY);
    const currency = new currencyModel(req.body);
    await currency.save();

    createAction(res.locals.user._id, `Добавление валюты "${currency.name}"`, "CURRENCY_CREATED");
    response(res, STATUSES.OK, true, constants.CREATED, currency);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onPatch = async function (req: Request, res: Response) {
  try {
    const candidate = await currencyModel.findOne({ $or: [{ name: req.body.name }, { sign: req.body.sign }] });
    if (candidate && String(candidate._id) !== String(req.body._id)) return response(res, STATUSES.CONFLICT, false, constants.EXISTING_CURRENCY);

    const currency = await currencyModel.findById(req.body._id);
    if (!currency) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);

    for (const key in req.body) {
      currency[key] = req.body[key];
    }

    await currency.save();

    createAction(res.locals.user._id, `Редактирование валюты "${currency.name}"`, "CURRENCY_EDITED");
    response(res, STATUSES.OK, true, constants.EDITED, currency);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onDelete = async function (req: Request, res: Response) {
  try {
    const currency = await currencyModel.findByIdAndDelete(req.params._id);

    createAction(res.locals.user._id, `Удаление валюты "${currency.name}"`, "CURRENCY_DELETED");
    response(res, STATUSES.OK, true, constants.REMOVED, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { onGet, onGets, onPost, onPatch, onDelete }