"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const currency_controller_1 = __importDefault(require("./currency.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/currency/list", jwt_1.default, currency_controller_1.default.onGet);
router.get("/currency/pag", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), currency_controller_1.default.onGets);
router.post("/currency", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), currency_controller_1.default.onPost);
router.patch("/currency", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), currency_controller_1.default.onPatch);
router.delete("/currency/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), currency_controller_1.default.onDelete);
module.exports = router;
//# sourceMappingURL=currency.routes.js.map