"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const assets = new mongoose_1.Schema({
    name: { type: String, required: true },
    stock: { type: Number, default: 0 },
    bond: { type: Number, default: 0 },
    alternative: { type: Number, default: 0 },
});
exports.default = (0, mongoose_1.model)("mixedAssets", assets);
//# sourceMappingURL=mixed.model.js.map