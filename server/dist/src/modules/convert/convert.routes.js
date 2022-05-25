"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const convert_controller_1 = __importDefault(require("./convert.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
router.get("/convert", jwt_1.default, convert_controller_1.default.get);
module.exports = router;
//# sourceMappingURL=convert.routes.js.map