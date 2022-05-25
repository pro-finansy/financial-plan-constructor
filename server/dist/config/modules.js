"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
module.exports = (app, express) => {
    dotenv_1.default.config();
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use(express.json({ limit: '50MB' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(require("morgan")("dev"));
    app.use((0, cors_1.default)());
    app.use((0, compression_1.default)());
    const apiLimiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000,
        max: 10000
    });
    app.use("/api/", apiLimiter);
    Object.typedKeys = Object.keys;
};
//# sourceMappingURL=modules.js.map