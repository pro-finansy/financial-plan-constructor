"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const mixed_controller_1 = __importDefault(require("./mixed.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
router.get("/asset/list", jwt_1.default, mixed_controller_1.default.onGetList);
router.get("/asset/pag", jwt_1.default, mixed_controller_1.default.onGet);
router.post("/asset", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), mixed_controller_1.default.onPost);
router.patch("/asset", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), mixed_controller_1.default.onPatch);
router.delete("/asset/:_id", jwt_1.default, (0, verifyRoles_1.default)(true, enums_1.ROLES.OWNER), mixed_controller_1.default.onDelete);
module.exports = router;
//# sourceMappingURL=mixed.routes.js.map