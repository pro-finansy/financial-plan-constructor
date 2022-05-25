"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zero_filter_1 = __importDefault(require("./zero.filter"));
exports.default = (value, filter = 'date') => {
    const date = new Date(value);
    const result = [];
    if (filter.includes('date')) {
        result.push(`${(0, zero_filter_1.default)(date.getDate())}.${(0, zero_filter_1.default)(date.getMonth() + 1)}.${date.getFullYear()}`);
    }
    if (filter.includes('time')) {
        result.push(`${(0, zero_filter_1.default)(date.getHours())}:${(0, zero_filter_1.default)(date.getMinutes())}`);
    }
    return result.join(' ');
};
//# sourceMappingURL=date.filter.js.map