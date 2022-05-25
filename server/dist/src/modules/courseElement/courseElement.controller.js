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
exports.streams = exports.get = void 0;
const courseElement_model_1 = __importDefault(require("./courseElement.model"));
const course_model_1 = __importDefault(require("../course/course.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const get = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const course = yield course_model_1.default.findOne({ type: req.query.course || enums_1.COURSES.ONE });
            const data = yield courseElement_model_1.default.find({ student: res.locals.user._id, status: enums_1.COURSES_STATUSES.NOTSENT, course: course._id }).lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, data);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.get = get;
const streams = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield courseElement_model_1.default.find().select('streamDate').lean();
            const array = Array.from(new Set(data.map(e => e.streamDate).filter(e => e))).map(e => ({ _id: e, name: e }));
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, array);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.streams = streams;
exports.default = { get: exports.get, streams: exports.streams };
//# sourceMappingURL=courseElement.controller.js.map