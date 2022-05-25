"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = __importDefault(require("./auth.controller"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
const verifyRoles_1 = __importDefault(require("../../middleware/verifyRoles"));
const enums_1 = require("../../utils/enums");
const limiterOptions = {
    ms: 1 * 60 * 1000,
    max: 6,
    message: 'Превышено количество авторизаций в минуту, повторите попытку позже!'
};
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: limiterOptions.ms,
    max: limiterOptions.max,
    message: limiterOptions.message
});
router.get("/authorization", jwt_1.default, auth_controller_1.default.authentification);
router.post("/login", apiLimiter, auth_controller_1.default.login);
router.post("/login/password", auth_controller_1.default.loginPassword);
router.post("/logout", auth_controller_1.default.logout);
router.post("/reset", auth_controller_1.default.reset);
router.post("/change", jwt_1.default, auth_controller_1.default.change);
router.post("/reload", jwt_1.default, (0, verifyRoles_1.default)(false, enums_1.ROLES.OWNER), auth_controller_1.default.reload);
module.exports = router;
//# sourceMappingURL=auth.routes.js.map