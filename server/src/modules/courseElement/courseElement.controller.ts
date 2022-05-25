import { Request, Response } from "express";

import courseElementModel from "./courseElement.model";
import courseModel from '../course/course.model';

import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { COURSES_STATUSES, COURSES, STATUSES } from '../../utils/enums';

export const get = async function (req: Request, res: Response) {
  try {
    const course = await courseModel.findOne({ type: req.query.course || COURSES.ONE });
    const data = await courseElementModel.find({ student: res.locals.user._id, status: COURSES_STATUSES.NOTSENT, course: course._id }).lean();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const streams = async function (_req: Request, res: Response) {
  try {
    const data = await courseElementModel.find().select('streamDate').lean();
    const array = Array.from(new Set(data.map(e => e.streamDate).filter(e => e))).map(e => ({ _id: e, name: e }));
    response(res, STATUSES.OK, true, null, array);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { get, streams }