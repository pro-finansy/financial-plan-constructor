import { Request, Response } from "express";
import isEmail from "validator/lib/isEmail";
import xlsx from 'node-xlsx';
import fs from "fs";

import { dynamicsObject } from "../../interfaces";
import { StudentListQuery } from "./student.interfaces";

import userModel from "../user/user.model";
import courseElementModel from "../courseElement/courseElement.model";
import questionnaireModel from "../questionnaire/questionnaire.model";
import filesModel from "../files/files.model";

import { createAction } from "../actions/actions.controller";

import sendEmail from '../email';
import { response, getsResponse } from "../../utils/response";
import { defineSearchEmail, defineSearchDates, definePagination } from '../../utils/defines';
import { COURSES, ROLES, STATUSES } from "../../utils/enums";
import { create } from "../../utils/password";
import errorHandler from "../../utils/handler";

import constants from './student.contants';

export const getStudentList = async function (req: Request, res: Response) {
  try {
    const filters = {
      sort: { updatedAt: -1 }
    };

    definePagination(filters, req.query);

    const query: StudentListQuery = { student: { $ne: undefined } };
    const queryVariables = ['expert', 'course', 'status', 'streamDate'];
    const moreQueries: dynamicsObject = { };
    const search = String(req.query.search) || '';

    defineSearchEmail(query, search);
    defineSearchDates(req.query, query, ['sentedAt', 'completedAt']);

    const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
    if (cyrrilic) moreQueries.studentName = { '$regex': search.trim().toLowerCase(), '$options': 'i' };

    for (const variable of queryVariables) {
      if (req.query[variable]) query[variable] = req.query[variable];
    }

    if (req.query.fileStudent) query.fileStudent = req.query.fileStudent === 'present' ? { $ne: undefined } : undefined;
    if (req.query.fileExpert) query.fileExpert = req.query.fileExpert === 'present' ? { $ne: undefined } : undefined;
    if (res.locals.user.role === ROLES.EXPERT && !res.locals.user.accesses.includes(ROLES.EXPERT)) query.expert = res.locals.user._id;

    if (moreQueries.studentName) {
      const students = await userModel.find({ role: ROLES.STUDENT, name: moreQueries.studentName }).select('_id').lean();
      query.student = { $in: students.map(s => s._id) }
    }
    
    const data = await courseElementModel.find(query, null, filters)
      .populate({
        path: 'expert',
        select: 'name _id'
      })
      .populate({
        path: 'student',
        select: 'email name phone _id'
      })
      .populate({
        path: 'course',
        select: 'name _id streamDate'
      })
      .populate('fileExpert')
      .populate('fileStudent')
      .populate({
        path: 'questionnaire',
        select: 'status completedAt sentedAt'
      })
      .lean();

    const total = await courseElementModel.countDocuments(query);
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    console.log(err);
    
    errorHandler(res, err);
  }
};

