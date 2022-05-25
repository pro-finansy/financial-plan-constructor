import { model, Schema } from "mongoose";

const courseElements = new Schema({
  questionnaire: { type: Schema.Types.ObjectId, ref: 'questionnaires', default: null },
  course: { type: Schema.Types.ObjectId, ref: 'courses' },
  streamDate: { type: String, default: null },
  chat: { type: String, default: null },
  comment: { type: String, default: null },
  
  studentEmail: { type: String, default: '' },
  expert: { type: Schema.Types.ObjectId, ref: 'users' },
  student: { type: Schema.Types.ObjectId, ref: 'users' },
  fileStudent: { type: Schema.Types.ObjectId, ref: 'files' },
  fileExpert: { type: Schema.Types.ObjectId, ref: 'files' },

  status: { type: String, default: 'NOTSENT' },
  updatedAt: { type: Date, default: Date.now },
  sentedAt: { type: Date, default: null},
  completedAt: { type: Date, default: null },
});

export default model("courseElements", courseElements);
