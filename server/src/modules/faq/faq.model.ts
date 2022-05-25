import { model, Schema } from "mongoose";

const faqs = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

export default model("faqs", faqs);
