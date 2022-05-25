import { Request, Response } from 'express';
import { dynamicsObject } from '../../interfaces';

import xl from 'excel4node';
import xlsx from 'node-xlsx';

import questionnaireModel from "../questionnaire/questionnaire.model";
import investmentModel from "../investment/investment.model";
import courseElementModel from '../courseElement/courseElement.model';
import userModel from '../user/user.model';
import filesModel from '../files/files.model';
import courseModel from '../course/course.model';

import { createAction } from '../actions/actions.controller';

import sendEmail from '../email';
import errorHandler from "../../utils/handler";
import dateFilter from '../../utils/date.filter';
import { create } from '../../utils/password';
import { ROLES, FILES, COURSES, COURSES_STATUSES, STATUSES, CORSES_STATUSES_NAME } from '../../utils/enums';
import { getsResponse, response } from "../../utils/response";

import constants from './excel.constants';
import { Questionnaire } from '../questionnaire/dto/questionnaire.dto';

export const createQuestionnaireExcel = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    
    const user = await userModel.findById(res.locals.user._id).lean();
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Отчёты');
    const titles = constants.TITLE_CREATE_QUESTIONNAIRE_XLSX;
    const statuses = constants.QUESTIONNAIRE_STATUSES;
    const options: dynamicsObject = req.body;

    if (user.role === ROLES.EXPERT && user.accesses.indexOf(ROLES.EXPERT) === -1) options.expert = res.locals.user._id;
    const data: Array<Questionnaire.Dto> = await questionnaireModel
      .find(options)
      .sort({ createdAt: -1 })
      .populate('expert')
      .populate('course')
      .populate('student')
      .select('student expert course createdAt sentedAt completedAt prevExpert status streamDate')
      .lean();

    for (let i = 0; i < titles.length; i++) {
      ws.column(i + 1).setWidth(25);
      ws.cell(1, i + 1).string(titles[i]);
    }

    const one = data.filter(q => q.course.type === COURSES.ONE);
    const two = data.filter(q => q.course.type === COURSES.TWO);

    one.forEach((questionnaire, index) => {
      ws.cell(index + 2, 1).string(questionnaire.student ? questionnaire.student.email : '');
      ws.cell(index + 2, 2).string(questionnaire.expert ? questionnaire.expert.name : questionnaire.prevExpert + ' *');
      ws.cell(index + 2, 3).string(questionnaire.course.name);
      ws.cell(index + 2, 4).string(questionnaire.streamDate);
      ws.cell(index + 2, 5).string(questionnaire.createdAt ? dateFilter(questionnaire.createdAt) : '');
      ws.cell(index + 2, 6).string(questionnaire.sentedAt ? dateFilter(questionnaire.sentedAt) : '');
      ws.cell(index + 2, 7).string(questionnaire.completedAt ? dateFilter(questionnaire.completedAt) : '');
      ws.cell(index + 2, 8).string(statuses[questionnaire.status]);
    });

    two.forEach((questionnaire, index) => {
      ws.cell(one.length + index + 3, 1).string(questionnaire.student ? questionnaire.student.email : '');
      ws.cell(one.length + index + 3, 2).string(questionnaire.expert ? questionnaire.expert.name : questionnaire.prevExpert + ' *');
      ws.cell(one.length + index + 3, 3).string(questionnaire.course.name);
      ws.cell(one.length + index + 3, 4).string(questionnaire.streamDate);
      ws.cell(one.length + index + 3, 5).string(questionnaire.createdAt ? dateFilter(questionnaire.createdAt) : '');
      ws.cell(one.length + index + 3, 6).string(questionnaire.sentedAt ? dateFilter(questionnaire.sentedAt) : '');
      ws.cell(one.length + index + 3, 7).string(questionnaire.completedAt ? dateFilter(questionnaire.completedAt) : '');
      ws.cell(one.length + index + 3, 8).string(statuses[questionnaire.status]);
    });

    wb.write(`Отчёты.xlsx`, res);
  } catch (err: any) {
    console.log(err);
    
    errorHandler(res, err);
  }
};

