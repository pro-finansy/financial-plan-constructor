import { Request, Response } from 'express';
import fs from 'fs';

import { dynamicsObject } from '../../interfaces';

import userModel from "./user.model";
import fileModel from '../files/files.model';
import courseModel from '../course/course.model';
import questionnaireModel from '../questionnaire/questionnaire.model';
import courseElementModel from '../courseElement/courseElement.model';

import { Socket } from "../../utils/socket";
import sendEmail from '../email/index';
import { getsResponse, response } from "../../utils/response";
import { create } from "../../utils/password";
import { ROLES, FILES, STATUSES, ACCESSES, QUESTIONNAIRE_STATUSES, COURSES_STATUSES } from '../../utils/enums';
import errorHandler from "../../utils/handler";
import constants from './user.constants';
import { definePagination } from '../../utils/defines';
import isEmail from 'validator/lib/isEmail';
import { createAction } from '../actions/actions.controller';

export const getUser = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(req.params._id)
      .populate('avatar')
      .select('-password -token -reset')
      .lean();
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getUsers = async function (_req: Request, res: Response) {
  try {
    const data = await userModel.find()
      .populate('avatar')
      .select('-password -token -reset')
      .lean();
    const total = await userModel.countDocuments();
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getPaginationExperts = async function (req: Request, res: Response) {
  try {
    const filters = {};
    definePagination(filters, req.query);

    const query: dynamicsObject = { role: ROLES.EXPERT };
    
    const search = String(req.query.search);
    const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
    const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
    const email = isEmail(search.trim());

    if (latin || email) query.email = { '$regex': search, '$options': 'i' };
    if (cyrrilic) query.name = { '$regex': search, '$options': 'i' };
    
    const data = await userModel.find(query, {}, filters)
      .populate('avatar')
      .select('-password -token -reset')
      .lean();
    const total = await userModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getPaginationSupport = async function (req: Request, res: Response) {
  try {
    const filters = {};
    definePagination(filters, req.query);

    const query: dynamicsObject = { role: ROLES.SUPPORT };

    const search = String(req.query.search);
    const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
    const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
    const email = isEmail(search.trim());

    if (latin || email) query.email = { '$regex': search, '$options': 'i' };
    if (cyrrilic) query.name = { '$regex': search, '$options': 'i' };

    const data = await userModel.find(query, {}, filters)
      .populate('avatar')
      .select('-password -token -reset')
      .lean();
    const total = await userModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getListExperts = async function (_req: Request, res: Response) {
  try {
    const data = await userModel.find({ role: ROLES.EXPERT })
      .select('name _id course')
      .lean();
    getsResponse(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const createExpert = async function (req: Request, res: Response) {
  try {
    const courses = await courseModel.find().lean();
    const candidate = await userModel.findOne({ email: req.body.email });
    if (candidate) return response(res, STATUSES.CONFLICT, false, constants.EMAIL_EXISTS);

    const password = req.body.password;
    req.body.password = create(req.body.password);
    req.body.role = ROLES.EXPERT;
    req.body.accesses = req.body.accesses_id;
    delete req.body.avatar;

    if (req.body.accesses.indexOf(ACCESSES.HOMEWORK) !== -1) {
      req.body.course = courses.find((c: dynamicsObject) => c.tag === ACCESSES.HOMEWORK);
    } else if (req.body.accesses.indexOf(ACCESSES.INVESTMENT) !== -1) {
      req.body.course = courses.find((c: dynamicsObject) => c.tag === ACCESSES.INVESTMENT);
    }

    const data = new userModel(req.body);
    await data.save();

    createAction(res.locals.user._id, `Создание аккаунта эксперта - ${req.body.name}`, 'EXPERT_CREATE');
    sendEmail(__dirname + '/templates/role.html', { role: 'Эксперта', email: req.body.email, password: password }, req.body.email, constants.TITLE_EXPERT_CREATE_ACCOUNT);

    response(res, STATUSES.CREATED, true, constants.EXPERT_CREATE, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const createSupport = async function (req: Request, res: Response) {
  try {
    const candidate = await userModel.findOne({ email: req.body.email.toLowerCase().trim() });
    if (candidate) return response(res, STATUSES.CONFLICT, false, constants.EMAIL_EXISTS);

    req.body.email = req.body.email.toLowerCase().trim();
    const password = req.body.password;
    req.body.password = create(req.body.password);
    req.body.role = ROLES.SUPPORT;
    delete req.body.avatar;

    const data = new userModel(req.body);
    await data.save();

    createAction(res.locals.user._id, `Создание аккаунта службы поддержки - ${req.body.name}`, 'SUPPORT_CREATE');
    sendEmail(__dirname + '/templates/role.html', { role: 'Службы поддержки', email: req.body.email, password: password }, req.body.email, constants.TITLE_SUPPORT_CREATE_ACCOUNT);

    response(res, STATUSES.CREATED, true, constants.SUPPORT_CREATE, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const setUserAvatar = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(req.query._id);
    let avatar = await fileModel.findById(data.avatar);
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (!req.file) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND_FILE);

    const src = `/upload/users/${data._id}.${req.file.originalname.split('.').pop()}`;
    if (!avatar) {
      avatar = new fileModel({
        type: FILES.AVATAR,
        src
      });
      data.avatar = avatar._id;
      await data.save();
    } else {
      avatar.src = src;
    }
    await avatar.save();
    response(res, STATUSES.OK, true, null, { avatar });
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const changeActive = async function (req: Request, res: Response) {
  try {
    let data = await userModel.findById(req.params._id);
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);

    if (!req.body.active) {
      Socket.userAction('logout', req.params._id);
      data.token = null;
      data.reset = null;
    }
    data.active = req.body.active;
    await data.save();

    const status = req.body.active ? 'Активация' : 'Деактивация';
    createAction(res.locals.user._id, `${status} аккаунта пользователя - ${data.name} (${data.email})`, 'ACTIVE_USER');
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const editComments = async function (req: Request, res: Response) {
  try {
    let data = await userModel.findById(res.locals.user._id)
      .populate('course')
      .populate('avatar');

    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);

    data.comments = req.body.comments;
    data.markModified('comments');

    await data.save();
    response(res, STATUSES.OK, true, constants.SAVE_COMMENTS, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const updateUser = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(res.locals.user._id)
      .populate('avatar')
      .populate('course')
      .select('-password -reset');

    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (req.body.password && req.body.password !== req.body.reset_password) return response(res, STATUSES.CONFLICT, false, constants.ERR_COINCIDENCE_PASSWORD);
    if (req.body.password && req.body.password.length < 6) return response(res, STATUSES.CONFLICT, false, constants.ERR_MIN_PASSWORD);
    if (req.body.password) {
      req.body.password = create(req.body.password);
    } else {
      delete req.body.password;
    }

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) data[key] = req.body[key];
    }
    await data.save();

    response(res, STATUSES.OK, true, constants.UPDATE_USER, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changePassword = async function (req: Request, res: Response) {
  try {
    if (!req.body.password) return response(res, STATUSES.CONFLICT, false, constants.ERR_INPUT_PASSWORD);
    if (req.body.password !== req.body.reset_password) return response(res, STATUSES.CONFLICT, false, constants.ERR_COINCIDENCE_PASSWORD);
    if (req.body.password.length < 6) return response(res, STATUSES.CONFLICT, false, constants.ERR_MIN_PASSWORD);
    
    const data = await userModel.findById(res.locals.user._id)
      .populate('avatar')
      .populate('course')
      .select('-password -reset');
    
    data.password = create(req.body.password);

    await data.save();
    response(res, STATUSES.OK, true, constants.UPDATE_PASSWORD, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
}

export const editExpert = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(req.body._id)
      .populate('avatar')
      .select('-password -token -reset');
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (!req.body.password) delete req.body.password;
    if (req.body.password) req.body.password = create(req.body.password);

    req.body.accesses = req.body.accesses_id;
    req.body.avatar = data.avatar;
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) data[key] = req.body[key];
    }
    await data.save();

    createAction(res.locals.user._id, `Редактирование аккаунта эксперта - ${data.name} (${data.email})`, 'EXPERT_EDITED');
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const editSupport = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(req.body._id)
      .populate('avatar')
      .select('-password -token -reset');
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    req.body.avatar = data.avatar;
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) data[key] = req.body[key];
    }
    await data.save();

    createAction(res.locals.user._id, `Редактирование аккаунта СП - ${data.name} (${data.email})`, 'SUPPORT_EDITED');
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const deleteUser = async function (req: Request, res: Response) {
  try {
    Socket.userAction('logout', req.params._id);
    const user = await userModel.findByIdAndDelete(req.params._id);

    createAction(res.locals.user._id, `Удаление аккаунта СП - ${user.name} (${user.email})`, 'USER_DELETED');
    response(res, STATUSES.OK, true, null, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const deleteExpert = async function (req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.params._id);
    if (!user) return response(res, STATUSES.OK, true, null, req.params._id);
    await questionnaireModel.updateMany({ $or: [{ status: QUESTIONNAIRE_STATUSES.NOTSENT }, { status: QUESTIONNAIRE_STATUSES.NOTVERIFIED }, { status: QUESTIONNAIRE_STATUSES.PROCESS }], expert: req.params._id }, { expert: req.body.expert_id });
    await courseElementModel.updateMany({ $or: [{ status: COURSES_STATUSES.NOTSENT }, { status: COURSES_STATUSES.SENT }, { status: COURSES_STATUSES.PROCESS }], expert: req.params._id }, { expert: req.body.expert_id });
    await questionnaireModel.updateMany({ $or: [{ status: { $ne: QUESTIONNAIRE_STATUSES.NOTSENT }}, { status: { $ne: QUESTIONNAIRE_STATUSES.NOTVERIFIED } }, { status: { $ne: QUESTIONNAIRE_STATUSES.PROCESS } }], expert: req.params._id }, { prevExpert: user.name });

    createAction(res.locals.user._id, `Удаление аккаунта эксперта - ${user.name} (${user.email})`, 'EXPERT_DELETED');

    Socket.userAction('logout', user._id);
    await user.remove();

    response(res, STATUSES.OK, true, constants.DELETE_EXPERT, req.params._id);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const deleteUserAvatar = async function (req: Request, res: Response) {
  try {
    const data = await userModel.findById(req.params._id);
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);

    const file = await fileModel.findById(data.avatar);
    if (file) {
      const link = process.env.FILE_FOUND + file.src;
      if (fs.existsSync(link)) fs.unlinkSync(link);
      await fileModel.deleteOne({ _id: data.avatar });
    }
    
    data.avatar = null;
    return response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { getUser, getUsers, getPaginationExperts, getPaginationSupport, getListExperts, createExpert, createSupport, setUserAvatar, changeActive, editComments, updateUser, changePassword, editExpert, editSupport, deleteExpert, deleteUser, deleteUserAvatar }