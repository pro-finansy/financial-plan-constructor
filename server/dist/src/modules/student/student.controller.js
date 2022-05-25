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
exports.deleteStudents = exports.deleteStudentFile = exports.deleteStudent = exports.changeStreamDate = exports.changePassword = exports.changeExpertListStudents = exports.changeExpertStudents = exports.changeExpert = exports.changeStudent = exports.createStudent = exports.downloadExpertFile = exports.downloadStudentFile = exports.getStudentQuestionnaires = exports.getCourseElement = exports.getStudentList = void 0;
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("../user/user.model"));
const courseElement_model_1 = __importDefault(require("../courseElement/courseElement.model"));
const questionnaire_model_1 = __importDefault(require("../questionnaire/questionnaire.model"));
const files_model_1 = __importDefault(require("../files/files.model"));
const actions_controller_1 = require("../actions/actions.controller");
const email_1 = __importDefault(require("../email"));
const response_1 = require("../../utils/response");
const defines_1 = require("../../utils/defines");
const enums_1 = require("../../utils/enums");
const password_1 = require("../../utils/password");
const handler_1 = __importDefault(require("../../utils/handler"));
const student_contants_1 = __importDefault(require("./student.contants"));
const getStudentList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {
                sort: { updatedAt: -1 }
            };
            (0, defines_1.definePagination)(filters, req.query);
            const query = { student: { $ne: undefined } };
            const queryVariables = ['expert', 'course', 'status', 'streamDate'];
            const moreQueries = {};
            const search = String(req.query.search) || '';
            (0, defines_1.defineSearchEmail)(query, search);
            (0, defines_1.defineSearchDates)(req.query, query, ['sentedAt', 'completedAt']);
            const cyrrilic = search.trim().match("[а-яА-Я\s]+$");
            if (cyrrilic)
                moreQueries.studentName = { '$regex': search.trim().toLowerCase(), '$options': 'i' };
            for (const variable of queryVariables) {
                if (req.query[variable])
                    query[variable] = req.query[variable];
            }
            if (req.query.fileStudent)
                query.fileStudent = req.query.fileStudent === 'present' ? { $ne: undefined } : undefined;
            if (req.query.fileExpert)
                query.fileExpert = req.query.fileExpert === 'present' ? { $ne: undefined } : undefined;
            if (res.locals.user.role === enums_1.ROLES.EXPERT && !res.locals.user.accesses.includes(enums_1.ROLES.EXPERT))
                query.expert = res.locals.user._id;
            if (moreQueries.studentName) {
                const students = yield user_model_1.default.find({ role: enums_1.ROLES.STUDENT, name: moreQueries.studentName }).select('_id').lean();
                query.student = { $in: students.map(s => s._id) };
            }
            const data = yield courseElement_model_1.default.find(query, null, filters)
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
            const total = yield courseElement_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getStudentList = getStudentList;
const getCourseElement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield courseElement_model_1.default
            .findOne({ student: req.params._id })
            .populate('course')
            .populate('fileExpert')
            .populate('fileStudent')
            .lean();
        if (!data)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.COURSE_NOT_FOUND);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.getCourseElement = getCourseElement;
const getStudentQuestionnaires = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = { student: res.locals.user._id };
            (0, defines_1.defineSearchDates)(req.query, query, ['sentedAt']);
            const data = yield questionnaire_model_1.default
                .find(query, null, { sort: { createdAt: -1 } })
                .select('course expert fileStudent fileExpert status content_STUDENT.targets updatedAt sentedAt completedAt')
                .populate('course')
                .populate('expert')
                .lean();
            const courseElements = yield courseElement_model_1.default
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
            const total = yield courseElement_model_1.default.countDocuments({ student: res.locals.user._id });
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getStudentQuestionnaires = getStudentQuestionnaires;
const downloadStudentFile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseElement = yield courseElement_model_1.default
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
            if (!courseElement)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.NOT_FOUND);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, courseElement);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.downloadStudentFile = downloadStudentFile;
const downloadExpertFile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseElement = yield courseElement_model_1.default
                .findById(req.body._id)
                .populate('fileExpert');
            if (!courseElement)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.NOT_FOUND);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, courseElement.fileExpert);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.downloadExpertFile = downloadExpertFile;
const createStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const checkStudentCourses = (student, course) => __awaiter(this, void 0, void 0, function* () {
                const courses = yield courseElement_model_1.default.find({ studentEmail: student.email });
                return courses.length === 1 && (String(courses[0].course) !== course);
            });
            if (req.body.email && !(0, isEmail_1.default)(req.body.email))
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.UNCORRECT_EMAIL);
            let candidate = yield user_model_1.default.findOne({ email: req.body.email.toLowerCase().trim() });
            const courseElementCandidate = yield courseElement_model_1.default.findOne({ studentEmail: req.body.email.toLowerCase().trim(), course: req.body.course_id });
            if (candidate && courseElementCandidate)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.EXIST_STUDENT);
            const course = req.body.course_id;
            let student = {};
            if (candidate)
                student = candidate;
            else {
                student = new user_model_1.default({
                    email: req.body.email.toLowerCase().trim(),
                    password: (0, password_1.create)(req.body.password),
                    role: enums_1.ROLES.STUDENT,
                    course,
                });
            }
            student.courses = yield checkStudentCourses(student, req.body.course_id);
            const courseElement = new courseElement_model_1.default({
                course,
                expert: req.body.expert_id,
                student: student,
                chat: req.body.chat,
                studentEmail: student.email,
                streamDate: req.body.streamDate
            });
            yield student.save();
            yield courseElement.save();
            const result = yield courseElement_model_1.default
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
            (0, email_1.default)(student_contants_1.default.SRC_STUDENT_CREATE_ACCOUNT, { password: req.body.password, email: student.email }, student.email, student_contants_1.default.TITLE_STUDENT_CREATE_ACCOUNT);
            (0, actions_controller_1.createAction)(res.locals.user._id, `Создание студента ${result.student.email}, курс "${result.course.name}"`, 'STUDENT_CREATE');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, result);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.createStudent = createStudent;
const changeStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate = yield courseElement_model_1.default.findOne({ studentEmail: req.body.email, course: req.body.course_id, _id: { $ne: req.body._id } });
            if (candidate)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.EXIST_STUDENT);
            const result = yield courseElement_model_1.default.findByIdAndUpdate(req.body._id, { expert: req.body.expert_id, studentEmail: req.body.email, chat: req.body.chat, streamDate: req.body.streamDate, course: req.body.course_id }, { new: true })
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
            (0, actions_controller_1.createAction)(res.locals.user._id, `Редактирование данных студента ${result.student.email} на [Поток: ${req.body.streamDate}, Курс: ${result.course.name}, Чат: ${req.body.chat}, Эксперт: ${result.expert.name}]`, 'STUDENT_EDIT');
            yield user_model_1.default.findByIdAndUpdate(result.student._id, { email: req.body.email });
            yield questionnaire_model_1.default.updateMany({ $or: [{ student: result.student._id }, { 'content_EXPERT.student.data.module.data.email': result.student.email }], course: result.course._id }, { expert: req.body.expert_id });
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.STUDENT_EDITED, result);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeStudent = changeStudent;
const changeExpert = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield courseElement_model_1.default.findByIdAndUpdate(req.body._id, { expert: req.body.expert_id }, { new: true })
                .populate('expert')
                .populate('student')
                .populate('course')
                .populate({ path: 'questionnaire', select: 'status' });
            if (result) {
                (0, actions_controller_1.createAction)(res.locals.user._id, `Перенос работ студента ${result.student.email} на ${result.expert.name}`, 'CHANGE_EXPERT');
                yield questionnaire_model_1.default.updateMany({ $or: [{ student: result.student._id }, { 'content_EXPERT.student.data.module.data.email': result.student.email }], course: result.course._id }, { expert: req.body.expert_id });
            }
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.EXPERT_CHANGED, result);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeExpert = changeExpert;
const changeExpertStudents = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(req.body.expert_id) === String(req.body.change_expert_id))
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.CHANGE_EXPERT_ERROR);
            yield courseElement_model_1.default.updateMany({ expert: req.body.expert_id }, { expert: req.body.change_expert_id });
            yield questionnaire_model_1.default.updateMany({ expert: req.body.expert_id }, { expert: req.body.change_expert_id });
            const experts = yield user_model_1.default.find({ role: enums_1.ROLES.EXPERT }).select('name');
            (0, actions_controller_1.createAction)(res.locals.user._id, `Перенос всех работ студентов с ${experts.find(e => String(e._id) === String(req.body.expert_id)).name} на ${experts.find(e => String(e._id) === String(req.body.change_expert_id)).name}`, 'CHANGE_EXPERT');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.EXPERT_CHANGED, req.body);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeExpertStudents = changeExpertStudents;
const changeExpertListStudents = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(req.body.expert_id) === String(req.body.change_expert_id))
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.CHANGE_EXPERT_ERROR);
            if (!req.file)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.NOT_FOUND_FILE);
            const excel = node_xlsx_1.default.parse(req.file.buffer);
            let array = [];
            let valid = false;
            for (let i = 0; i < excel[0].data.length; i++) {
                const element = excel[0].data[i];
                if (valid && element[0]) {
                    array = [...array, element[0]];
                }
                if (element[0] === 'Студент')
                    valid = true;
            }
            if (array.length === 0)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.TEMPLATE_ERROR);
            yield courseElement_model_1.default.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });
            yield questionnaire_model_1.default.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });
            req.body.array = array;
            const experts = yield user_model_1.default.find({ role: enums_1.ROLES.EXPERT }).select('name');
            (0, actions_controller_1.createAction)(res.locals.user._id, `Перенос всех работ студентов [${array.join(', ')}] с ${experts.find(e => String(e._id) === String(req.body.expert_id)).name} на ${experts.find(e => String(e._id) === String(req.body.change_expert_id)).name}`, 'CHANGE_EXPERT');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, 'Работы перемещены!', req.body);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeExpertListStudents = changeExpertListStudents;
