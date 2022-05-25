import { model, Schema } from "mongoose";

const courses = new Schema({
  name: { type: String, required: true },
  tag: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  currency: { type: String, required: false },
  type: { type: String, required: true },
  streamDate: { type: String, required: true },
  streamDates: [{ type: String }],
});

export default model("courses", courses);
