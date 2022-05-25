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
exports.onDelete = exports.onEdit = exports.onCreate = exports.onGet = void 0;
const faq_model_1 = __importDefault(require("./faq.model"));
const handler_1 = __importDefault(require("../../utils/handler"));
const enums_1 = require("../../utils/enums");
const response_1 = require("../../utils/response");
const onGet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {};
            if (req.query.search)
                query['$or'] = [{ question: { $regex: req.query.search, $options: "i" } }, { answer: { $regex: req.query.search, $options: "i" } }];
            const faq = yield faq_model_1.default.find(query).lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, faq);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onGet = onGet;
const onCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = new faq_model_1.default(req.body);
        yield faq.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, faq);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onCreate = onCreate;
const onEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faq = yield faq_model_1.default.findById(req.body._id);
        faq.question = req.body.question;
        faq.answer = req.body.answer;
        yield faq.save();
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, faq);
    }
    catch (err) {
        console.log(err);
        (0, handler_1.default)(res, err);
    }
});
exports.onEdit = onEdit;
const onDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield faq_model_1.default.findByIdAndRemove(req.params._id);
        (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, req.params._id);
    }
    catch (err) {
        (0, handler_1.default)(res, err);
    }
});
exports.onDelete = onDelete;
exports.default = { onGet: exports.onGet, onEdit: exports.onEdit, onDelete: exports.onDelete, onCreate: exports.onCreate };
//# sourceMappingURL=faq.controller.js.map