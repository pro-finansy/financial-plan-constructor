"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const users = new mongoose_1.Schema({
    name: { type: String, default: '' },
    email: { type: String, unique: true },
    role: { type: String, required: true },
    active: { type: Boolean, default: true },
    password: { type: String, default: null },
    showChat: { type: Boolean, default: true },
    phone: { type: String, default: '' },
    accesses: { type: Array, default: [] },
    times: { type: String, default: '' },
    days: { type: String, default: '' },
    dayLength: { type: Number, default: 0 },
    token: { type: String, default: null },
    reset: { type: String, default: null },
    courses: { type: Boolean, default: false },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'courses' },
    avatar: { type: mongoose_1.Schema.Types.ObjectId, ref: 'files', default: null },
    comments: { type: Object, default: {
            target: '',
            expert: '',
            existing: '',
            student: '',
            stock: '',
            bond: '',
            alternative: '',
            tactic: '',
            common: '',
        } },
});
exports.default = (0, mongoose_1.model)("users", users);
//# sourceMappingURL=user.model.js.map