"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const actions_controller_1 = __importDefault(require("./actions.controller"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const enums_1 = require("../../utils/enums");
router.get("/actions", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT, enums_1.ROLES.EXPERT), actions_controller_1.default.get);
module.exports = router;
//# sourceMappingURL=actions.routes.js.map