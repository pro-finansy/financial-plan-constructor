"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = __importDefault(require("fs"));
const date_filter_1 = __importDefault(require("../date.filter"));
const log = (message) => {
    message = (0, date_filter_1.default)(Date.now(), 'datetime') + ': ' + message;
    fs_1.default.appendFile(__dirname + '/log.txt', message + '\n', (err) => {
        if (err)
            throw err;
    });
};
exports.log = log;
//# sourceMappingURL=log.js.map