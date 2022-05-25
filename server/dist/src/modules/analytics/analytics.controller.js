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
exports.getCommonExpert = exports.getCommon = exports.getAverage = exports.getExperts = void 0;
const courseElement_model_1 = __importDefault(require("../courseElement/courseElement.model"));
const questionnaire_model_1 = __importDefault(require("../questionnaire/questionnaire.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const socket_1 = require("../../utils/socket");
const enums_1 = require("../../utils/enums");
function unique(array) {
    let newArray = array.map(e => `${e.student}-${e.course}`);
    return Array.from(new Set(newArray)).length;
}
const getExperts = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const date = new Date();
            const date2 = new Date();
            const filter = {
                completedAt: {
                    $gte: new Date(date2.setDate(date2.getDate() - 30)),
                    $lte: date
                }
            };
            let array = [];
            let empty = [];
            const experts = yield user_model_1.default.find({ role: enums_1.ROLES.EXPERT }).lean();
            const questionnaires = yield questionnaire_model_1.default.find(Object.assign(Object.assign({}, filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds expert').lean();
            for (const expert of experts) {
                const q = questionnaires.filter(q => String(q.expert) === String(expert._id));
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
                if (a.minutes > b.minutes)
                    return 1;
                if (a.minutes < b.minutes)
                    return -1;
                return 0;
            });
            array = [...array, ...empty];
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, array);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getExperts = getExperts;
const getAverage = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {};
            if (res.locals.user.role === enums_1.ROLES.EXPERT && !res.locals.user.accesses.includes(enums_1.ROLES.EXPERT))
                query.expert = res.locals.user._id;
            function getDates(month) {
                return {
                    completedAt: {
                        $gte: new Date(`2021-0${month}-01`),
                        $lte: new Date(`2021-0${month}-30`)
                    }
                };
            }
            const august_filter = getDates(6);
            const september_filter = getDates(9);
            const october_filter = getDates(10);
            const november_filter = getDates(11);
            const december_filter = getDates(12);
            const august = yield questionnaire_model_1.default.find(Object.assign(Object.assign(Object.assign({}, query), august_filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds').lean();
            const september = yield questionnaire_model_1.default.find(Object.assign(Object.assign(Object.assign({}, query), september_filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds').lean();
            const october = yield questionnaire_model_1.default.find(Object.assign(Object.assign(Object.assign({}, query), october_filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds').lean();
            const november = yield questionnaire_model_1.default.find(Object.assign(Object.assign(Object.assign({}, query), november_filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds').lean();
            const december = yield questionnaire_model_1.default.find(Object.assign(Object.assign(Object.assign({}, query), december_filter), { $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }] })).select('seconds').lean();
            const august_seconds = august.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
            const september_seconds = september.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
            const october_seconds = october.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
            const november_seconds = november.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
            const december_seconds = december.map((q) => q.seconds).reduce((acc, s) => acc + s, 0);
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, {
                august: (((august_seconds / august.length) / 60) || 0).toFixed(0),
                september: (((september_seconds / september.length) / 60) || 0).toFixed(0),
                october: (((october_seconds / october.length) / 60) || 0).toFixed(0),
                november: (((november_seconds / november.length) / 60) || 0).toFixed(0),
                december: (((december_seconds / december.length) / 60) || 0).toFixed(0),
            });
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getAverage = getAverage;
const getCommon = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const questionnaires = yield courseElement_model_1.default.countDocuments({ status: { $ne: enums_1.COURSES_STATUSES.NOTSENT }, questionnaire: { $ne: undefined } });
            const studentsQuestionnaire = yield questionnaire_model_1.default.find({ owner: enums_1.ROLES.STUDENT }).select('student course').lean();
            const questionnairesLength = unique(studentsQuestionnaire);
            const students = yield user_model_1.default.countDocuments({ role: enums_1.ROLES.STUDENT });
            const online = socket_1.Socket.online();
            const completedQuestionnaires = yield questionnaire_model_1.default.countDocuments({ $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }], owner: enums_1.ROLES.STUDENT });
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, {
                questionnaires,
                students,
                online,
                questionnairesLength,
                completedQuestionnaires,
            });
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getCommon = getCommon;
const getCommonExpert = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const questionnaires = yield courseElement_model_1.default.countDocuments({ status: { $ne: enums_1.COURSES_STATUSES.NOTSENT }, questionnaire: { $ne: undefined }, expert: res.locals.user._id });
            const completedQuestionnaires = yield questionnaire_model_1.default.countDocuments({ $or: [{ status: enums_1.QUESTIONNAIRE_STATUSES.VERIFIED }, { status: enums_1.QUESTIONNAIRE_STATUSES.SENDED }], owner: enums_1.ROLES.STUDENT, expert: res.locals.user._id });
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, {
                questionnaires,
                completedQuestionnaires,
            });
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.getCommonExpert = getCommonExpert;
exports.default = { getExperts: exports.getExperts, getAverage: exports.getAverage, getCommon: exports.getCommon, getCommonExpert: exports.getCommonExpert };
//# sourceMappingURL=analytics.controller.js.map