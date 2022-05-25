import { Request, Response } from "express";
import { dynamicsObject } from "@/interfaces";

import faqModel from './faq.model';

import errorHandler from "../../utils/handler";
import { STATUSES } from "../../utils/enums";
import { response } from "../../utils/response";

export const onGet = async function (req: Request, res: Response) {
  try {
    const query: dynamicsObject = { };
    if (req.query.search) query['$or'] = [{ question: { $regex: req.query.search, $options: "i" } }, { answer: { $regex: req.query.search, $options: "i" } }];

    const faq = await faqModel.find(query).lean();
    response(res, STATUSES.OK, true, null, faq);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onCreate = async (req: Request, res: Response) => {
  try {
    const faq = new faqModel(req.body);
    await faq.save();
    response(res, STATUSES.OK, true, null, faq);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onEdit = async (req: Request, res: Response) => {
  try {
    const faq = await faqModel.findById(req.body._id);

    faq.question = req.body.question;
    faq.answer = req.body.answer;
    await faq.save();

    response(res, STATUSES.OK, true, null, faq);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const onDelete = async (req: Request, res: Response) => {
  try {
    await faqModel.findByIdAndRemove(req.params._id);
    response(res, STATUSES.OK, true, null, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { onGet, onEdit, onDelete, onCreate };