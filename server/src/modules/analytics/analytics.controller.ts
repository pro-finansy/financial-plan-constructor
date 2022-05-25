import { Request, Response } from "express";
import { dynamicsObject } from "../../interfaces";

import courseElementModel from "../courseElement/courseElement.model";
import questionnaireModel from "../questionnaire/questionnaire.model";
import userModel from "../user/user.model";

import errorHandler from "../../utils/handler";
import { response } from "../../utils/response";
import { Socket } from "../../utils/socket";
import { ROLES, QUESTIONNAIRE_STATUSES, COURSES_STATUSES, STATUSES } from '../../utils/enums';

function unique(array: Array<dynamicsObject>) {
  let newArray = array.map(e => `${e.student}-${e.course}`);
  return Array.from(new Set(newArray)).length;
}

export const getExperts = async function (_req: Request, res: Response) {
  try {
    const date = new Date();
    const date2 = new Date();
    
    const filter = {
      completedAt: {
        $gte: new Date(date2.setDate(date2.getDate() - 30)),
        $lte: date
      }
    }

    let array: Array<dynamicsObject> = [];
    let empty: Array<dynamicsObject> = [];
    const experts = await userModel.find({role: ROLES.EXPERT}).lean();
    const questionnaires = await questionnaireModel.find({ ...filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }] }).select('seconds expert').lean();
    for (const expert of experts) {
      const q = questionnaires.filter(q => String(q.expert) === String(expert._id))
      const seconds = q.reduce((acc, t) => acc + t.seconds, 0);
      if (q.length === 0) {
        empty = [...empty, {
          expert: expert.name,
          minutes: 0
        }];
        continue;
      }
      array = [...array, {
        expert: expert.name,
        minutes: Number(((seconds / q.length) / 60).toFixed(0)),
      }];
    }
    array.sort((a, b) => {
      if (a.minutes > b.minutes) return 1;
      if (a.minutes < b.minutes) return -1;
      return 0;
    });
    array = [...array, ...empty];
    response(res, STATUSES.OK, true, null, array);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getAverage = async function (_req: Request, res: Response) {
  try {
    const query: dynamicsObject = {};
    if (res.locals.user.role === ROLES.EXPERT && !res.locals.user.accesses.includes(ROLES.EXPERT)) query.expert = res.locals.user._id;
    function getDates(month: number) {
      return {
        completedAt: {
          $gte: new Date(`2021-0${month}-01`),
          $lte: new Date(`2021-0${month}-30`)
        }
      }
    }

    const august_filter = getDates(6);
    const september_filter = getDates(9);
    const october_filter = getDates(10)
    const november_filter = getDates(11);
    const december_filter = getDates(12);
    
    const august = await questionnaireModel.find({...query, ...august_filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }] }).select('seconds').lean();
    const september = await questionnaireModel.find({...query, ...september_filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED } ] }).select('seconds').lean();
    const october = await questionnaireModel.find({...query, ...october_filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }] }).select('seconds').lean();
    const november = await questionnaireModel.find({...query, ...november_filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }] }).select('seconds').lean();
    const december = await questionnaireModel.find({...query, ...december_filter, $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }] }).select('seconds').lean();

    const august_seconds = august.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
    const september_seconds = september.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
    const october_seconds = october.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
    const november_seconds = november.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
    const december_seconds = december.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);

    response(res, STATUSES.OK, true, null, { 
      august: (((august_seconds / august.length) / 60) || 0).toFixed(0),
      september: (((september_seconds / september.length) / 60) || 0).toFixed(0),
      october: (((october_seconds / october.length) / 60) || 0).toFixed(0),
      november: (((november_seconds / november.length) / 60) || 0).toFixed(0),
      december: (((december_seconds / december.length) / 60) || 0).toFixed(0),
    })
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getCommon = async function (_req: Request, res: Response) {
  try {
    const questionnaires = await courseElementModel.countDocuments({ status: { $ne: COURSES_STATUSES.NOTSENT }, questionnaire: { $ne: undefined } });
    const studentsQuestionnaire = await questionnaireModel.find({ owner: ROLES.STUDENT }).select('student course').lean();
    const questionnairesLength = unique(studentsQuestionnaire);
    const students = await userModel.countDocuments({ role: ROLES.STUDENT });
    const online = Socket.online();

    const completedQuestionnaires = await questionnaireModel.countDocuments({ $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }], owner: ROLES.STUDENT });
    response(res, STATUSES.OK, true, null, { 
      questionnaires, 
      students, 
      online, 
      questionnairesLength, 
      completedQuestionnaires,
    });
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getCommonExpert = async function (_req: Request, res: Response) {
  try {
    const questionnaires = await courseElementModel.countDocuments({ status: { $ne: COURSES_STATUSES.NOTSENT }, questionnaire: { $ne: undefined }, expert: res.locals.user._id });
    const completedQuestionnaires = await questionnaireModel.countDocuments({ $or: [ { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.SENDED }], owner: ROLES.STUDENT, expert: res.locals.user._id });

    response(res, STATUSES.OK, true, null, { 
      questionnaires, 
      completedQuestionnaires,
    });
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { getExperts, getAverage, getCommon, getCommonExpert };