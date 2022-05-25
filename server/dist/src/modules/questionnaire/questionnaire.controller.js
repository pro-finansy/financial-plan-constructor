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
exports.first = exports.deleteQuestionnaire = exports.removeTacticFile = exports.editTacticFile = exports.finishQuestionnaire = exports.editQuestionnaire = exports.uncombineQuestionnaire = exports.combineQuestionnaire = exports.studentQuestionnaire = exports.stopQuestionnaire = exports.verificationQuestionnaire = exports.createQuestionnaire = exports.saveModeError = exports.saveMode = exports.collectionQuestionnaire = exports.sendQuestionnaire = exports.saveOnePageQuestionnaire = exports.saveQuestionnaire = exports.fileQuestionnaire = exports.createQuestionnaireFile = exports.getExpertReadyQuestionnaires = exports.getExpertProcessQuestionnaires = exports.getExpertNotVerifiedQuestionnaires = exports.getPaginationQuestionnairesArchive = exports.getPaginationQuestionnaires = exports.getQuestionnaire = void 0;
const mongodb_1 = require("mongodb");
const fs_1 = __importDefault(require("fs"));
const questionnaire_model_1 = __importDefault(require("./questionnaire.model"));
const mixed_model_1 = __importDefault(require("../mixedAssets/mixed.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const files_model_1 = __importDefault(require("../files/files.model"));
const courseElement_model_1 = __importDefault(require("../courseElement/courseElement.model"));
const excel_controller_1 = require("../excel/excel.controller");
const actions_controller_1 = require("../actions/actions.controller");
const exchange_controller_1 = require("../exchange/exchange.controller");
const investment_controller_1 = require("../investment/investment.controller");
const email_1 = __importDefault(require("../email"));
const date_filter_1 = __importDefault(require("../../utils/date.filter"));
const response_1 = require("../../utils/response");
const defines_1 = require("../../utils/defines");
const enums_1 = require("../../utils/enums");
const password_1 = require("../../utils/password");
const handler_1 = __importDefault(require("../../utils/handler"));
const questionnaire_constants_1 = __importDefault(require("./questionnaire.constants"));
const questionnaire_before_1 = __importDefault(require("./modules/questionnaire.before"));
const questionnaire_pdf_1 = require("./modules/questionnaire.pdf");
const questionnaire_content_1 = require("./modules/questionnaire.content");
const getQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default.findById(req.params._id)
            .populate("course")
            .populate({
            path: "expert",
            populate: {
                path: "avatar",
            },
        })
            .populate('files');
        if (res.locals.user.role === enums_1.ROLES.EXPERT && !req.query.pivot && data.owner === enums_1.ROLES.STUDENT && data.content_EXPERT) {
            if (data.status === enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED) {
                if (data.course.type === enums_1.COURSES.ONE) {
                    yield questionnaire_before_1.default.getCurrentPrices(data);
                }
                questionnaire_before_1.default.getCurrentFV(data);
                questionnaire_before_1.default.fixInstruments(data);
                yield questionnaire_before_1.default.collectionComments(data, res.locals.user._id);
                yield questionnaire_before_1.default.fillInstruments(data, res.locals.user._id);
                yield data.save();
            }
            if (data.course.type === enums_1.COURSES.TWO) {
                questionnaire_before_1.default.getCurrentPercents(data);
            }
            if (data.course.type === enums_1.COURSES.ONE) {
                // Временно
                questionnaire_before_1.default.fixSections(data);
            }
            (0, exchange_controller_1.fillMatDate)(data);
        }
        if (data.status === enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED && res.locals.user.role === enums_1.ROLES.EXPERT && !req.query.pivot) {
            data.status = enums_1.QUESTIONNAIRE_STATUSES.PROCESS;
            yield courseElement_model_1.default.findOneAndUpdate({ questionnaire: req.params._id }, { status: enums_1.QUESTIONNAIRE_STATUSES.PROCESS });
        }
        if (!data)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.getQuestionnaire = getQuestionnaire;
const getPaginationQuestionnaires = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = { sort: { createdAt: -1 } };
            const query = { prevExpert: undefined };
            const queryVariables = ['expert', 'course', 'status', 'streamDate'];
            (0, defines_1.defineSearchEmail)(query, String(req.query.search));
            (0, defines_1.definePagination)(filters, req.query);
            (0, defines_1.defineSearchDates)(req.query, query, ['completedAt', 'sentedAt']);
            for (const variable of queryVariables) {
                if (req.query[variable])
                    query[variable] = req.query[variable];
            }
            let data = yield questionnaire_model_1.default.find(query, {}, filters)
                .populate("expert")
                .populate("course")
                .populate("student")
                .select("completedAt sentedAt createdAt student date expert prevExpert seconds status course streamDate studentEmail _id content_EXPERT.student")
                .lean()
                .allowDiskUse(true);
            const total = yield questionnaire_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getPaginationQuestionnaires = getPaginationQuestionnaires;
const getPaginationQuestionnairesArchive = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = { sort: { createdAt: -1 } };
            const query = { prevExpert: { $ne: undefined } };
            const queryVariables = ['course', 'status', 'streamDate'];
            (0, defines_1.defineSearchEmail)(query, String(req.query.search));
            (0, defines_1.defineSearchDates)(req.query, query, ['completedAt']);
            (0, defines_1.definePagination)(filters, req.query);
            for (const variable of queryVariables) {
                if (req.query[variable])
                    query[variable] = req.query[variable];
            }
            let data = yield questionnaire_model_1.default.find(query, {}, filters)
                .populate("expert")
                .populate("course")
                .populate("student")
                .select("completedAt createdAt student date expert prevExpert seconds status course streamDate studentEmail _id content_EXPERT.student")
                .lean()
                .allowDiskUse(true);
            const total = yield questionnaire_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getPaginationQuestionnairesArchive = getPaginationQuestionnairesArchive;
const getExpertNotVerifiedQuestionnaires = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = { sort: { sentedAt: -1 }, limit: 10, skip: 0 };
        const query = {};
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
        (0, defines_1.defineSearchEmail)(query, String(req.query.search));
        (0, defines_1.defineSearchDates)(req.query, query, ['sentedAt']);
        (0, defines_1.definePagination)(filters, req.query);
        if (req.query.streamDate)
            query.streamDate = req.query.streamDate;
        if (req.query.targetLength)
            filters.sort.targets = +req.query.targetLength;
        console.log(query);
        const data = yield questionnaire_model_1.default.aggregate()
            .match(Object.assign({ expert: new mongodb_1.ObjectId(req.params._id), status: enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED }, query))
            .addFields({ targets: { $size: '$content_EXPERT.targets.data' } })
            .sort(filters.sort)
            .skip(filters.skip)
            .limit(filters.limit)
            .lookup({ from: 'users', localField: 'expert', foreignField: '_id', as: 'expert' })
            .lookup({ from: 'users', localField: 'student', foreignField: '_id', as: 'student' })
            .lookup({ from: 'courses', localField: 'course', foreignField: '_id', as: 'course' })
            .project({ 'content_EXPERT.student': 1, targets: 1, completedAt: 1, createdAt: 1, sentedAt: 1, streamDate: 1, date: 1, seconds: 1, status: 1, course: 1, studentEmail: 1, student: 1, owner: 1, expert: 1 })
            .unwind('$expert', '$course', '$student');
        const total = yield questionnaire_model_1.default.countDocuments(Object.assign({ expert: req.params._id, status: enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED }, query));
        (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.getExpertNotVerifiedQuestionnaires = getExpertNotVerifiedQuestionnaires;
const getExpertProcessQuestionnaires = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = { sort: { sentedAt: 1 }, limit: 10, skip: 0 };
        const query = { expert: req.params._id, $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.process }, { status: enums_1.QUESTIONNAIRE_STATUSES.PROCESS }] };
        (0, defines_1.defineSearchEmail)(query, String(req.query.search));
        (0, defines_1.defineSearchDates)(req.query, query, ['sentedAt']);
        (0, defines_1.definePagination)(filters, req.query);
        if (req.query.seconds)
            filters.sort.seconds = Number(req.query.seconds);
        let data = yield questionnaire_model_1.default
            .find(Object.assign({}, query), null, filters)
            .populate("course")
            .populate("student")
            .select("completedAt createdAt sentedAt streamDate date expert seconds status course studentEmail content_EXPERT.student student owner")
            .lean();
        const total = yield questionnaire_model_1.default.countDocuments(Object.assign({ expert: req.params._id, $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.process }, { status: enums_1.QUESTIONNAIRE_STATUSES.PROCESS }] }, query));
        (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.getExpertProcessQuestionnaires = getExpertProcessQuestionnaires;
const getExpertReadyQuestionnaires = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = { sort: {}, limit: 10, skip: 0 };
        const query = { expert: req.params._id, $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }, { status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.ready }] };
        (0, defines_1.defineSearchEmail)(query, String(req.query.search));
        (0, defines_1.defineSearchDates)(req.query, query, ['sentedAt', 'completedAt']);
        (0, defines_1.definePagination)(filters, req.query);
        if (req.query.seconds)
            filters.sort.seconds = Number(req.query.seconds);
        filters.sort.completedAt = -1;
        let data = yield questionnaire_model_1.default
            .find(query, null, filters)
            .populate("course")
            .populate("student")
            .select("completedAt createdAt sentedAt streamDate date expert seconds status course studentEmail content_EXPERT.student student owner")
            .lean();
        const total = yield questionnaire_model_1.default.countDocuments(query);
        (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, data, total);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.getExpertReadyQuestionnaires = getExpertReadyQuestionnaires;
