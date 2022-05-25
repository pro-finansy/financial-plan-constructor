"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __importDefault(require("./constants"));
const response_1 = require("../utils/response");
const enums_1 = require("../utils/enums");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token)
        return (0, response_1.response)(res, enums_1.STATUSES.UNAUTHORIZED, false, constants_1.default.TOKEN_LIFETIME);
    try {
        res.locals.user = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY || '');
        next();
    }
    catch (e) {
        (0, response_1.response)(res, enums_1.STATUSES.UNAUTHORIZED, false, constants_1.default.TOKEN_LIFETIME);
    }
};
//# sourceMappingURL=jwt.js.map