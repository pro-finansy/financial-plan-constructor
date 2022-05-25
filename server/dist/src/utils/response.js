"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getsResponse = exports.response = void 0;
const response = (res, statusCode, success, message, data = null) => {
    return res.status(statusCode).json({ success, message, data });
};
exports.response = response;
const getsResponse = (res, statusCode, success, message, data = null, total = 0) => {
    return res.status(statusCode).json({ success, message, data, total });
};
exports.getsResponse = getsResponse;
exports.default = { response: exports.response, getsResponse: exports.getsResponse };
//# sourceMappingURL=response.js.map