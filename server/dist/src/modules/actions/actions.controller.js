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
exports.get = exports.createAction = void 0;
const actions_model_1 = __importDefault(require("./actions.model"));
const enums_1 = require("../../utils/enums");
const response_1 = require("../../utils/response");
const defines_1 = require("../../utils/defines");
const createAction = function (owner, message, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const action = new actions_model_1.default({ owner, message, type });
        yield action.save();
    });
};
exports.createAction = createAction;
const get = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            sort: { createdAt: -1 }
        };
        (0, defines_1.definePagination)(filters, req.query);
        const query = {};
        if (res.locals.user.role === enums_1.ROLES.EXPERT && !res.locals.user.accesses.includes(enums_1.ROLES.EXPERT))
            query.owner = res.locals.user._id;
        if (req.query.search)
            query.message = { '$regex': req.query.search, '$options': 'i' };
        const actions = yield actions_model_1.default.find(query, null, filters).populate('owner');
        const total = yield actions_model_1.default.countDocuments(query);
        (0, response_1.getsResponse)(res, enums_1.STATUSES.OK, true, null, actions, total);
    });
};
exports.get = get;
exports.default = { createAction: exports.createAction, get: exports.get };
//# sourceMappingURL=actions.controller.js.map