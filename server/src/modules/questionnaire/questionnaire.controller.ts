import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import fs from 'fs';

import { dynamicsObject } from '../../interfaces';
import { QuestionnaireListFilter, QuestionnaireListQuery } from './questionnaire.interfaces';
import { Mixed } from '../mixedAssets/dto/mixed.dto';

import questionnaireModel from "./questionnaire.model";
import mixedAssetModel from "../mixedAssets/mixed.model";
import userModel from "../user/user.model";
import fileModel from "../files/files.model";
import courseElementModel from "../courseElement/courseElement.model";

import { createStudentFile } from '../excel/excel.controller';
import { createAction } from '../actions/actions.controller';
import { fillMatDate } from '../exchange/exchange.controller';
import { onPost as investmentPost } from "../investment/investment.controller";

import sendEmail from '../email';
import dateFilter from '../../utils/date.filter';
import { getsResponse, response } from "../../utils/response";
import { definePagination, defineSearchDates, defineSearchEmail } from '../../utils/defines';
import { FILES, ROLES, COURSES, QUESTIONNAIRE_STATUSES, QUESTIONNAIRE_VERSIONS, COURSES_STATUSES, STATUSES } from "../../utils/enums";
import { create } from '../../utils/password';
import errorHandler from "../../utils/handler";

import constants from './questionnaire.constants';
import beforeQuestionnaire from './modules/questionnaire.before';
import { createQuestionnairePDF } from './modules/questionnaire.pdf';
import { editContents, fillExpertContent } from './modules/questionnaire.content';
import { Questionnaire } from './dto/questionnaire.dto';

