"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (n, width = 2) => {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};
//# sourceMappingURL=zero.filter.js.map