const changePassword = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseElement = yield courseElement_model_1.default.findById(req.body._id).populate('student');
            if (!courseElement)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.NOT_FOUND);
            yield user_model_1.default.findByIdAndUpdate(courseElement.student, { password: (0, password_1.create)(req.body.password), token: null, reset: null });
            (0, actions_controller_1.createAction)(res.locals.user._id, `Смена пароля студента ${courseElement.student.email}`, 'STUDENT_PASSWORD');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changePassword = changePassword;
const changeStreamDate = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const streamArray = req.body.streamDate.split('.');
            if (streamArray.length !== 3 || +streamArray[0] > 31 || +streamArray[0] < 1 || +streamArray[1] > 12 || +streamArray[1] < 1 || +streamArray[2] > 2030 || +streamArray[2] < 2021) {
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.UNCORRECT_DATE);
            }
            const result = yield courseElement_model_1.default.findByIdAndUpdate(req.body._id, { streamDate: req.body.streamDate }, { new: true })
                .populate('expert')
                .populate('student')
                .populate('course');
            (0, actions_controller_1.createAction)(res.locals.user._id, `Смена потока курса студента ${result.student.email} на ${req.body.streamDate}`, 'STUDENT_STREAM_DATE');
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.STREAM_EDITED, result);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.changeStreamDate = changeStreamDate;
const deleteStudent = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseElement = yield courseElement_model_1.default.findById(req.params._id).populate('student').populate('course');
            if (!courseElement)
                return (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.REMOVED_STUDENT, req.params._id);
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление студента ${courseElement.student.email}, курс "${courseElement.course.name}"`, 'STUDENT_DELETE');
            yield courseElement.remove();
            const courses = yield courseElement_model_1.default.find({ student: courseElement.student });
            if (courses.length === 0) {
                yield user_model_1.default.deleteOne({ _id: courseElement.student });
            }
            else {
                yield user_model_1.default.findByIdAndUpdate(courseElement.student, { courses: false });
            }
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.REMOVED_STUDENT, req.params._id);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteStudent = deleteStudent;
const deleteStudentFile = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courseElement = yield courseElement_model_1.default.findByIdAndUpdate(req.params._id, { status: 'NOTSENT', fileStudent: null }, { new: true })
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
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление файла студента ${courseElement.student.email}`, 'STUDENT_DELETE_FILE');
            const file = yield files_model_1.default.findOneAndRemove({ courseElement: courseElement._id });
            if (file) {
                const link = process.env.FILE_FOUND + file.src;
                if (fs_1.default.existsSync(link))
                    fs_1.default.unlinkSync(link);
            }
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.REMOVED_STUDENT, courseElement);
        }
        catch (err) {
            console.log(err);
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteStudentFile = deleteStudentFile;
const deleteStudents = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, student_contants_1.default.NOT_FOUND_FILE);
            const excel = node_xlsx_1.default.parse(req.file.buffer);
            let array = [];
            let valid = false;
            for (let i = 0; i < excel[0].data.length; i++) {
                const element = excel[0].data[i];
                if (valid && element[0]) {
                    array = [...array, element[0]];
                }
                if (element[0] === 'Студент')
                    valid = true;
            }
            if (array.length === 0)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, student_contants_1.default.TEMPLATE_ERROR);
            yield courseElement_model_1.default.deleteMany({ studentEmail: { $in: array } });
            yield user_model_1.default.deleteMany({ email: { $in: array } });
            // await questionnaireModel.updateMany({ expert: req.body.expert_id, studentEmail: { $in: array } }, { expert: req.body.change_expert_id });
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление студентов [${array.join(', ')}]`, 'STUDENT_DELETE');
            req.body.array = array;
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, student_contants_1.default.REMOVED_STUDENTS, req.body);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.deleteStudents = deleteStudents;
exports.default = { getStudentList: exports.getStudentList, getCourseElement: exports.getCourseElement, getStudentQuestionnaires: exports.getStudentQuestionnaires, downloadExpertFile: exports.downloadExpertFile, downloadStudentFile: exports.downloadStudentFile, createStudent: exports.createStudent, changeStreamDate: exports.changeStreamDate, changeStudent: exports.changeStudent, changeExpert: exports.changeExpert, changeExpertStudents: exports.changeExpertStudents, changeExpertListStudents: exports.changeExpertListStudents, changePassword: exports.changePassword, deleteStudent: exports.deleteStudent, deleteStudentFile: exports.deleteStudentFile, deleteStudents: exports.deleteStudents };
//# sourceMappingURL=student.controller.js.map