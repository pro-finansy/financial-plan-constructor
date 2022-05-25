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
exports.patch = exports.addStreamDate = exports.list = exports.get = void 0;
const course_model_1 = __importDefault(require("./course.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const course_constants_1 = __importDefault(require("./course.constants"));
const get = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(res.locals.user._id).lean();
            const data = yield course_model_1.default.find({ tag: { $in: user.accesses } }).lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.get = get;
const list = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield course_model_1.default.find().select('name _id streamDates').lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.list = list;
const addStreamDate = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const course = yield course_model_1.default.findById(req.body.course_id);
            if (!course)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, course_constants_1.default.COURSE_NOT_FOUND);
            const streamArray = req.body.streamDate.split('.');
            if (streamArray.length !== 3 || +streamArray[0] > 31 || +streamArray[0] < 1 || +streamArray[1] > 12 || +streamArray[1] < 1 || +streamArray[2] > 2030 || +streamArray[2] < 2021) {
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, course_constants_1.default.INVALID_DATE);
            }
            course.streamDates = [...course.streamDates, req.body.streamDate];
            course.markModified('streamDates');
            yield course.save();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, course_constants_1.default.STREAM_ADDED);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.addStreamDate = addStreamDate;
const patch = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.accesses && !req.body.course_id)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, course_constants_1.default.SELECT_ERROR);
            const user = yield user_model_1.default.findById(res.locals.user._id);
            if (!user)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, course_constants_1.default.NOT_FOUND);
            if (user.role !== enums_1.ROLES.EXPERT && !user.courses)
                return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, course_constants_1.default.FORBIDDEN);
            user.course = req.body.course_id || req.body.course;
            yield user.save();
            const data = yield user_model_1.default.findById(res.locals.user._id)
                .populate('avatar')
                .populate('course').lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.patch = patch;
exports.default = { get: exports.get, list: exports.list, patch: exports.patch, addStreamDate: exports.addStreamDate };
//# sourceMappingURL=course.controller.js.map