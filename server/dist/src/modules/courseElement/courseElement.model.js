"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseElements = new mongoose_1.Schema({
    questionnaire: { type: mongoose_1.Schema.Types.ObjectId, ref: 'questionnaires', default: null },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'courses' },
    streamDate: { type: String, default: null },
    chat: { type: String, default: null },
    comment: { type: String, default: null },
    studentEmail: { type: String, default: '' },
    expert: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    fileStudent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'files' },
    fileExpert: { type: mongoose_1.Schema.Types.ObjectId, ref: 'files' },
    status: { type: String, default: 'NOTSENT' },
    updatedAt: { type: Date, default: Date.now },
    sentedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
});
exports.default = (0, mongoose_1.model)("courseElements", courseElements);
//# sourceMappingURL=courseElement.model.js.map