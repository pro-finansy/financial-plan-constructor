import { model, Schema } from "mongoose";

const files = new Schema({
  type: { type: String, required: true },
  src: { type: String, required: true },
  meta: { type: String, default: '' },
  originalname: { type: String, default: '' },
  course: { type: Schema.Types.ObjectId, ref: 'courses' },
  courseElement: { type: Schema.Types.ObjectId, ref: 'courseElements' },
  section: { type: Schema.Types.ObjectId, ref: 'sections' },
  questionnaire: { type: Schema.Types.ObjectId, ref: 'questionnaires' },
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
});

export default model("files", files);
