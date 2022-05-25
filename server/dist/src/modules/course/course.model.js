"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courses = new mongoose_1.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: false },
    currency: { type: String, required: false },
    type: { type: String, required: true },
    streamDate: { type: String, required: true },
    streamDates: [{ type: String }],
});
exports.default = (0, mongoose_1.model)("courses", courses);
//# sourceMappingURL=course.model.js.map