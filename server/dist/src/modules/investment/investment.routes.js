"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const investment_controller_1 = __importDefault(require("./investment.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/investments", jwt_1.default, investment_controller_1.default.get);
router.get("/investments/list", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), investment_controller_1.default.gets);
router.post("/investment", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), investment_controller_1.default.onCreate);
router.post("/investments/unique", investment_controller_1.default.onUnique);
router.post("/investments/actual", investment_controller_1.default.actual);
router.patch("/investment", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), investment_controller_1.default.onEdit);
router.patch("/investment/blocked/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), investment_controller_1.default.onToggleBlocked);
router.delete("/investment/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), investment_controller_1.default.onDelete);
module.exports = router;
//# sourceMappingURL=investment.routes.js.map