"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionnaires = new mongoose_1.Schema({
    status: { type: String, default: 'NOTSENT' },
    version: { type: String, default: 'new' },
    streamDate: { type: String, default: '24.05.2021' },
    content_EXPERT: { type: Object, default: null },
    content_STUDENT: { type: Object, default: null },
    content_COMBINE_EXPERT: { type: Object, default: null },
    content_COMBINE_STUDENT: { type: Object, default: null },
    seconds: { type: Number, default: 0 },
    owner: { type: String, default: 'EXPERT' },
    studentEmail: { type: String, default: null },
    expert: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    prevExpert: { type: String, default: null },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'courses' },
    file: { type: mongoose_1.Schema.Types.ObjectId, ref: 'files' },
    files: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'files' }],
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    sentedAt: { type: Date, default: null },
    sendedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
});
exports.default = (0, mongoose_1.model)("questionnaires", questionnaires);
//# sourceMappingURL=questionnaire.model.js.map