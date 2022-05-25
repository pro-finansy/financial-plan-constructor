"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("./constants"));
const enums_1 = require("../utils/enums");
const response_1 = require("../utils/response");
exports.default = (accessesExpert, ...roles) => (_req, res, next) => {
    const check = accessesExpert ? !res.locals.user.accesses.includes(enums_1.ROLES.EXPERT) : false;
    if (!roles.includes(res.locals.user.role) && check)
        return (0, response_1.response)(res, enums_1.STATUSES.FORBIDDEN, false, constants_1.default.FORBIDDEN);
    next();
};
//# sourceMappingURL=verifyRoles.js.map