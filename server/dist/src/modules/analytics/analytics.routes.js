"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const analytics_controller_1 = __importDefault(require("./analytics.controller"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const enums_1 = require("../../utils/enums");
router.get("/analytics/common", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT), analytics_controller_1.default.getCommon);
router.get("/analytics/common/expert", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT, enums_1.ROLES.EXPERT), analytics_controller_1.default.getCommonExpert);
router.get("/analytics/average", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT, enums_1.ROLES.EXPERT), analytics_controller_1.default.getAverage);
router.get("/analytics/experts", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT, enums_1.ROLES.EXPERT), analytics_controller_1.default.getExperts);
module.exports = router;
//# sourceMappingURL=analytics.routes.js.map