export const getCourseElement = async (req: Request, res: Response) => {
  try {
    const data = await courseElementModel
      .findOne({ student: req.params._id })
      .populate('course')
      .populate('fileExpert')
      .populate('fileStudent')
      .lean();
    if (!data) return response(res, STATUSES.NOT_FOUND, false, constants.COURSE_NOT_FOUND);
    response(res, STATUSES.OK, true, null, data);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const getStudentQuestionnaires = async function (req: Request, res: Response) {
  try {
    const query = { student: res.locals.user._id };
    defineSearchDates(req.query, query, ['sentedAt']);

    const data = await questionnaireModel
      .find(query, null, { sort: { createdAt: -1 } })
      .select('course expert fileStudent fileExpert status content_STUDENT.targets updatedAt sentedAt completedAt')
      .populate('course')
      .populate('expert')
      .lean();

    const courseElements = await courseElementModel
      .find({ student: res.locals.user._id, questionnaire: { $in: data.map(d => d._id) } })
      .populate('fileStudent')
      .populate('fileExpert')
      .lean();

    data.forEach(d => {
      const courseelement = courseElements.find(c => String(c.questionnaire) === String(d._id));
      if (courseelement) {
        d.fileStudent = courseelement.fileStudent;
        d.fileExpert = courseelement.fileExpert;
        d.courseElement = courseelement._id;
      }
    });

    const total = await courseElementModel.countDocuments({student: res.locals.user._id});
    getsResponse(res, STATUSES.OK, true, null, data, total);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const downloadStudentFile = async function (req: Request, res: Response) {
  try {
    const courseElement = await courseElementModel
      .findById(req.body._id)
      .populate({
        path: 'expert',
        select: '-password -token -reset'
      })
      .populate({
        path: 'student',
        select: '-password -token -reset'
      })
      .populate('course')
      .populate('fileStudent');
    if (!courseElement) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    response(res, STATUSES.OK, true, null, courseElement);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const downloadExpertFile = async function (req: Request, res: Response) {
  try {
    const courseElement = await courseElementModel
      .findById(req.body._id)
      .populate('fileExpert');
    if (!courseElement) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    response(res, STATUSES.OK, true, null, courseElement.fileExpert);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const createStudent = async function (req: Request, res: Response) {
  try {
    const checkStudentCourses = async (student: dynamicsObject, course: typeof COURSES[keyof typeof COURSES]) => {
      const courses = await courseElementModel.find({ studentEmail: student.email });
      return courses.length === 1 && (String(courses[0].course) !== course);
    };
    if (req.body.email && !isEmail(req.body.email)) return response(res, STATUSES.CONFLICT, false, constants.UNCORRECT_EMAIL);
    let candidate = await userModel.findOne({ email: req.body.email.toLowerCase().trim() });
    const courseElementCandidate = await courseElementModel.findOne({ studentEmail: req.body.email.toLowerCase().trim(), course: req.body.course_id });

    if (candidate && courseElementCandidate) return response(res, STATUSES.CONFLICT, false, constants.EXIST_STUDENT);
    const course = req.body.course_id;
    let student: dynamicsObject = {};
    
    if (candidate) student = candidate;
    else {
      student = new userModel({
        email: req.body.email.toLowerCase().trim(),
        password: create(req.body.password),
        role: ROLES.STUDENT,
        course,
      });
    }
    student.courses = await checkStudentCourses(student, req.body.course_id);

    const courseElement = new courseElementModel({
      course, 
      expert: req.body.expert_id,
      student: student,
      chat: req.body.chat,
      studentEmail: student.email,
      streamDate: req.body.streamDate
    });

    await student.save();
    await courseElement.save();

    const result = await courseElementModel
      .findById(courseElement._id)
      .populate('course')
      .populate({
        path: 'expert',
        select: '-password -token -reset'
      })
      .populate({
        path: 'student',
        select: '-password -token -reset'
      });

    sendEmail(constants.SRC_STUDENT_CREATE_ACCOUNT, { password: req.body.password, email: student.email }, student.email, constants.TITLE_STUDENT_CREATE_ACCOUNT);

    createAction(res.locals.user._id, `Создание студента ${result.student.email}, курс "${result.course.name}"`, 'STUDENT_CREATE');
    response(res, STATUSES.OK, true, null, result);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const changeStudent = async function (req: Request, res: Response) {
  try {
    const candidate = await courseElementModel.findOne({ studentEmail: req.body.email, course: req.body.course_id, _id: { $ne: req.body._id } });
    if (candidate) return response(res, STATUSES.CONFLICT, false, constants.EXIST_STUDENT);
    const result = await courseElementModel.findByIdAndUpdate(req.body._id, { expert: req.body.expert_id, studentEmail: req.body.email, chat: req.body.chat, streamDate: req.body.streamDate, course: req.body.course_id }, { new: true })
      .populate({
        path: 'expert',
        select: 'name _id'
      })
      .populate({
        path: 'student',
        select: 'email _id'
      })
      .populate({
        path: 'course',
        select: 'name _id streamDate'
      })
      .populate('fileExpert')
      .populate('fileStudent')
      .populate({
        path: 'questionnaire',
        select: 'status'
      });

    createAction(res.locals.user._id, `Редактирование данных студента ${result.student.email} на [Поток: ${req.body.streamDate}, Курс: ${result.course.name}, Чат: ${req.body.chat}, Эксперт: ${result.expert.name}]`, 'STUDENT_EDIT');
    
    await userModel.findByIdAndUpdate(result.student._id, { email: req.body.email });
    await questionnaireModel.updateMany({ $or: [{ student: result.student._id }, { 'content_EXPERT.student.data.module.data.email': result.student.email }], course: result.course._id }, { expert: req.body.expert_id });
    response(res, STATUSES.OK, true, constants.STUDENT_EDITED, result);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changeExpert = async function (req: Request, res: Response) {
  try {
    const result = await courseElementModel.findByIdAndUpdate(req.body._id, { expert: req.body.expert_id }, {new: true})
      .populate('expert')
      .populate('student')
      .populate('course')
      .populate({ path: 'questionnaire', select: 'status' });
    if (result) {
      createAction(res.locals.user._id, `Перенос работ студента ${result.student.email} на ${result.expert.name}`, 'CHANGE_EXPERT');
      await questionnaireModel.updateMany({ $or: [{ student: result.student._id }, { 'content_EXPERT.student.data.module.data.email': result.student.email }], course: result.course._id }, { expert: req.body.expert_id });
    }
    response(res, STATUSES.OK, true, constants.EXPERT_CHANGED, result);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changeExpertStudents = async function (req: Request, res: Response) {
  try {
    if (String(req.body.expert_id) === String(req.body.change_expert_id)) return response(res, STATUSES.CONFLICT, false, constants.CHANGE_EXPERT_ERROR);
    await courseElementModel.updateMany({ expert: req.body.expert_id }, { expert: req.body.change_expert_id });
    await questionnaireModel.updateMany({ expert: req.body.expert_id }, { expert: req.body.change_expert_id });
    const experts = await userModel.find({ role: ROLES.EXPERT }).select('name');
    createAction(res.locals.user._id, `Перенос всех работ студентов с ${experts.find(e => String(e._id) === String(req.body.expert_id)).name} на ${experts.find(e => String(e._id) === String(req.body.change_expert_id)).name}`, 'CHANGE_EXPERT');
    response(res, STATUSES.OK, true, constants.EXPERT_CHANGED, req.body);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changeExpertListStudents = async function (req: Request, res: Response) {
  try {
    if (String(req.body.expert_id) === String(req.body.change_expert_id)) return response(res, STATUSES.CONFLICT, false, constants.CHANGE_EXPERT_ERROR);
    if (!req.file) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND_FILE);
    const excel = xlsx.parse(req.file.buffer);
    let array: Array<any> = [];
    let valid = false;
    for (let i = 0; i < excel[0].data.length; i++) {
      const element: any = excel[0].data[i];
      if (valid && element[0]) {
        array = [...array, element[0]];
      }
      if (element[0] === 'Студент') valid = true;
    }
    if (array.length === 0) return response(res, STATUSES.CONFLICT, false, constants.TEMPLATE_ERROR);
    await courseElementModel.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });
    await questionnaireModel.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });
    req.body.array = array;

    const experts = await userModel.find({ role: ROLES.EXPERT }).select('name');
    createAction(res.locals.user._id, `Перенос всех работ студентов [${array.join(', ')}] с ${experts.find(e => String(e._id) === String(req.body.expert_id)).name} на ${experts.find(e => String(e._id) === String(req.body.change_expert_id)).name}`, 'CHANGE_EXPERT');
    response(res, STATUSES.OK, true, 'Работы перемещены!', req.body);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changePassword = async function (req: Request, res: Response) {
  try {
    const courseElement = await courseElementModel.findById(req.body._id).populate('student');
    if (!courseElement) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    await userModel.findByIdAndUpdate(courseElement.student, { password: create(req.body.password), token: null, reset: null });
    
    createAction(res.locals.user._id, `Смена пароля студента ${courseElement.student.email}`, 'STUDENT_PASSWORD');
    
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const changeStreamDate = async function (req: Request, res: Response) {
  try {
    const streamArray: Array<string> = req.body.streamDate.split('.');
    if (streamArray.length !== 3 || +streamArray[0] > 31 || +streamArray[0] < 1 || +streamArray[1] > 12 || +streamArray[1] < 1 || +streamArray[2] > 2030 || +streamArray[2] < 2021) {
      return response(res, STATUSES.CONFLICT, false, constants.UNCORRECT_DATE);
    }
    const result = await courseElementModel.findByIdAndUpdate(req.body._id, { streamDate: req.body.streamDate }, {new: true})
      .populate('expert')
      .populate('student')
      .populate('course');

    createAction(res.locals.user._id, `Смена потока курса студента ${result.student.email} на ${req.body.streamDate}`, 'STUDENT_STREAM_DATE');
    
    response(res, STATUSES.OK, true, constants.STREAM_EDITED, result);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const deleteStudent = async function (req: Request, res: Response) {
  try {
    const courseElement = await courseElementModel.findById(req.params._id).populate('student').populate('course');
    if (!courseElement) return response(res, STATUSES.OK, true, constants.REMOVED_STUDENT, req.params._id);

    createAction(res.locals.user._id, `Удаление студента ${courseElement.student.email}, курс "${courseElement.course.name}"`, 'STUDENT_DELETE');

    await courseElement.remove();
    const courses = await courseElementModel.find({ student: courseElement.student });
    if (courses.length === 0) {
      await userModel.deleteOne({ _id: courseElement.student });
    } else {
      await userModel.findByIdAndUpdate(courseElement.student, { courses: false });
    }

    response(res, STATUSES.OK, true, constants.REMOVED_STUDENT, req.params._id);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const deleteStudentFile = async function (req: Request, res: Response) {
  try {
    const courseElement = await courseElementModel.findByIdAndUpdate(req.params._id, { status: 'NOTSENT', fileStudent: null }, { new: true })
      .populate({
        path: 'expert',
        select: 'name _id'
      })
      .populate({
        path: 'student',
        select: 'email _id'
      })
      .populate({
        path: 'course',
        select: 'name _id streamDate'
      })
      .populate('fileExpert')
      .populate('fileStudent')
      .populate({
        path: 'questionnaire',
        select: 'status'
      });

    createAction(res.locals.user._id, `Удаление файла студента ${courseElement.student.email}`, 'STUDENT_DELETE_FILE');
    
    const file = await filesModel.findOneAndRemove({ courseElement: courseElement._id });
    if (file) {
      const link = process.env.FILE_FOUND + file.src;
      if (fs.existsSync(link)) fs.unlinkSync(link);
    }

    response(res, STATUSES.OK, true, constants.REMOVED_STUDENT, courseElement);
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const deleteStudents = async function (req: Request, res: Response) {
  try {
    if (!req.file) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND_FILE);
    const excel = xlsx.parse(req.file.buffer);
    let array: Array<any> = [];
    let valid = false;
    for (let i = 0; i < excel[0].data.length; i++) {
      const element: any = excel[0].data[i];
      if (valid && element[0]) {
        array = [...array, element[0]];
      }
      if (element[0] === 'Студент') valid = true;
    }
    if (array.length === 0) return response(res, STATUSES.CONFLICT, false, constants.TEMPLATE_ERROR);
    await courseElementModel.deleteMany({ studentEmail: { $in: array } });
    await userModel.deleteMany({ email: { $in: array } });
    // await questionnaireModel.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });

    createAction(res.locals.user._id, `Удаление студентов [${array.join(', ')}]`, 'STUDENT_DELETE');
    req.body.array = array;
    response(res, STATUSES.OK, true, constants.REMOVED_STUDENTS, req.body);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { getStudentList, getCourseElement, getStudentQuestionnaires, downloadExpertFile, downloadStudentFile, createStudent, changeStreamDate, changeStudent, changeExpert, changeExpertStudents, changeExpertListStudents, changePassword, deleteStudent, deleteStudentFile, deleteStudents }