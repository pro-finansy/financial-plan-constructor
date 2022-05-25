import { Request, Response } from "express";

import courseModel from "./course.model";
import userModel from "../user/user.model";

import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { ROLES, STATUSES } from '../../utils/enums';

import constants from './course.constants';

export const get = async function (_req: Request, res: Response) {
  try {
    const user = await userModel.findById(res.locals.user._id).lean();
    const data = await courseModel.find({tag: { $in: user.accesses }}).lean();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const list = async function (_req: Request, res: Response) {
  try {
    const data = await courseModel.find().select('name _id streamDates').lean();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const addStreamDate = async function (req: Request, res: Response) {
  try {
    const course = await courseModel.findById(req.body.course_id);
    if (!course) return response(res, STATUSES.NOT_FOUND, false, constants.COURSE_NOT_FOUND);
    const streamArray: Array<string> = req.body.streamDate.split('.');
    if (streamArray.length !== 3 || +streamArray[0] > 31 || +streamArray[0] < 1 || +streamArray[1] > 12 || +streamArray[1] < 1 || +streamArray[2] > 2030 || +streamArray[2] < 2021) {
      return response(res, STATUSES.CONFLICT, false, constants.INVALID_DATE);
    }
    course.streamDates = [...course.streamDates, req.body.streamDate];
    course.markModified('streamDates');
    await course.save();
    response(res, STATUSES.OK, true, constants.STREAM_ADDED);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const patch = async function (req: Request, res: Response) {
  try {
    if (req.body.accesses && !req.body.course_id) return response(res, STATUSES.CONFLICT, false, constants.SELECT_ERROR);
    const user = await userModel.findById(res.locals.user._id);
    if (!user) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (user.role !== ROLES.EXPERT && !user.courses) return response(res, STATUSES.FORBIDDEN, false, constants.FORBIDDEN);

    user.course = req.body.course_id || req.body.course;
    await user.save();

    const data = await userModel.findById(res.locals.user._id)
      .populate('avatar')
      .populate('course').lean();

    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { get, list, patch, addStreamDate }