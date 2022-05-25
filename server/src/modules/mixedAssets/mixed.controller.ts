import { Request, Response } from "express";
import { dynamicsObject } from "@/interfaces";

import mixedAssetModel from "./mixed.model";

import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { STATUSES } from "../../utils/enums";
import { definePagination } from "../../utils/defines";

import constants from './mixed.constants';
import { createAction } from "../actions/actions.controller";

export const onGetList = async (_req: Request, res: Response) => {
  try {
    const data = await mixedAssetModel.find().lean();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onGet = async (req: Request, res: Response) => {
  try {
    const filters = {};
    definePagination(filters, req.query);

    const query: dynamicsObject = { name: { $regex: req.query.search, $options: "i" } };

    const data = await mixedAssetModel.find(query, null, filters).lean();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function zeroVariables(body: dynamicsObject) {
  const vars = ['stock', 'bond', 'alternative'];
  for (const variable of vars) {
    if (!body[variable]) body[variable] = 0;
  }
}

export const onPost = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) return response(res, STATUSES.CONFLICT, false, constants.EMPTY_REQUEST);
    const candidate = await mixedAssetModel.findOne({ name: req.body.name });
    if (candidate) return response(res, STATUSES.CONFLICT, false, constants.EXIST_ASSET);
    delete req.body._id;
    zeroVariables(req.body);
    
    const asset = new mixedAssetModel(req.body);
    await asset.save();

    createAction(res.locals.user._id, `Добавление смешанного актива "${asset.name}"`, "ASSET_CREATED");
    response(res, STATUSES.OK, true, constants.CREATED_ASSET, asset);
  } catch (err: any) {
    console.log(err);
    
    errorHandler(res, err);
  }
};

export const onPatch = async (req: Request, res: Response) => {
  try {
    const candidate = await mixedAssetModel.findOne({ name: req.body.name });
    if (candidate && String(candidate._id) !== String(req.body._id)) return response(res, STATUSES.CONFLICT, false, constants.EXIST_ASSET);

    const asset = await mixedAssetModel.findById(req.body._id);
    if (!asset) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    zeroVariables(req.body);

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) asset[key] = req.body[key];
    }
    await asset.save();

    createAction(res.locals.user._id, `Редактирование смешанного актива "${asset.name}"`, "MIXED_EDITED");
    response(res, STATUSES.OK, true, constants.EDITED_ASSET, asset);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onDelete = async (req: Request, res: Response) => {
  try {
    const asset = await mixedAssetModel.findByIdAndDelete(req.params._id);
    createAction(res.locals.user._id, `Удаление смешанного актива "${asset.name}"`, "MIXED_DELETED");
    
    response(res, STATUSES.OK, true, constants.REMOVED_ASSET, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { onGetList, onGet, onPost, onPatch, onDelete };