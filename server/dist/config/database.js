"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_DB = 'mongodb://localhost/finance';
module.exports = () => {
    mongoose_1.default
        .connect(process.env.LIVE_DB || DEFAULT_DB)
        .then(() => {
        console.log("MongoDB connected");
    });
};
//# sourceMappingURL=database.js.map