export const getQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel.findById(req.params._id)
      .populate("course")
      .populate({
        path: "expert",
        populate: {
          path: "avatar",
        },
      })
      .populate('files');
    if (res.locals.user.role === ROLES.EXPERT && !req.query.pivot && data.owner === ROLES.STUDENT && data.content_EXPERT) {
      if (data.status === QUESTIONNAIRE_STATUSES.NOTVERIFIED) {
        if (data.course.type === COURSES.ONE) {
          await beforeQuestionnaire.getCurrentPrices(data);
        }
        beforeQuestionnaire.getCurrentFV(data);
        beforeQuestionnaire.fixInstruments(data);
        await beforeQuestionnaire.collectionComments(data, res.locals.user._id);
        await beforeQuestionnaire.fillInstruments(data, res.locals.user._id);
        await data.save();
      }
      if (data.course.type === COURSES.TWO) {
        beforeQuestionnaire.getCurrentPercents(data);
      }
      if (data.course.type === COURSES.ONE) {
        // Временно
        beforeQuestionnaire.fixSections(data);
      }
      fillMatDate(data);
    }
    if (data.status === QUESTIONNAIRE_STATUSES.NOTVERIFIED && res.locals.user.role === ROLES.EXPERT && !req.query.pivot) {
      data.status = QUESTIONNAIRE_STATUSES.PROCESS;
      await courseElementModel.findOneAndUpdate({ questionnaire: req.params._id }, { status: QUESTIONNAIRE_STATUSES.PROCESS });
    }
    if (!data)
      return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    await data.save()
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getPaginationQuestionnaires = async function (req: Request, res: Response) {
  try {
    const filters = { sort: { createdAt: -1 } };
    const query: QuestionnaireListQuery = { prevExpert: undefined };
    const queryVariables = ['expert', 'course', 'status', 'streamDate'];

    defineSearchEmail(query, String(req.query.search));
    definePagination(filters, req.query);
    defineSearchDates(req.query, query, ['completedAt', 'sentedAt']);

    for (const variable of queryVariables) {
      if (req.query[variable]) query[variable] = req.query[variable];
    }

    let data = await questionnaireModel.find(query, {}, filters)
      .populate("expert")
      .populate("course")
      .populate("student")
      .select("completedAt sentedAt createdAt student date expert prevExpert seconds status course streamDate studentEmail _id content_EXPERT.student")
      .lean()
      .allowDiskUse(true);

    const total = await questionnaireModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getPaginationQuestionnairesArchive = async function (req: Request, res: Response) {
  try {
    const filters = { sort: { createdAt: -1 } };
    const query: QuestionnaireListQuery = { prevExpert: { $ne: undefined } };
    const queryVariables = ['course', 'status', 'streamDate'];

    defineSearchEmail(query, String(req.query.search));
    defineSearchDates(req.query, query, ['completedAt']);
    definePagination(filters, req.query);

    for (const variable of queryVariables) {
      if (req.query[variable]) query[variable] = req.query[variable];
    }
    
    let data = await questionnaireModel.find(query, {}, filters)
      .populate("expert")
      .populate("course")
      .populate("student")
      .select("completedAt createdAt student date expert prevExpert seconds status course streamDate studentEmail _id content_EXPERT.student")
      .lean()
      .allowDiskUse(true);

    const total = await questionnaireModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getExpertNotVerifiedQuestionnaires = async (req: Request, res: Response) => {
  try {
    const filters: QuestionnaireListFilter = { sort: { sentedAt: -1 }, limit: 10, skip: 0 };
    const query: QuestionnaireListQuery = {};

    if (req.query.targetLength) {
      delete filters.sort.sentedAt;
      filters.sort['targets'] = +req.query.targetLength;
    }
    if (req.query.civilServant) {
      query['content_STUDENT.student.data.module.data.role_id'] = +req.query.civilServant;
    }
    if (req.query.risk) {
      query['content_STUDENT.targets.data.type.sections.modules.data.portfolio_id'] = req.query.risk;
    }   

    defineSearchEmail(query, String(req.query.search));
    defineSearchDates(req.query, query, ['sentedAt']);
    definePagination(filters, req.query);

    if (req.query.streamDate) query.streamDate = req.query.streamDate;
    if (req.query.targetLength) filters.sort.targets = +req.query.targetLength;

    console.log(query);

    const data = await questionnaireModel.aggregate()
      .match({ expert: new ObjectId(req.params._id), status: QUESTIONNAIRE_STATUSES.NOTVERIFIED, ...query })
      .addFields({ targets: { $size: '$content_EXPERT.targets.data' } })
      .sort(filters.sort)
      .skip(filters.skip)
      .limit(filters.limit)
      .lookup({ from: 'users', localField: 'expert', foreignField: '_id', as: 'expert' })
      .lookup({ from: 'users', localField: 'student', foreignField: '_id', as: 'student' })
      .lookup({ from: 'courses', localField: 'course', foreignField: '_id', as: 'course' })
      .project({ 'content_EXPERT.student': 1, targets: 1, completedAt: 1, createdAt: 1, sentedAt: 1, streamDate: 1, date: 1, seconds: 1, status: 1, course: 1, studentEmail: 1, student: 1, owner: 1, expert: 1 })
      .unwind('$expert', '$course', '$student')

    const total = await questionnaireModel.countDocuments({
      expert: req.params._id,
      status: QUESTIONNAIRE_STATUSES.NOTVERIFIED,
      ...query,
    });
    
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getExpertProcessQuestionnaires = async (req: Request, res: Response) => {
  try {
    const filters: QuestionnaireListFilter = { sort: { sentedAt: 1 }, limit: 10, skip: 0 };
    const query: QuestionnaireListQuery = { expert: req.params._id, $or: [{ status: QUESTIONNAIRE_STATUSES.process }, { status: QUESTIONNAIRE_STATUSES.PROCESS }] };

    defineSearchEmail(query, String(req.query.search));
    defineSearchDates(req.query, query, ['sentedAt']);
    definePagination(filters, req.query);

    if (req.query.seconds) filters.sort.seconds = Number(req.query.seconds);

    let data = await questionnaireModel
      .find({...query }, null, filters)
      .populate("course")
      .populate("student")
      .select("completedAt createdAt sentedAt streamDate date expert seconds status course studentEmail content_EXPERT.student student owner")
      .lean();

    const total = await questionnaireModel.countDocuments({
      expert: req.params._id,
      $or: [{ status: QUESTIONNAIRE_STATUSES.process}, { status: QUESTIONNAIRE_STATUSES.PROCESS }],
      ...query,
    });
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getExpertReadyQuestionnaires = async (req: Request, res: Response) => {
  try {
    const filters: QuestionnaireListFilter = { sort: { }, limit: 10, skip: 0 };
    const query: QuestionnaireListQuery = { expert: req.params._id, $or: [{ status: QUESTIONNAIRE_STATUSES.SENDED }, { status: QUESTIONNAIRE_STATUSES.VERIFIED }, { status: QUESTIONNAIRE_STATUSES.ready }] };
    
    defineSearchEmail(query, String(req.query.search));
    defineSearchDates(req.query, query, ['sentedAt', 'completedAt']);
    definePagination(filters, req.query);

    if (req.query.seconds) filters.sort.seconds = Number(req.query.seconds);
    filters.sort.completedAt = -1;
    
    let data = await questionnaireModel
      .find(query, null, filters)
      .populate("course")
      .populate("student")
      .select("completedAt createdAt sentedAt streamDate date expert seconds status course studentEmail content_EXPERT.student student owner")
      .lean();

    const total = await questionnaireModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

async function onCreatePDF(req: Request, res: Response, send = false, collection = false, onresponse = true, onepage = false) {
  const assets: Array<Mixed.Dto> = await mixedAssetModel.find().lean();
  const questionnaire = await questionnaireModel.findById(req.body.questionnaire_id)
    .populate("student")
    .populate("course")
    .populate({
      path: "expert",
      populate: "avatar",
    });

  if (!questionnaire) return res.status(404).json(constants.NOT_FOUND);

  const file = await fileModel.findOne({
    type: FILES.DOCUMENT,
    questionnaire: questionnaire._id,
    owner: questionnaire.expert._id,
  });
  if (file && !send && !collection) {
    const currectName = questionnaire.student ? questionnaire.student.email : (questionnaire.content_EXPERT.student.data.module.data.email || 'Отчёт')
    return response(res, STATUSES.OK, true, null, {
      src: file.src,
      name: `${currectName}.pdf`,
    });
  }

  createQuestionnairePDF(req, res, questionnaire, assets, collection, onresponse, onepage);
}

async function onSendPDF(req: Request, res: Response) {
  const questionnaire = await questionnaireModel.findByIdAndUpdate(req.params._id, { status: QUESTIONNAIRE_STATUSES.SENDED }, { new: true })
    .populate("student")
    .populate("course")
    .populate({
      path: "expert",
      populate: "avatar",
    });
  
  questionnaire.sendedAt = Date.now();
  await questionnaire.save();

  if (!questionnaire.student) {
    const student = await userModel.findOne({ email: questionnaire.content_EXPERT.student.data.module.data.email });
    if (!student) return response(res, STATUSES.NOT_FOUND, false, constants.STUDENT_NOT_FOUND);
    questionnaire.student = student;
    questionnaire.studentEmail = student.email;
    await questionnaire.save();
  }

  if (questionnaire.student && questionnaire.expert && questionnaire.course)
    await courseElementModel.findOneAndUpdate({ student: questionnaire.student._id, expert: questionnaire.expert._id, course: questionnaire.course._id }, { status: COURSES_STATUSES.VERIFIED });
  res.locals.questionnaire = questionnaire;
  res.locals.fileData = { src: `/upload/files/${questionnaire._id}.pdf`, name: `${questionnaire._id}.pdf` };

  await createQuestionnaireFile(req, res);
  sendEmail(constants.SRC_VERIFIED, { expert: res.locals.questionnaire.expert.name }, res.locals.questionnaire.student.email, constants.TITLE_VERIFIED);

  return response(res, STATUSES.OK, true, constants.SENDED_SUCCESS);
}

export async function createQuestionnaireFile(_req: Request, res: Response) {
  let file = await fileModel.findOne({
    type: FILES.DOCUMENT,
    questionnaire: res.locals.questionnaire._id,
    owner: res.locals.questionnaire.expert._id,
  });
  if (file) {
    file.src = res.locals.fileData.src;
  } else {
    file = new fileModel({
      type: FILES.DOCUMENT,
      owner: res.locals.questionnaire.expert._id,
      src: res.locals.fileData.src,
      questionnaire: res.locals.questionnaire._id
    });
  }
  await file.save();
  if (res.locals.questionnaire.student && res.locals.questionnaire.expert && res.locals.questionnaire.course)
    await courseElementModel.findOneAndUpdate({ student: res.locals.questionnaire.student._id, expert: res.locals.questionnaire.expert._id, course: res.locals.questionnaire.course._id }, { fileExpert: file._id });
}

export const fileQuestionnaire = async (req: Request, res: Response) => {
  try {
    const file = await fileModel.findOne({ 
      $or: [{ meta: '' }, { meta: undefined }],
      questionnaire: req.params._id,
      type: FILES.DOCUMENT,
      src: {$regex: 'pdf'}
    });
    const questionnaire = await questionnaireModel.findById(req.params._id).populate('student');
    if (!file) return response(res, STATUSES.NOT_FOUND, false, constants.FILE_NOT_FOUND);
    response(res, STATUSES.OK, true, null, {
      src: file.src,
      name: `${questionnaire.student.email || questionnaire.content_STUDENT.student.data.module.data.email || 'Отчет'}.pdf`,
    });
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const saveQuestionnaire = async (req: Request, res: Response) => {
  try {
    onCreatePDF(req, res);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const saveOnePageQuestionnaire = async (req: Request, res: Response) => {
  try {
    onCreatePDF(req, res, false, true, true, true);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const sendQuestionnaire = async (req: Request, res: Response) => {
  try {
    onSendPDF(req, res);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const collectionQuestionnaire = async (req: Request, res: Response) => {
  try {
    onCreatePDF(req, res, false, true);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const saveMode = async (req: Request, res: Response) => {
  try {
    await questionnaireModel.findByIdAndUpdate(req.params._id, req.body.data);
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const saveModeError = async (req: Request, res: Response) => {
  try {
    if (req.body.err && req.body.err.config && req.body.err.config.data && req.body.questionnaire) {
      const json = JSON.parse(req.body.err.config.data);
      const data = await questionnaireModel.findById(req.body.questionnaire).populate('course');
      if (!data)
        return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
      if (data.status === QUESTIONNAIRE_STATUSES.PROCESS && res.locals.user.role === ROLES.STUDENT) 
        return response(res, STATUSES.FORBIDDEN, false, constants.NOT_EDIT);
      const currectContent = 'content_' + (res.locals.user.role === ROLES.OWNER ? ROLES.EXPERT : res.locals.user.role);
      
      data.updatedAt = Date.now();

      if (json && json[currectContent]) {
        if (res.locals.user.role === ROLES.EXPERT) data.seconds = json.seconds;
        data[currectContent] = json[currectContent];
        data.markModified(currectContent);
      }
      await data.save();
    }
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const createQuestionnaire = async (req: Request, res: Response) => {
  try {
    const user = await userModel
      .findById(res.locals.user._id)
      .populate('course')
      .lean();
    const courseElement = await courseElementModel
      .findOne({ student: res.locals.user._id, course: user.course._id })
      .populate('course')
      .lean();
    if (courseElement && courseElement.status !== COURSES_STATUSES.NOTSENT) return response(res, STATUSES.CONFLICT, false, constants.ALREADY_UPLOAD);

    req.body.owner = res.locals.user.role;
    req.body.course = user.course._id;
    req.body.streamDate = courseElement ? courseElement.streamDate : dateFilter(Date.now());

    if (res.locals.user.role === ROLES.STUDENT) {
      req.body.student = user._id;
      req.body.studentEmail = user.email;
    } else if (res.locals.user.role === ROLES.EXPERT) {
      req.body.status = QUESTIONNAIRE_STATUSES.process;
      req.body.version = QUESTIONNAIRE_VERSIONS.OLD;
    }

    req.body.expert = courseElement ? courseElement.expert : res.locals.user._id;
    const data = new questionnaireModel(req.body);
    await data.save();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const verificationQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel
      .findById(req.params._id)
      .populate('expert')
      .populate('course');
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (data.status !== QUESTIONNAIRE_STATUSES.NOTSENT && data.status !== QUESTIONNAIRE_STATUSES.NOTVERIFIED) return response(res, STATUSES.FORBIDDEN, false, constants.NOT_EDIT);

    const courses = await courseElementModel.find({ student: res.locals.user._id, status: { $ne: COURSES_STATUSES.NOTSENT }, course: data.course._id, questionnaire: { $ne: data._id }}).lean();
    
    if (courses.length > 0) return response(res, STATUSES.CONFLICT, false, constants.ALREADY_UPLOAD)

    if (req.body && req.body.content_STUDENT) {
      editContents(req, data, res.locals.user.email);
      await courseElementModel.findOneAndUpdate({ student: data.student, course: data.course._id }, { questionnaire: data._id, status: COURSES_STATUSES.SENT, sentedAt: Date.now() });
      await fillExpertContent(JSON.parse(JSON.stringify(req.body.content_STUDENT)), data);
      await createStudentFile(req, res, data);
      if (!data.sentedAt) data.sentedAt = Date.now();
    }

    await data.save();
    response(res, STATUSES.OK, true, constants.SENDED_SUCCESS, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const stopQuestionnaire = async (req: Request, res: Response) => {
  try {
    res.locals.save = true;
    editQuestionnaire(req, res);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const studentQuestionnaire = async (req: Request, res: Response) => {
  try {
    await questionnaireModel.findByIdAndUpdate(req.params._id, req.body)
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const combineQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel
      .findById(req.params._id)
      .populate("course")
      .populate("student")
      .populate("expert");
    data.content_COMBINE_EXPERT = req.body.content_COMBINE_EXPERT;
    data.content_COMBINE_STUDENT = req.body.content_COMBINE_STUDENT;
    data.markModified('content_COMBINE_EXPERT');
    data.markModified('content_COMBINE_STUDENT');
    await data.save();
    
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const uncombineQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel
      .findById(req.params._id)
      .populate("course")
      .populate("student")
      .populate("expert");
    
    data.content_EXPERT = data.content_COMBINE_EXPERT;
    data.content_STUDENT = data.content_COMBINE_STUDENT;
    data.content_COMBINE_EXPERT = null;
    data.content_COMBINE_STUDENT = null;

    data.markModified('content_EXPERT');
    data.markModified('content_STUDENT');
    data.markModified('content_COMBINE_EXPERT');
    data.markModified('content_COMBINE_STUDENT');
    await data.save();
    
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const editQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel
      .findById(req.params._id)
      .populate("course")
      .populate("student")
      .populate("expert");
      
    const currectContent = 'content_' + res.locals.user.role;

    if (!data)
      return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (data.status === QUESTIONNAIRE_STATUSES.PROCESS && res.locals.user.role === ROLES.STUDENT) 
      return response(res, STATUSES.FORBIDDEN, false, constants.NOT_EDIT);

    function getInstrumentsLength(portfolios: Questionnaire.QTargetPortfolios) {
      let length = 0;
      const portfolio_id = ['existing', 'student'];
      const sections = [1, 2];
      for (const pid of portfolio_id) {
        for (const section of sections) {
          length += portfolios[(<'student' | 'existing'>pid)].sections[section].modules.length;
        }
      }
      return length;
    }

    if (res.locals.user.role === ROLES.STUDENT) {
      const requestLength = getInstrumentsLength(req.body[currectContent].targets.data[0].portfolios);
      const dataLength = getInstrumentsLength(data[currectContent].targets.data[0].portfolios);
      if (dataLength - requestLength >= 12) {
        return response(res, STATUSES.BAD_REQUEST, false, constants.EDIT_ERROR_LENGTH);
      }
    }
    
    if (!data.content_EXPERT && data.owner === ROLES.STUDENT && res.locals.user.role === ROLES.EXPERT) {
      req.body.content_EXPERT = data.content_STUDENT;
    }
    if (data.owner === ROLES.STUDENT && res.locals.user.role === ROLES.STUDENT && data.status === QUESTIONNAIRE_STATUSES.NOTVERIFIED) {
      editContents(req, data, res.locals.user.email);
    }
    if (req.body && req.body[currectContent]) {
      if (res.locals.user.role === ROLES.EXPERT) {
        data.seconds = req.body.seconds;
      }
      data[currectContent] = req.body[currectContent];
      data.markModified(currectContent);
    }
    if (res.locals.save && res.locals.user.role === ROLES.EXPERT) {
      saveInstruments(res, req.body.content_EXPERT.targets.data, data, false);
    }

    data.updatedAt = Date.now();
    await data.save();
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const finishQuestionnaire = async (req: Request, res: Response) => {
  try {
    const data = await questionnaireModel
    .findById(req.params._id)
      .populate("course")
      .populate("student")
      .populate({
        path: "expert",
        populate: {
          path: "avatar",
        },
      });
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);

    if (req.body && req.body.content_EXPERT) {
      data.seconds = req.body.seconds;
      data.content_EXPERT = req.body.content_EXPERT;
      data.markModified('content_EXPERT');
    }

    await data.save();
    saveInstruments(res, req.body.content_EXPERT.targets.data, data);
    req.body.questionnaire_id = data._id;
    onCreatePDF(req, res, false, true, false);
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const editTacticFile = async (req: Request, res: Response) => {
  try {
    const questionnaire = await questionnaireModel.findById(req.params._id);
    const fileLength = await fileModel.countDocuments({ questionnaire: questionnaire._id, meta: { $regex: `${req.query.targetId}-${req.query.portfolioId}`, $options: 'i' } });
    if (!questionnaire) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (!req.files.length) return response(res, STATUSES.NOT_FOUND, false, constants.FILE_NOT_FOUND);
    if (fileLength + Number(req.files.length) > 5) return response(res, STATUSES.NOT_FOUND, false, constants.MAX_FILES);

    for (const fileMulter of (req.files as Array<Express.Multer.File>)) {
      const src = `/upload/questionnaire/tactic/${questionnaire._id}-${req.query.targetId}-${req.query.portfolioId}-${fileMulter.originalname}`;
      const query = { questionnaire: questionnaire._id, meta: `${req.query.targetId}-${req.query.portfolioId}-${fileMulter.originalname}` };
      let file = await fileModel.findOne(query);
      if (!file) {
        file = new fileModel({
          originalname: fileMulter.originalname,
          type: FILES.TACTIC,
          src,
          ...query
        });
        questionnaire.files = [...questionnaire.files, file._id];
        questionnaire.markModified('files');
        await questionnaire.save();
      } else {
        file.originalname = fileMulter.originalname;
        file.src = src;
      }
      await file.save();
    }
    const files = await fileModel.find({ questionnaire: questionnaire._id, meta: { $regex: `${req.query.targetId}-${req.query.portfolioId}`, $options: 'i' } }).lean();
    response(res, STATUSES.OK, true, null, files);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const removeTacticFile = async (req: Request, res: Response) => {
  try {
    const fileReq = JSON.parse(String(req.query.file));
    const file = await fileModel.findOne({ questionnaire: req.params._id, meta: `${req.query.targetId}-${req.query.portfolioId}-${fileReq.originalname}` });
    if (!file) return response(res, STATUSES.NOT_FOUND, false, constants.FILE_NOT_FOUND);
    await questionnaireModel.findByIdAndUpdate(req.params._id, { $pull: { files: file._id } });

    const link = process.env.FILE_FOUND + file.src;
    if (fs.existsSync(link)) fs.unlinkSync(link);
    await file.remove();

    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function saveInstruments(res: Response, targets: Array<any>, data: dynamicsObject, status = true) {
  let instrumentsList: Array<dynamicsObject> = [];
  let expertinstrumentList: Array<dynamicsObject> = [];

  for (const target of targets) {
    for (const portfolioKey in target.portfolios) {
      if (target.status[portfolioKey] === 1) {
        const portfolio = target.portfolios[portfolioKey];
        const coreInstruments = portfolio.sections[1].modules.map((m: dynamicsObject) => m.data);
        const tacticInstruments =
          portfolio.sections[2] && portfolioKey !== "expert"
            ? portfolio.sections[2].modules.map((m: dynamicsObject) => m.data)
            : [];
        if (portfolioKey === 'expert') {
          expertinstrumentList = coreInstruments;
        } else {
          instrumentsList = [
            ...instrumentsList,
            ...coreInstruments,
            ...tacticInstruments,
          ];
        }
      }
    }
  }

  investmentPost(instrumentsList, expertinstrumentList, data.expert._id, data.course.type, res);
  if (status && data.status !== QUESTIONNAIRE_STATUSES.SENDED) {
    if (data.version === QUESTIONNAIRE_VERSIONS.OLD) data.status = QUESTIONNAIRE_STATUSES.ready;
    if (data.version === QUESTIONNAIRE_VERSIONS.NEW) data.status = QUESTIONNAIRE_STATUSES.VERIFIED;
    if (data.student && data.expert && data.course) 
      courseElementModel.findOneAndUpdate({ expert: data.expert._id, course: data.course._id, student: data.student._id }, { completedAt: Date.now() });
    data.completedAt = Date.now();
    data.save();
  }
};

export const deleteQuestionnaire = async (req: Request, res: Response) => {
  try {
    const questionnaire = await questionnaireModel.findById(req.params._id).populate('student');
    if ((questionnaire.status === QUESTIONNAIRE_STATUSES.PROCESS || questionnaire.status === QUESTIONNAIRE_STATUSES.VERIFIED) && res.locals.user.role === ROLES.STUDENT)
      return response(res, STATUSES.FORBIDDEN, false, constants.REMOVE_QUESTIONNAIRE_IMPOSSIBLE);
    await questionnaire.remove({});
    await courseElementModel.findOneAndUpdate({ questionnaire: questionnaire._id, course: questionnaire.course }, { status: COURSES_STATUSES.NOTSENT });

    const file = await fileModel.findOneAndRemove({ questionnaire: req.params._id, type: FILES.DOCUMENT, $or: [{ meta: '' }, { meta: undefined }] });
    if (file) {
      const link = process.env.FILE_FOUND + file.src;
      if (fs.existsSync(link)) fs.unlinkSync(link);
    }

    if (questionnaire.student) createAction(res.locals.user._id, `Удаление работы студента ${questionnaire.student.email}`, 'QUESTIONNAIRE_DELETE');
    
    response(res, STATUSES.OK, true, null, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

// Надо так!
export const first = async (_req: Request, res: Response) => {
  await userModel.updateMany({ }, { password: create('test') });
  response(res, STATUSES.OK, true, null);
}

export default { getQuestionnaire, getPaginationQuestionnaires, getPaginationQuestionnairesArchive, getExpertNotVerifiedQuestionnaires, getExpertProcessQuestionnaires, getExpertReadyQuestionnaires, fileQuestionnaire, saveQuestionnaire, saveOnePageQuestionnaire, sendQuestionnaire, collectionQuestionnaire, saveMode, saveModeError, createStudentFile, verificationQuestionnaire, createQuestionnaire, stopQuestionnaire, studentQuestionnaire, combineQuestionnaire, uncombineQuestionnaire, editQuestionnaire, finishQuestionnaire, editTacticFile, removeTacticFile, deleteQuestionnaire, first };