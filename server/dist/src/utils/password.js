"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.create = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const create = (password) => bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
exports.create = create;
const check = (password, currentPassword) => bcryptjs_1.default.compareSync(password, currentPassword);
exports.check = check;
exports.default = { create: exports.create, check: exports.check };
//# sourceMappingURL=password.js.map