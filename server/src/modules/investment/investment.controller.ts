import { ObjectId } from 'mongodb';
import { Request, Response } from "express";
import { dynamicsObject, valueof } from "../../interfaces";

import investmentModel from "./investment.model";

import { fixTitleInstrument, getInstrumentPrice } from "../exchange/exchange.controller";
import { getCurrentExchangeRates } from "../questionnaire/templates/modules/common";

import errorHandler from "../../utils/handler";
import { COURSES, STATUSES } from "../../utils/enums";
import { definePagination } from '../../utils/defines';
import { response, getsResponse } from "../../utils/response";

import constants from './investment.constants';

export const get = async function (_req: Request, res: Response) {
  try {
    const investments = await investmentModel.find().lean();
    response(res, STATUSES.OK, true, null, investments);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const gets = async function (req: Request, res: Response) {
  try {
    const filters = {
      sort: { _id: -1 },
    };
    definePagination(filters, req.query);

    const query: dynamicsObject = { $or: [{ name: { $regex: req.query.name, $options: "i" } }, { title: { $regex: req.query.name, $options: "i" } }] };
    query['$and'] = [{}, {}];
    query['$and'][0][`currency_${req.query.course}_id`] = { $ne: '' };
    query['$and'][1][`currency_${req.query.course}_id`] = { $ne: undefined };
    
    const investments = await investmentModel.find(query, null, filters).lean();
    for (const instrument of investments) {
      instrument.commentLength = instrument.comments.length;
    }
    const total = await investmentModel.countDocuments(query);

    getsResponse(res, STATUSES.OK, true, null, investments, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function unique(array: Array<dynamicsObject>) {
  let result: Array<dynamicsObject> = [];
  array = array.reverse();
  for (const el of array) {
    if (!result.find(r => r.name.toLowerCase().trim() === el.name.toLowerCase().trim())) {
      result = [...result, el];
    }
  }
  return result.filter(r => r.name);
}

export const onPost = async function (list: Array<dynamicsObject>, expertList: Array<dynamicsObject>, expert: string | ObjectId, course: typeof COURSES[keyof typeof COURSES], res: Response) {
  try {
    const variables = constants.POST_VARIABLES(course);
    const instruments = await investmentModel.find({});
    const uniqueList = unique(list);
    const uniqueExpertList = unique(expertList);
    
    for (const instrument of uniqueList) {
      const { _id, comments, ...currentInstrument } = instrument;
      let candidate = instruments.find(i => i.name.trim().toLowerCase() === currentInstrument.name.trim().toLowerCase());
      if (candidate) {
        updateInstrumentComment(candidate, expert, list);
        candidate.markModified('comments');
        delete candidate._doc.__v;
        await candidate.save();
      }
    }
    
    let newInstruments: Array<dynamicsObject> = [];
    for (const instrument of uniqueExpertList) {
      const { _id, comments, ...currentInstrument } = instrument;
      let candidate = instruments.find(i => i.name.trim().toLowerCase() === currentInstrument.name.trim().toLowerCase());
      if (candidate) {
        if (!currentInstrument.expert) currentInstrument.expert = expert;
        if (!candidate.blocked) for (const key of variables) candidate[key] = currentInstrument[key];
        updateInstrumentComment(candidate, expert, expertList);
        candidate.markModified('comments');
        delete candidate._doc.__v;
        await candidate.save();
      } else {
        newInstruments = [...newInstruments, {...currentInstrument, expert, comments: [ { _id: new ObjectId(expert), comment: currentInstrument.comment } ]}];
      }
    }
    newInstruments = newInstruments.filter(i => i.name);
    await investmentModel.insertMany(newInstruments);
    console.log('save instruments');
    return;
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function updateInstrumentComment(candidate: dynamicsObject, expert: string | ObjectId, list: Array<dynamicsObject>) {
  const currentComment = list.find(i => i.name.toLowerCase().trim() === candidate.name.toLowerCase().trim() && i.comment);
  if (candidate && currentComment) {
    const existingComment = candidate.comments.find((c: dynamicsObject) => String(c._id) === String(expert));
    if (existingComment) existingComment.comment = currentComment.comment;
    else candidate.comments = [...candidate.comments, { _id: new ObjectId(expert), comment: currentComment.comment }];
  }
}

export const onUnique = async (_req: Request, res: Response) => {
  try {
    const instruments = await investmentModel.find().lean();
    let result: Array<dynamicsObject> = [];
    for (const instrument of instruments) {
      if (!result.find(r => r.name.toLowerCase().trim() === instrument.name.toLowerCase().trim())) {
        result = [...result, instrument];
      }
    }
    await investmentModel.deleteMany({});
    await investmentModel.insertMany(result);
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const actual = async (req: Request, res: Response) => {
  try {
    let rates = getCurrentExchangeRates();
    const instruments = await investmentModel.find().lean();
    for (const i of req.body.instruments) {
      const result = getInstrumentPrice(i.name);
      if (result) {
        if (i.currency_two_id !== result.currency) {
          let lot = i.lot || 1;
          i.price = Number(((result.price / rates[result.currency === 'SUR' ? 'RUB' : result.currency]) * rates[i.currency_two_id]).toFixed(2));
          i.formula = Number((i.price * lot * i.number_papers).toFixed(2));
        } else {
          i.price = result.price;
        }
      } else {
        const instrument = instruments.find(ins => i.name.trim().toLowerCase() === ins.name.trim().toLowerCase());
        if (instrument) {
          let lot = instrument.lot || 1;
          i.price = instrument.price;
          i.formula = Number((i.price * lot * i.number_papers).toFixed(2));
        }
      }
    }
    response(res, STATUSES.OK, true, constants.ACTUAL, req.body.instruments);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onToggleBlocked = async (req: Request, res: Response) => {
  try {
    await investmentModel.findByIdAndUpdate(req.params._id, { blocked: req.body.blocked });
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function getInstrumentCourseVariables(course: string) {
  return [
    `class_${course}`,
    `class_${course}_id`,
    `country_${course}`,
    `country_${course}_id`,
    `currency_${course}`,
    `currency_${course}_id`,
    `base_currency_${course}`,
    `base_currency_${course}_id`,
    `instrument_type_${course}`,
    `instrument_type_${course}_id`,
    `section_${course}`,
    `section_${course}_id`,
  ];
}

export const onCreate = async (req: Request, res: Response) => {
  try {
    const candidate = await investmentModel.findOne({ name: req.body.name.trim() });
    const course = req.body.course === COURSES.TWO ? COURSES.ONE : COURSES.TWO;    

    // if (candidate && candidate[`base_currency_${req.body.course}_id`]) return response(res, STATUSES.CONFLICT, false, constants.EXIST_INSTRUMENT);
    if (candidate && candidate[`base_currency_${course}_id`] && !candidate[`base_currency_${req.body.course}_id`]) {
      const variables = getInstrumentCourseVariables(req.body.course);
      for (const variable of variables) {
        candidate[variable] = req.body[variable];
      }
      await candidate.save();
      fixTitleInstrument(candidate);
      response(res, STATUSES.OK, true, null, candidate);
    } else {
      const instrument = new investmentModel(req.body);
      await instrument.save();
      fixTitleInstrument(instrument);
      response(res, STATUSES.OK, true, null, instrument);
    }
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const onEdit = async (req: Request, res: Response) => {
  try {
    const candidate = await investmentModel.findOne({ name: req.body.name.trim() });
    if (candidate && String(candidate._id) !== String(req.body._id)) return response(res, STATUSES.CONFLICT, false, constants.EXIST_INSTRUMENT);
    const course = req.body.course;
    const variables = constants.POST_VARIABLES(course);
    const instrument = await investmentModel.findById(req.body._id);
    
    if (!instrument) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    
    for (const variable of variables) instrument[variable] = req.body[variable];
    await instrument.save();
    fixTitleInstrument(instrument);

    response(res, STATUSES.OK, true, null, instrument);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const onDelete = async (req: Request, res: Response) => {
  try {
    const candidate = await investmentModel.findById(req.params._id);
    if (!candidate) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    const course = req.query.course === COURSES.ONE ? COURSES.TWO : COURSES.ONE;
    if (candidate[`base_currency_${course}_id`]) {
      const variables = getInstrumentCourseVariables((req.query.course as string))
      for (const variable of variables) {
        candidate[variable] = '';
      }
      await candidate.save();
    } else {
      await candidate.remove();
    }
    response(res, STATUSES.OK, true, null, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { get, gets, onPost, onUnique, onEdit, onDelete, onCreate, onToggleBlocked, actual };