function onCreatePDF(req, res, send = false, collection = false, onresponse = true, onepage = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const assets = yield mixed_model_1.default.find().lean();
        const questionnaire = yield questionnaire_model_1.default.findById(req.body.questionnaire_id)
            .populate("student")
            .populate("course")
            .populate({
            path: "expert",
            populate: "avatar",
        });
        if (!questionnaire)
            return res.status(404).json(questionnaire_constants_1.default.NOT_FOUND);
        const file = yield files_model_1.default.findOne({
            type: enums_1.FILES.DOCUMENT,
            questionnaire: questionnaire._id,
            owner: questionnaire.expert._id,
        });
        if (file && !send && !collection) {
            const currectName = questionnaire.student ? questionnaire.student.email : (questionnaire.content_EXPERT.student.data.module.data.email || 'Отчёт');
            return (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, {
                src: file.src,
                name: `${currectName}.pdf`,
            });
        }
        (0, questionnaire_pdf_1.createQuestionnairePDF)(req, res, questionnaire, assets, collection, onresponse, onepage);
    });
}
function onSendPDF(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const questionnaire = yield questionnaire_model_1.default.findByIdAndUpdate(req.params._id, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }, { new: true })
            .populate("student")
            .populate("course")
            .populate({
            path: "expert",
            populate: "avatar",
        });
        questionnaire.sendedAt = Date.now();
        yield questionnaire.save();
        if (!questionnaire.student) {
            const student = yield user_model_1.default.findOne({ email: questionnaire.content_EXPERT.student.data.module.data.email });
            if (!student)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.STUDENT_NOT_FOUND);
            questionnaire.student = student;
            questionnaire.studentEmail = student.email;
            yield questionnaire.save();
        }
        if (questionnaire.student && questionnaire.expert && questionnaire.course)
            yield courseElement_model_1.default.findOneAndUpdate({ student: questionnaire.student._id, expert: questionnaire.expert._id, course: questionnaire.course._id }, { status: enums_1.COURSES_STATUSES.VERIFIED });
        res.locals.questionnaire = questionnaire;
        res.locals.fileData = { src: `/upload/files/${questionnaire._id}.pdf`, name: `${questionnaire._id}.pdf` };
        yield createQuestionnaireFile(req, res);
        (0, email_1.default)(questionnaire_constants_1.default.SRC_VERIFIED, { expert: res.locals.questionnaire.expert.name }, res.locals.questionnaire.student.email, questionnaire_constants_1.default.TITLE_VERIFIED);
        return (0, response_1.response)(res, enums_1.STATUSES.OK, true, questionnaire_constants_1.default.SENDED_SUCCESS);
    });
}
function createQuestionnaireFile(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let file = yield files_model_1.default.findOne({
            type: enums_1.FILES.DOCUMENT,
            questionnaire: res.locals.questionnaire._id,
            owner: res.locals.questionnaire.expert._id,
        });
        if (file) {
            file.src = res.locals.fileData.src;
        }
        else {
            file = new files_model_1.default({
                type: enums_1.FILES.DOCUMENT,
                owner: res.locals.questionnaire.expert._id,
                src: res.locals.fileData.src,
                questionnaire: res.locals.questionnaire._id
            });
        }
        yield file.save();
        if (res.locals.questionnaire.student && res.locals.questionnaire.expert && res.locals.questionnaire.course)
            yield courseElement_model_1.default.findOneAndUpdate({ student: res.locals.questionnaire.student._id, expert: res.locals.questionnaire.expert._id, course: res.locals.questionnaire.course._id }, { fileExpert: file._id });
    });
}
exports.createQuestionnaireFile = createQuestionnaireFile;
const fileQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = yield files_model_1.default.findOne({
            $or: [{ meta: '' }, { meta: undefined }],
            questionnaire: req.params._id,
            type: enums_1.FILES.DOCUMENT,
            src: { $regex: 'pdf' }
        });
        const questionnaire = yield questionnaire_model_1.default.findById(req.params._id).populate('student');
        if (!file)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.FILE_NOT_FOUND);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, {
            src: file.src,
            name: `${questionnaire.student.email || questionnaire.content_STUDENT.student.data.module.data.email || 'Отчет'}.pdf`,
        });
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.fileQuestionnaire = fileQuestionnaire;
const saveQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        onCreatePDF(req, res);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.saveQuestionnaire = saveQuestionnaire;
const saveOnePageQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        onCreatePDF(req, res, false, true, true, true);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.saveOnePageQuestionnaire = saveOnePageQuestionnaire;
const sendQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        onSendPDF(req, res);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.sendQuestionnaire = sendQuestionnaire;
const collectionQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        onCreatePDF(req, res, false, true);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.collectionQuestionnaire = collectionQuestionnaire;
const saveMode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield questionnaire_model_1.default.findByIdAndUpdate(req.params._id, req.body.data);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.saveMode = saveMode;
const saveModeError = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.err && req.body.err.config && req.body.err.config.data && req.body.questionnaire) {
            const json = JSON.parse(req.body.err.config.data);
            const data = yield questionnaire_model_1.default.findById(req.body.questionnaire).populate('course');
            if (!data)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
            if (data.status === enums_1.QUESTIONNAIRE_STATUSES.PROCESS && res.locals.user.role === enums_1.ROLES.STUDENT)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, questionnaire_constants_1.default.NOT_EDIT);
            const currectContent = 'content_' + (res.locals.user.role === enums_1.ROLES.OWNER ? enums_1.ROLES.EXPERT : res.locals.user.role);
            data.updatedAt = Date.now();
            if (json && json[currectContent]) {
                if (res.locals.user.role === enums_1.ROLES.EXPERT)
                    data.seconds = json.seconds;
                data[currectContent] = json[currectContent];
                data.markModified(currectContent);
            }
            yield data.save();
        }
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.saveModeError = saveModeError;
const createQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default
            .findById(res.locals.user._id)
            .populate('course')
            .lean();
        const courseElement = yield courseElement_model_1.default
            .findOne({ student: res.locals.user._id, course: user.course._id })
            .populate('course')
            .lean();
        if (courseElement && courseElement.status !== enums_1.COURSES_STATUSES.NOTSENT)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, questionnaire_constants_1.default.ALREADY_UPLOAD);
        req.body.owner = res.locals.user.role;
        req.body.course = user.course._id;
        req.body.streamDate = courseElement ? courseElement.streamDate : (0, date_filter_1.default)(Date.now());
        if (res.locals.user.role === enums_1.ROLES.STUDENT) {
            req.body.student = user._id;
            req.body.studentEmail = user.email;
        }
        else if (res.locals.user.role === enums_1.ROLES.EXPERT) {
            req.body.status = enums_1.QUESTIONNAIRE_STATUSES.process;
            req.body.version = enums_1.QUESTIONNAIRE_VERSIONS.OLD;
        }
        req.body.expert = courseElement ? courseElement.expert : res.locals.user._id;
        const data = new questionnaire_model_1.default(req.body);
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.createQuestionnaire = createQuestionnaire;
const verificationQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default
            .findById(req.params._id)
            .populate('expert')
            .populate('course');
        if (!data)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
        if (data.status !== enums_1.QUESTIONNAIRE_STATUSES.NOTSENT && data.status !== enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED)
            return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, questionnaire_constants_1.default.NOT_EDIT);
        const courses = yield courseElement_model_1.default.find({ student: res.locals.user._id, status: { $ne: enums_1.COURSES_STATUSES.NOTSENT }, course: data.course._id, questionnaire: { $ne: data._id } }).lean();
        if (courses.length > 0)
            return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, questionnaire_constants_1.default.ALREADY_UPLOAD);
        if (req.body && req.body.content_STUDENT) {
            (0, questionnaire_content_1.editContents)(req, data, res.locals.user.email);
            yield courseElement_model_1.default.findOneAndUpdate({ student: data.student, course: data.course._id }, { questionnaire: data._id, status: enums_1.COURSES_STATUSES.SENT, sentedAt: Date.now() });
            yield (0, questionnaire_content_1.fillExpertContent)(JSON.parse(JSON.stringify(req.body.content_STUDENT)), data);
            yield (0, excel_controller_1.createStudentFile)(req, res, data);
            if (!data.sentedAt)
                data.sentedAt = Date.now();
        }
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, questionnaire_constants_1.default.SENDED_SUCCESS, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.verificationQuestionnaire = verificationQuestionnaire;
const stopQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.locals.save = true;
        (0, exports.editQuestionnaire)(req, res);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.stopQuestionnaire = stopQuestionnaire;
const studentQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield questionnaire_model_1.default.findByIdAndUpdate(req.params._id, req.body);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.studentQuestionnaire = studentQuestionnaire;
const combineQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default
            .findById(req.params._id)
            .populate("course")
            .populate("student")
            .populate("expert");
        data.content_COMBINE_EXPERT = req.body.content_COMBINE_EXPERT;
        data.content_COMBINE_STUDENT = req.body.content_COMBINE_STUDENT;
        data.markModified('content_COMBINE_EXPERT');
        data.markModified('content_COMBINE_STUDENT');
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.combineQuestionnaire = combineQuestionnaire;
const uncombineQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default
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
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.uncombineQuestionnaire = uncombineQuestionnaire;
const editQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default
            .findById(req.params._id)
            .populate("course")
            .populate("student")
            .populate("expert");
        const currectContent = 'content_' + res.locals.user.role;
        if (!data)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
        if (data.status === enums_1.QUESTIONNAIRE_STATUSES.PROCESS && res.locals.user.role === enums_1.ROLES.STUDENT)
            return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, questionnaire_constants_1.default.NOT_EDIT);
        function getInstrumentsLength(portfolios) {
            let length = 0;
            const portfolio_id = ['existing', 'student'];
            const sections = [1, 2];
            for (const pid of portfolio_id) {
                for (const section of sections) {
                    length += portfolios[pid].sections[section].modules.length;
                }
            }
            return length;
        }
        if (res.locals.user.role === enums_1.ROLES.STUDENT) {
            const requestLength = getInstrumentsLength(req.body[currectContent].targets.data[0].portfolios);
            const dataLength = getInstrumentsLength(data[currectContent].targets.data[0].portfolios);
            if (dataLength - requestLength >= 12) {
                return (0, response_1.response)(res, enums_1.STATUSES.BAD_REQUEST, false, questionnaire_constants_1.default.EDIT_ERROR_LENGTH);
            }
        }
        if (!data.content_EXPERT && data.owner === enums_1.ROLES.STUDENT && res.locals.user.role === enums_1.ROLES.EXPERT) {
            req.body.content_EXPERT = data.content_STUDENT;
        }
        if (data.owner === enums_1.ROLES.STUDENT && res.locals.user.role === enums_1.ROLES.STUDENT && data.status === enums_1.QUESTIONNAIRE_STATUSES.NOTVERIFIED) {
            (0, questionnaire_content_1.editContents)(req, data, res.locals.user.email);
        }
        if (req.body && req.body[currectContent]) {
            if (res.locals.user.role === enums_1.ROLES.EXPERT) {
                data.seconds = req.body.seconds;
            }
            data[currectContent] = req.body[currectContent];
            data.markModified(currectContent);
        }
        if (res.locals.save && res.locals.user.role === enums_1.ROLES.EXPERT) {
            saveInstruments(res, req.body.content_EXPERT.targets.data, data, false);
        }
        data.updatedAt = Date.now();
        yield data.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.editQuestionnaire = editQuestionnaire;
const finishQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questionnaire_model_1.default
            .findById(req.params._id)
            .populate("course")
            .populate("student")
            .populate({
            path: "expert",
            populate: {
                path: "avatar",
            },
        });
        if (!data)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
        if (req.body && req.body.content_EXPERT) {
            data.seconds = req.body.seconds;
            data.content_EXPERT = req.body.content_EXPERT;
            data.markModified('content_EXPERT');
        }
        yield data.save();
        saveInstruments(res, req.body.content_EXPERT.targets.data, data);
        req.body.questionnaire_id = data._id;
        onCreatePDF(req, res, false, true, false);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.finishQuestionnaire = finishQuestionnaire;
const editTacticFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionnaire = yield questionnaire_model_1.default.findById(req.params._id);
        const fileLength = yield files_model_1.default.countDocuments({ questionnaire: questionnaire._id, meta: { $regex: `${req.query.targetId}-${req.query.portfolioId}`, $options: 'i' } });
        if (!questionnaire)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.NOT_FOUND);
        if (!req.files.length)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.FILE_NOT_FOUND);
        if (fileLength + Number(req.files.length) > 5)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.MAX_FILES);
        for (const fileMulter of req.files) {
            const src = `/upload/questionnaire/tactic/${questionnaire._id}-${req.query.targetId}-${req.query.portfolioId}-${fileMulter.originalname}`;
            const query = { questionnaire: questionnaire._id, meta: `${req.query.targetId}-${req.query.portfolioId}-${fileMulter.originalname}` };
            let file = yield files_model_1.default.findOne(query);
            if (!file) {
                file = new files_model_1.default(Object.assign({ originalname: fileMulter.originalname, type: enums_1.FILES.TACTIC, src }, query));
                questionnaire.files = [...questionnaire.files, file._id];
                questionnaire.markModified('files');
                yield questionnaire.save();
            }
            else {
                file.originalname = fileMulter.originalname;
                file.src = src;
            }
            yield file.save();
        }
        const files = yield files_model_1.default.find({ questionnaire: questionnaire._id, meta: { $regex: `${req.query.targetId}-${req.query.portfolioId}`, $options: 'i' } }).lean();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, files);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.editTacticFile = editTacticFile;
const removeTacticFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileReq = JSON.parse(String(req.query.file));
        const file = yield files_model_1.default.findOne({ questionnaire: req.params._id, meta: `${req.query.targetId}-${req.query.portfolioId}-${fileReq.originalname}` });
        if (!file)
            return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, questionnaire_constants_1.default.FILE_NOT_FOUND);
        yield questionnaire_model_1.default.findByIdAndUpdate(req.params._id, { $pull: { files: file._id } });
        const link = process.env.FILE_FOUND + file.src;
        if (fs_1.default.existsSync(link))
            fs_1.default.unlinkSync(link);
        yield file.remove();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.removeTacticFile = removeTacticFile;
function saveInstruments(res, targets, data, status = true) {
    let instrumentsList = [];
    let expertinstrumentList = [];
    for (const target of targets) {
        for (const portfolioKey in target.portfolios) {
            if (target.status[portfolioKey] === 1) {
                const portfolio = target.portfolios[portfolioKey];
                const coreInstruments = portfolio.sections[1].modules.map((m) => m.data);
                const tacticInstruments = portfolio.sections[2] && portfolioKey !== "expert"
                    ? portfolio.sections[2].modules.map((m) => m.data)
                    : [];
                if (portfolioKey === 'expert') {
                    expertinstrumentList = coreInstruments;
                }
                else {
                    instrumentsList = [
                        ...instrumentsList,
                        ...coreInstruments,
                        ...tacticInstruments,
                    ];
                }
            }
        }
    }
    (0, investment_controller_1.onPost)(instrumentsList, expertinstrumentList, data.expert._id, data.course.type, res);
    if (status && data.status !== enums_1.QUESTIONNAIRE_STATUSES.SENDED) {
        if (data.version === enums_1.QUESTIONNAIRE_VERSIONS.OLD)
            data.status = enums_1.QUESTIONNAIRE_STATUSES.ready;
        if (data.version === enums_1.QUESTIONNAIRE_VERSIONS.NEW)
            data.status = enums_1.QUESTIONNAIRE_STATUSES.VERIFIED;
        if (data.student && data.expert && data.course)
            courseElement_model_1.default.findOneAndUpdate({ expert: data.expert._id, course: data.course._id, student: data.student._id }, { completedAt: Date.now() });
        data.completedAt = Date.now();
        data.save();
    }
}
;
const deleteQuestionnaire = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionnaire = yield questionnaire_model_1.default.findById(req.params._id).populate('student');
        if ((questionnaire.status === enums_1.QUESTIONNAIRE_STATUSES.PROCESS || questionnaire.status === enums_1.QUESTIONNAIRE_STATUSES.VERIFIED) && res.locals.user.role === enums_1.ROLES.STUDENT)
            return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, questionnaire_constants_1.default.REMOVE_QUESTIONNAIRE_IMPOSSIBLE);
        yield questionnaire.remove({});
        yield courseElement_model_1.default.findOneAndUpdate({ questionnaire: questionnaire._id, course: questionnaire.course }, { status: enums_1.COURSES_STATUSES.NOTSENT });
        const file = yield files_model_1.default.findOneAndRemove({ questionnaire: req.params._id, type: enums_1.FILES.DOCUMENT, $or: [{ meta: '' }, { meta: undefined }] });
        if (file) {
            const link = process.env.FILE_FOUND + file.src;
            if (fs_1.default.existsSync(link))
                fs_1.default.unlinkSync(link);
        }
        if (questionnaire.student)
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление работы студента ${questionnaire.student.email}`, 'QUESTIONNAIRE_DELETE');
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, req.params._id);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.deleteQuestionnaire = deleteQuestionnaire;
// Надо так!
const first = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.updateMany({}, { password: (0, password_1.create)('test') });
    (0, response_1.response)(res, enums_1.STATUSES.OK, true, null);
});
exports.first = first;
exports.default = { getQuestionnaire: exports.getQuestionnaire, getPaginationQuestionnaires: exports.getPaginationQuestionnaires, getPaginationQuestionnairesArchive: exports.getPaginationQuestionnairesArchive, getExpertNotVerifiedQuestionnaires: exports.getExpertNotVerifiedQuestionnaires, getExpertProcessQuestionnaires: exports.getExpertProcessQuestionnaires, getExpertReadyQuestionnaires: exports.getExpertReadyQuestionnaires, fileQuestionnaire: exports.fileQuestionnaire, saveQuestionnaire: exports.saveQuestionnaire, saveOnePageQuestionnaire: exports.saveOnePageQuestionnaire, sendQuestionnaire: exports.sendQuestionnaire, collectionQuestionnaire: exports.collectionQuestionnaire, saveMode: exports.saveMode, saveModeError: exports.saveModeError, createStudentFile: excel_controller_1.createStudentFile, verificationQuestionnaire: exports.verificationQuestionnaire, createQuestionnaire: exports.createQuestionnaire, stopQuestionnaire: exports.stopQuestionnaire, studentQuestionnaire: exports.studentQuestionnaire, combineQuestionnaire: exports.combineQuestionnaire, uncombineQuestionnaire: exports.uncombineQuestionnaire, editQuestionnaire: exports.editQuestionnaire, finishQuestionnaire: exports.finishQuestionnaire, editTacticFile: exports.editTacticFile, removeTacticFile: exports.removeTacticFile, deleteQuestionnaire: exports.deleteQuestionnaire, first: exports.first };
//# sourceMappingURL=questionnaire.controller.js.map