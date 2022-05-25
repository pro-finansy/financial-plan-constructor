"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.definePagination = exports.defineSearchDates = exports.defineSearchEmail = void 0;
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const defineSearchEmail = function (query, search) {
    const latin = search.trim().match("^[a-zA-Z0-9_.-]+$");
    const email = (0, isEmail_1.default)(search.trim());
    if (latin || email) {
        query.studentEmail = { $regex: search.trim().toLowerCase(), $options: "i" };
    }
};
exports.defineSearchEmail = defineSearchEmail;
const defineSearchDates = function (reqQuery, query, dates) {
    for (const date of dates) {
        if (reqQuery[date] && reqQuery[date].length === 2) {
            query[date] = {
                $gte: new Date(reqQuery[date][0]),
                $lte: new Date(new Date(reqQuery[date][1]).setDate(new Date(reqQuery[date][1]).getDate() + 1))
            };
        }
    }
};
exports.defineSearchDates = defineSearchDates;
const definePagination = function (filters, query) {
    if (query.limit)
        filters.limit = Number(query.limit);
    if (query.page)
        filters.skip = Number(query.limit) * (Number(query.page) - 1);
};
exports.definePagination = definePagination;
//# sourceMappingURL=defines.js.map