export const createInstrumentsExcel = async (_req: Request, res: Response) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Инструменты');
    const titles = constants.TITLE_CREATE_INSTRUMENT_XLSX;
    const data = await investmentModel.find().sort({ class: 1 }).lean();

    for (let i = 0; i < titles.length; i++) {
      ws.column(i + 1).setWidth(30);
      ws.cell(1, i + 1).string(titles[i]);
    }

    data.forEach((instrument, index) => {
      ws.cell(index + 2, 1).string(instrument.name);
      ws.cell(index + 2, 2).number(instrument.price);
      ws.cell(index + 2, 3).number(instrument.number_papers);
      ws.cell(index + 2, 4).string(instrument.currency);
      ws.cell(index + 2, 5).string(instrument.base_currency);
      ws.cell(index + 2, 6).string(instrument.instrument_type_one || '');
      ws.cell(index + 2, 7).string(instrument.instrument_type_two || '');
      ws.cell(index + 2, 8).string(instrument.class);
      ws.cell(index + 2, 9).string(instrument.country);
      ws.cell(index + 2, 10).string(instrument.section_one || '');
      ws.cell(index + 2, 11).string(instrument.section_two || '');
      ws.cell(index + 2, 12).string(instrument.entryPoint || '');
      ws.cell(index + 2, 13).string(instrument.exitPoint || '');
    });

    wb.write(`Инструменты.xlsx`, res);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

function getCorrectStatus(status: keyof typeof COURSES_STATUSES) {
  return CORSES_STATUSES_NAME[status];
}

