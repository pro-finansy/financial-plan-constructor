"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const courseElement_controller_1 = __importDefault(require("./courseElement.controller"));
const jwt_1 = __importDefault(require("../../middleware/jwt"));
router.get("/courseelement", jwt_1.default, courseElement_controller_1.default.get);
router.get("/courseelement/streams", jwt_1.default, courseElement_controller_1.default.streams);
module.exports = router;
//# sourceMappingURL=courseElement.routes.js.map