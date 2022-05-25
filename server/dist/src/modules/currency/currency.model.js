"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const currencies = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, default: '' },
    sign: { type: String, default: '' },
});
exports.default = (0, mongoose_1.model)("currencies", currencies);
//# sourceMappingURL=currency.model.js.map