export const createStudentFile = async (req: Request, res: Response, questionnaire: dynamicsObject) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Основной портфель');
    const titles = constants.TITLE_CREATE_STUDENT_INSTRUMENT_XLSX;
    const course = questionnaire.course.type;
    const targets = questionnaire.content_STUDENT.targets.data.length;
    const colors = ['#DDEBF7', '#E2F0D9', '#FBE4D6'];
    let defaultPadding = course === COURSES.ONE ? 3 : 0;
    if (course === COURSES.ONE) {
      ws.cell(1, 1).string('Цели: ');
      for (let i = 0; i < targets; i++) {
        ws.cell(i + 2, 1).string('Цель ' + (i + 1)).style(wb.createStyle({
          fill: {
            type: 'pattern',
            fgColor: colors[i],
            bgColor: colors[i],
            patternType: 'solid',
          }
        }));
      }
    }
    
    for (let i = 0; i < titles.length; i++) {
      ws.column(i + 1).setWidth(20);
      ws.cell(targets + defaultPadding, i + 1).string(titles[i]);
    }

    let totalLength = defaultPadding + targets + 1;
    questionnaire.content_STUDENT.targets.data.forEach((target: dynamicsObject, index: number) => {
      const style = wb.createStyle({
        fill: {
          type: 'pattern',
          fgColor: colors[index],
          bgColor: colors[index],
          patternType: 'solid',
        }
      });

      const portfolios = ['existing', 'student'];

      for (const portfolioId of portfolios) {
        const coreLength = target.portfolios[portfolioId].sections[1].modules.filter((m: dynamicsObject) => m.data.name && m.data.price).length;
        const tacticLength = target.portfolios[portfolioId].sections[2].modules.filter((m: dynamicsObject) => m.data.name && m.data.price).length;

        totalLength += index + 1;
        ws.cell(totalLength, 1).string(portfolioId === 'existing' ? 'Стартовый портфель' : 'Основной портфель');
        totalLength += 1;
        target.portfolios[portfolioId].sections[1].modules.filter((m: dynamicsObject) => m.data.name && m.data.price).forEach((m: dynamicsObject, indexModule: number) => {
          ws.cell(indexModule + totalLength, 1).string(m.data.name).style(style);
          ws.cell(indexModule + totalLength, 2).number(Number(m.data.price) || 0).style(style);
          ws.cell(indexModule + totalLength, 3).number(Number(m.data.lot) || 0).style(style);
          ws.cell(indexModule + totalLength, 4).number(Number(m.data.number_papers) || 0).style(style);
          ws.cell(indexModule + totalLength, 5).string(m.data[`currency_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 6).string(m.data[`base_currency_${course}`] || '').style(style);
          ws.cell(indexModule + totalLength, 7).number(Number(m.data.percent) || 0).style(style);
          ws.cell(indexModule + totalLength, 8).string(m.data['instrument_type_' + course]).style(style);
          ws.cell(indexModule + totalLength, 9).string(m.data[`class_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 10).string(m.data[`country_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 11).string(m.data['section_' + course]).style(style);
          ws.cell(indexModule + totalLength, 12).string(m.data.commentStudent || '').style(style);
        });
        totalLength += coreLength;
        target.portfolios[portfolioId].sections[2].modules.filter((m: dynamicsObject) => m.data.name && m.data.price).forEach((m: dynamicsObject, indexModule: number) => {
          ws.cell(indexModule + totalLength, 1).string(m.data.name).style(style);
          ws.cell(indexModule + totalLength, 2).number(Number(m.data.price) || 0).style(style);
          ws.cell(indexModule + totalLength, 3).number(Number(m.data.lot) || 0).style(style);
          ws.cell(indexModule + totalLength, 4).number(Number(m.data.number_papers) || 0).style(style);
          ws.cell(indexModule + totalLength, 5).string(m.data[`currency_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 6).string(m.data[`base_currency_${course}`] || '').style(style);
          ws.cell(indexModule + totalLength, 7).number(Number(m.data.percent) || 0).style(style);
          ws.cell(indexModule + totalLength, 8).string(m.data['instrument_type_' + course]).style(style);
          ws.cell(indexModule + totalLength, 9).string(m.data[`class_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 10).string(m.data[`country_${course}`]).style(style);
          ws.cell(indexModule + totalLength, 11).string(m.data['section_' + course]).style(style);
          ws.cell(indexModule + totalLength, 12).string(m.data.commentStudent || '').style(style);
        });
        totalLength += tacticLength;
      }
    });

    wb.write(process.env.STUDENT_FOUND + questionnaire._id + '.xlsx');
    
    const courseElement = await courseElementModel.findOne({ student: questionnaire.student, course: questionnaire.course._id });
    let fileStudent = await filesModel.findOne({ questionnaire: questionnaire._id, type: FILES.DOCUMENT, owner: res.locals.user._id });
    if (!fileStudent) {
      fileStudent = new filesModel({
        questionnaire: questionnaire._id,
        type: FILES.DOCUMENT,
        owner: res.locals.user._id,
        src: '/upload/studentFiles/' + questionnaire._id + '.xlsx',
        courseElement: courseElement._id
      });
    } else {
      fileStudent.src = '/upload/studentFiles/' + questionnaire._id + '.xlsx';
      fileStudent.courseElement = courseElement._id;
    }
    courseElement.fileStudent = fileStudent;
    await fileStudent.save();
    await courseElement.save();
  } catch (err: any) {
    console.log(err);
    errorHandler(res, err);
  }
};

export const downloadStudents = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Студенты');
    const titles = constants.TITLE_CREATE_STUDENTS_XLSX;

    const query: dynamicsObject = { ...req.body };
    const filters = { sort: { sentedAt: -1 } };

    if (res.locals.user.role === ROLES.EXPERT) query.expert = res.locals.user._id;
    const data = await courseElementModel
      .find(query, null, filters)
      .populate('expert')
      .populate('course')
      .lean();

    for (let i = 0; i < titles.length; i++) {
      ws.column(i + 1).setWidth(30);
      ws.cell(1, i + 1).string(titles[i]);
    }

    data.forEach((student, index) => {
      ws.cell(index + 2, 1).string(student.studentEmail);
      ws.cell(index + 2, 2).string(student.expert ? student.expert.name : '');
      ws.cell(index + 2, 3).string(student.course ? student.course.name : '');
      ws.cell(index + 2, 4).string(student.streamDate || '');
      ws.cell(index + 2, 5).number(+student.chat || 0);
      ws.cell(index + 2, 6).string(getCorrectStatus(student.status));
    });

    wb.write(`Студенты.xlsx`, res);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const importStudentList = async (req: Request, res: Response) => {
  try {
    if (!req.file) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND_FILE);
    const courses = await courseModel.find().lean();
    let students = await userModel.find({ role: ROLES.STUDENT });
    let celements = await courseElementModel.find().lean();
    const experts = await userModel.find({ role: ROLES.EXPERT }).lean();

    const excel = xlsx.parse(req.file.buffer);
    let array: Array<dynamicsObject> = [], arrayCourses: Array<dynamicsObject> = [], emailArray: Array<dynamicsObject> = [];
    let valid = false;
    
    for (let i = 0; i < excel[0].data.length; i++) {
      const element: Array<any> = excel[0].data[i];
      if (!valid && String(element[0]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === '#' && String(element[1]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'студент' && String(element[2]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'эксперт' && String(element[3]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'пароль' && String(element[4]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'номер чата' && String(element[5]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'курс' && String(element[6]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'дата потока') valid = true;
      if (!isNaN(+element[0]) && valid) {
        const expert = experts.find(expert => expert.name.includes(element[2]));
        let student: dynamicsObject = {};
        const candicate = students.find(s => s.email.trim().toLowerCase() === element[1].trim().toLowerCase());
        if (!element[5]) return response(res, STATUSES.CONFLICT, false, constants.COURSE_NOT_FOUND);
        const course = element[5].includes('Капитал') ? 
          courses.find(c => c.type === COURSES.ONE)._id : 
          courses.find(c => c.type === COURSES.TWO)._id;
        const password = element[3] ? create(String(element[3])) : null;

        if (!candicate) {
          student = new userModel({
            email: element[1].toLowerCase().trim(),
            role: ROLES.STUDENT,
            phone: element[7] || '',
            password,
            course
          });
          students = [...students, student];
          array = [...array, student];
          emailArray = [...emailArray, { email: student.email, password: String(element[3] || '') }];
        } else if (String(candicate.course) !== String(course)) {
          student = candicate;
          candicate.courses = true;
          await candicate.save();
        } else {
          continue;
        }

        if (celements.find(c => String(c.course) === String(course) && String(c.student) === String(student._id))) continue;

        const courseElement = new courseElementModel({
          course,
          expert: expert ? expert._id : null,
          student: student._id,
          chat: element[4] || '',
          comment: element[8] || '',
          studentEmail: student.email,
          streamDate: dateFilter(new Date(Math.round((element[6] - 25569) * 86400 * 1000))),
        });
        
        arrayCourses = [...arrayCourses, courseElement];
      }
    }

    if (arrayCourses.length === 0) return response(res, STATUSES.CONFLICT, false, constants.TEMPLATE_ERROR);

    await courseElementModel.insertMany(arrayCourses);
    await userModel.insertMany(array);

    for (const student of emailArray) {
      sendEmail(__dirname + '/../student/templates/createStudentAccount.html', { password: student.password, email: student.email }, student.email, constants.CREATE_ACCOUNT);
    }
    createAction(res.locals.user._id, `Добавление студентов [${array.map(s => s.email).join(', ')}]`, 'STUDENT_ADDED');

    let data = await courseElementModel.find({ student: {$ne: undefined} }, null, { limit: 15, sort: { updatedAt: -1 } })
      .populate('student')
      .populate('expert')
      .populate('course')
      .lean();

    const total = await courseElementModel.countDocuments();
    getsResponse(res, STATUSES.OK, true, constants.UPLOAD_SUCCESS, data, total);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { createQuestionnaireExcel, createInstrumentsExcel, downloadStudents, importStudentList, createStudentFile }