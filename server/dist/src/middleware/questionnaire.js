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
const constants_1 = __importDefault(require("./constants"));
const enums_1 = require("../utils/enums");
const response_1 = require("../utils/response");
const questionnaire_model_1 = __importDefault(require("../modules/questionnaire/questionnaire.model"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionnaire = yield questionnaire_model_1.default.findById(req.params._id).lean();
        if (res.locals.user.role !== enums_1.ROLES.OWNER && !res.locals.user.accesses.includes(enums_1.ROLES.EXPERT) && String(questionnaire.expert) != String(res.locals.user._id) && String(questionnaire.student) != String(res.locals.user._id))
            return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, constants_1.default.FORBIDDEN);
        next();
    }
    catch (e) {
        (0, response_1.response)(res, enums_1.STATUSES.NOT_FOUND, false, constants_1.default.QUESTIONNAIRE_NOT_FOUND);
    }
});
//# sourceMappingURL=questionnaire.js.map