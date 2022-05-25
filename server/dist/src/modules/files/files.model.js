"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const files = new mongoose_1.Schema({
    type: { type: String, required: true },
    src: { type: String, required: true },
    meta: { type: String, default: '' },
    originalname: { type: String, default: '' },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'courses' },
    courseElement: { type: mongoose_1.Schema.Types.ObjectId, ref: 'courseElements' },
    section: { type: mongoose_1.Schema.Types.ObjectId, ref: 'sections' },
    questionnaire: { type: mongoose_1.Schema.Types.ObjectId, ref: 'questionnaires' },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
});
exports.default = (0, mongoose_1.model)("files", files);
//# sourceMappingURL=files.model.js.map