"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const actions = new mongoose_1.Schema({
    type: { type: String, required: true },
    message: { type: String, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("actions", actions);
//# sourceMappingURL=actions.model.js.map