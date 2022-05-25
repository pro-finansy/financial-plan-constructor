"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const exchange_controller_1 = __importDefault(require("./exchange.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
router.get("/exchanges/:search", jwt_1.default, exchange_controller_1.default.gets);
router.get("/exchange/:search", jwt_1.default, exchange_controller_1.default.get);
module.exports = router;
//# sourceMappingURL=exchange.routes.js.map