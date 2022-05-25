"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const faqs = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("faqs", faqs);
//# sourceMappingURL=faq.model.js.map