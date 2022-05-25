"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const course_controller_1 = __importDefault(require("./course.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/courses", jwt_1.default, course_controller_1.default.get);
router.get("/course/list", jwt_1.default, course_controller_1.default.list);
router.post("/course/stream", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.SUPPORT), course_controller_1.default.addStreamDate);
router.patch("/course", jwt_1.default, course_controller_1.default.patch);
module.exports = router;
//# sourceMappingURL=course.routes.js.map