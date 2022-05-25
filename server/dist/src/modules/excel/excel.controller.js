"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importStudentList = exports.downloadStudents = exports.createStudentFile = exports.createInstrumentsExcel = exports.createQuestionnaireExcel = void 0;
const excel4node_1 = __importDefault(require("excel4node"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const questionnaire_model_1 = __importDefault(require("../questionnaire/questionnaire.model"));
const investment_model_1 = __importDefault(require("../investment/investment.model"));
const courseElement_model_1 = __importDefault(require("../courseElement/courseElement.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const files_model_1 = __importDefault(require("../files/files.model"));
const course_model_1 = __importDefault(require("../course/course.model"));
const actions_controller_1 = require("../actions/actions.controller");
const email_1 = __importDefault(require("../email"));
const handler_1 = __importDefault(require("../../utils/handler"));
const date_filter_1 = __importDefault(require("../../utils/date.filter"));
const password_1 = require("../../utils/password");
const enums_1 = require("../../utils/enums");
const response_1 = require("../../utils/response");
const excel_constants_1 = __importDefault(require("./excel.constants"));
const createQuestionnaireExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const user = yield user_model_1.default.findById(res.locals.user._id).lean();
        const wb = new excel4node_1.default.Workbook();
        const ws = wb.addWorksheet('Отчёты');
        const titles = excel_constants_1.default.TITLE_CREATE_QUESTIONNAIRE_XLSX;
        const statuses = excel_constants_1.default.QUESTIONNAIRE_STATUSES;
        const options = req.body;
        if (user.role === enums_1.ROLES.EXPERT && user.accesses.indexOf(enums_1.ROLES.EXPERT) === -1)
            options.expert = res.locals.user._id;
        const data = yield questionnaire_model_1.default
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
        const one = data.filter(q => q.course.type === enums_1.COURSES.ONE);
        const two = data.filter(q => q.course.type === enums_1.COURSES.TWO);
        one.forEach((questionnaire, index) => {
            ws.cell(index + 2, 1).string(questionnaire.student ? questionnaire.student.email : '');
            ws.cell(index + 2, 2).string(questionnaire.expert ? questionnaire.expert.name : questionnaire.prevExpert + ' *');
            ws.cell(index + 2, 3).string(questionnaire.course.name);
            ws.cell(index + 2, 4).string(questionnaire.streamDate);
            ws.cell(index + 2, 5).string(questionnaire.createdAt ? (0, date_filter_1.default)(questionnaire.createdAt) : '');
            ws.cell(index + 2, 6).string(questionnaire.sentedAt ? (0, date_filter_1.default)(questionnaire.sentedAt) : '');
            ws.cell(index + 2, 7).string(questionnaire.completedAt ? (0, date_filter_1.default)(questionnaire.completedAt) : '');
            ws.cell(index + 2, 8).string(statuses[questionnaire.status]);
        });
        two.forEach((questionnaire, index) => {
            ws.cell(one.length + index + 3, 1).string(questionnaire.student ? questionnaire.student.email : '');
            ws.cell(one.length + index + 3, 2).string(questionnaire.expert ? questionnaire.expert.name : questionnaire.prevExpert + ' *');
            ws.cell(one.length + index + 3, 3).string(questionnaire.course.name);
            ws.cell(one.length + index + 3, 4).string(questionnaire.streamDate);
            ws.cell(one.length + index + 3, 5).string(questionnaire.createdAt ? (0, date_filter_1.default)(questionnaire.createdAt) : '');
            ws.cell(one.length + index + 3, 6).string(questionnaire.sentedAt ? (0, date_filter_1.default)(questionnaire.sentedAt) : '');
            ws.cell(one.length + index + 3, 7).string(questionnaire.completedAt ? (0, date_filter_1.default)(questionnaire.completedAt) : '');
            ws.cell(one.length + index + 3, 8).string(statuses[questionnaire.status]);
        });
        wb.write(`Отчёты.xlsx`, res);
    }
    catch (err) {
        console.log(err);
        (0, handler_1.default)(res, err);
    }
});
exports.createQuestionnaireExcel = createQuestionnaireExcel;
const createInstrumentsExcel = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wb = new excel4node_1.default.Workbook();
        const ws = wb.addWorksheet('Инструменты');
        const titles = excel_constants_1.default.TITLE_CREATE_INSTRUMENT_XLSX;
        const data = yield investment_model_1.default.find().sort({ class: 1 }).lean();
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
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.createInstrumentsExcel = createInstrumentsExcel;
function getCorrectStatus(status) {
    return enums_1.CORSES_STATUSES_NAME[status];
}
const createStudentFile = (req, res, questionnaire) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wb = new excel4node_1.default.Workbook();
        const ws = wb.addWorksheet('Основной портфель');
        const titles = excel_constants_1.default.TITLE_CREATE_STUDENT_INSTRUMENT_XLSX;
        const course = questionnaire.course.type;
        const targets = questionnaire.content_STUDENT.targets.data.length;
        const colors = ['#DDEBF7', '#E2F0D9', '#FBE4D6'];
        let defaultPadding = course === enums_1.COURSES.ONE ? 3 : 0;
        if (course === enums_1.COURSES.ONE) {
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
        questionnaire.content_STUDENT.targets.data.forEach((target, index) => {
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
                const coreLength = target.portfolios[portfolioId].sections[1].modules.filter((m) => m.data.name && m.data.price).length;
                const tacticLength = target.portfolios[portfolioId].sections[2].modules.filter((m) => m.data.name && m.data.price).length;
                totalLength += index + 1;
                ws.cell(totalLength, 1).string(portfolioId === 'existing' ? 'Стартовый портфель' : 'Основной портфель');
                totalLength += 1;
                target.portfolios[portfolioId].sections[1].modules.filter((m) => m.data.name && m.data.price).forEach((m, indexModule) => {
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
                target.portfolios[portfolioId].sections[2].modules.filter((m) => m.data.name && m.data.price).forEach((m, indexModule) => {
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
        const courseElement = yield courseElement_model_1.default.findOne({ student: questionnaire.student, course: questionnaire.course._id });
        let fileStudent = yield files_model_1.default.findOne({ questionnaire: questionnaire._id, type: enums_1.FILES.DOCUMENT, owner: res.locals.user._id });
        if (!fileStudent) {
            fileStudent = new files_model_1.default({
                questionnaire: questionnaire._id,
                type: enums_1.FILES.DOCUMENT,
                owner: res.locals.user._id,
                src: '/upload/studentFiles/' + questionnaire._id + '.xlsx',
                courseElement: courseElement._id
            });
        }
        else {
            fileStudent.src = '/upload/studentFiles/' + questionnaire._id + '.xlsx';
            fileStudent.courseElement = courseElement._id;
        }
        courseElement.fileStudent = fileStudent;
        yield fileStudent.save();
        yield courseElement.save();
    }
    catch (err) {
        console.log(err);
        (0, handler_1.default)(res, err);
    }
});
exports.createStudentFile = createStudentFile;
const downloadStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const wb = new excel4node_1.default.Workbook();
        const ws = wb.addWorksheet('Студенты');
        const titles = excel_constants_1.default.TITLE_CREATE_STUDENTS_XLSX;
        const query = Object.assign({}, req.body);
        const filters = { sort: { sentedAt: -1 } };
        if (res.locals.user.role === enums_1.ROLES.EXPERT)
            query.expert = res.locals.user._id;
        const data = yield courseElement_model_1.default
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
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.downloadStudents = downloadStudents;
const importStudentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, excel_constants_1.default.NOT_FOUND_FILE);
        const courses = yield course_model_1.default.find().lean();
        let students = yield user_model_1.default.find({ role: enums_1.ROLES.STUDENT });
        let celements = yield courseElement_model_1.default.find().lean();
        const experts = yield user_model_1.default.find({ role: enums_1.ROLES.EXPERT }).lean();
        const excel = node_xlsx_1.default.parse(req.file.buffer);
        let array = [], arrayCourses = [], emailArray = [];
        let valid = false;
        for (let i = 0; i < excel[0].data.length; i++) {
            const element = excel[0].data[i];
            if (!valid && String(element[0]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === '#' && String(element[1]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'студент' && String(element[2]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'эксперт' && String(element[3]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'пароль' && String(element[4]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'номер чата' && String(element[5]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'курс' && String(element[6]).trim().toLowerCase().replace(/\s{2,}/g, ' ') === 'дата потока')
                valid = true;
            if (!isNaN(+element[0]) && valid) {
                const expert = experts.find(expert => expert.name.includes(element[2]));
                let student = {};
                const candicate = students.find(s => s.email.trim().toLowerCase() === element[1].trim().toLowerCase());
                if (!element[5])
                    return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, excel_constants_1.default.COURSE_NOT_FOUND);
                const course = element[5].includes('Капитал') ?
                    courses.find(c => c.type === enums_1.COURSES.ONE)._id :
                    courses.find(c => c.type === enums_1.COURSES.TWO)._id;
                const password = element[3] ? (0, password_1.create)(String(element[3])) : null;
                if (!candicate) {
                    student = new user_model_1.default({
                        email: element[1].toLowerCase().trim(),
                        role: enums_1.ROLES.STUDENT,
                        phone: element[7] || '',
                        password,
                        course
                    });
                    students = [...students, student];
                    array = [...array, student];
                    emailArray = [...emailArray, { email: student.email, password: String(element[3] || '') }];
                }
                else if (String(candicate.course) !== String(course)) {
                    student = candicate;
                    candicate.courses = true;
                    yield candicate.save();
                }
                else {
                    continue;
                }
                if (celements.find(c => String(c.course) === String(course) && String(c.student) === String(student._id)))
                    continue;
                const courseElement = new courseElement_model_1.default({
                    course,
                    expert: expert ? expert._id : null,
                    student: student._id,
                    chat: element[4] || '',
                    comment: element[8] || '',
                    studentEmail: student.email,
                    streamDate: (0, date_filter_1.default)(new Date(Math.round((element[6] - 25569) * 86400 * 1000))),
                });
                arrayCourses = [...arrayCourses, courseElement];
            }
        }
        if (arrayCourses.length === 0)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, excel_constants_1.default.TEMPLATE_ERROR);
        yield courseElement_model_1.default.insertMany(arrayCourses);
        yield user_model_1.default.insertMany(array);
        for (const student of emailArray) {
            (0, email_1.default)(__dirname + '/../student/templates/createStudentAccount.html', { password: student.password, email: student.email }, student.email, excel_constants_1.default.CREATE_ACCOUNT);
        }
        (0, actions_controller_1.createAction)(res.locals.user._id, `Добавление студентов [${array.map(s => s.email).join(', ')}]`, 'STUDENT_ADDED');
        let data = yield courseElement_model_1.default.find({ student: { $ne: undefined } }, null, { limit: 15, sort: { updatedAt: -1 } })
            .populate('student')
            .populate('expert')
            .populate('course')
            .lean();
        const total = yield courseElement_model_1.default.countDocuments();
        (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, excel_constants_1.default.UPLOAD_SUCCESS, data, total);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.importStudentList = importStudentList;
exports.default = { createQuestionnaireExcel: exports.createQuestionnaireExcel, createInstrumentsExcel: exports.createInstrumentsExcel, downloadStudents: exports.downloadStudents, importStudentList: exports.importStudentList, createStudentFile: exports.createStudentFile };
//# sourceMappingURL=excel.controller.js.map