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
exports.onDelete = exports.onPatch = exports.onPost = exports.onGets = exports.onGet = void 0;
const currency_model_1 = __importDefault(require("./currency.model"));
const currency_contants_1 = __importDefault(require("./currency.contants"));
const handler_1 = __importDefault(require("../../utils/handler"));
const response_1 = require("../../utils/response");
const enums_1 = require("../../utils/enums");
const defines_1 = require("../../utils/defines");
const actions_controller_1 = require("../actions/actions.controller");
const onGet = function (_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currencies = yield currency_model_1.default.find().lean();
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, null, currencies);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onGet = onGet;
const onGets = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filters = {};
            (0, defines_1.definePagination)(filters, req.query);
            const query = { $or: [{ name: { $regex: req.query.search, $options: "i" } }, { code: { $regex: req.query.search, $options: "i" } }] };
            const currencies = yield currency_model_1.default.find(query, null, filters).lean();
            const total = yield currency_model_1.default.countDocuments(query);
            (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, currencies, total);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onGets = onGets;
const onPost = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate = yield currency_model_1.default.findOne({ $or: [{ name: req.body.name }, { code: req.body.code }] });
            if (candidate)
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, currency_contants_1.default.EXISTING_CURRENCY);
            const currency = new currency_model_1.default(req.body);
            yield currency.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Добавление валюты "${currency.name}"`, "CURRENCY_CREATED");
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, currency_contants_1.default.CREATED, currency);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onPost = onPost;
const onPatch = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const candidate = yield currency_model_1.default.findOne({ $or: [{ name: req.body.name }, { sign: req.body.sign }] });
            if (candidate && String(candidate._id) !== String(req.body._id))
                return (0, response_1.response)(res, enums_1.STATUSES.CONFLICT, false, currency_contants_1.default.EXISTING_CURRENCY);
            const currency = yield currency_model_1.default.findById(req.body._id);
            if (!currency)
                return (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, currency_contants_1.default.NOT_FOUND);
            for (const key in req.body) {
                currency[key] = req.body[key];
            }
            yield currency.save();
            (0, actions_controller_1.createAction)(res.locals.user._id, `Редактирование валюты "${currency.name}"`, "CURRENCY_EDITED");
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, currency_contants_1.default.EDITED, currency);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onPatch = onPatch;
const onDelete = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currency = yield currency_model_1.default.findByIdAndDelete(req.params._id);
            (0, actions_controller_1.createAction)(res.locals.user._id, `Удаление валюты "${currency.name}"`, "CURRENCY_DELETED");
            (0, response_1.response)(res, enums_1.STATUSES.OK, true, currency_contants_1.default.REMOVED, req.params._id);
        }
        catch (err) {
            (0, handler_1.default)(res, err);
        }
    });
};
exports.onDelete = onDelete;
exports.default = { onGet: exports.onGet, onGets: exports.onGets, onPost: exports.onPost, onPatch: exports.onPatch, onDelete: exports.onDelete };
//# sourceMappingURL=currency.controller.js.map