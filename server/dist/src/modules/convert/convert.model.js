"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const convert = new mongoose_1.Schema({
    list: { type: Object, required: true },
});
exports.default = (0, mongoose_1.model)("convert", convert);
//# sourceMappingURL=convert.model.js.map