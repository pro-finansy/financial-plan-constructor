"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const faq_controller_1 = __importDefault(require("./faq.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/faq/list", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER, enums_1.ROLES.EXPERT, enums_1.ROLES.SUPPORT), faq_controller_1.default.onGet);
router.post("/faq", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), faq_controller_1.default.onCreate);
router.patch("/faq", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), faq_controller_1.default.onEdit);
router.delete("/faq/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), faq_controller_1.default.onDelete);
module.exports = router;
//# sourceMappingURL=faq.routes.js.map