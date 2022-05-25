import { model, Schema } from "mongoose";

const questionnaires = new Schema({
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

  expert: { type: Schema.Types.ObjectId, ref: 'users' },
  prevExpert: { type: String, default: null },
  student: { type: Schema.Types.ObjectId, ref: 'users' },
  course: { type: Schema.Types.ObjectId, ref: 'courses' },
  file: { type: Schema.Types.ObjectId, ref: 'files' },
  files: [{ type: Schema.Types.ObjectId, ref: 'files' }],

  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  sentedAt: { type: Date, default: null },
  sendedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
});

export default model("questionnaires", questionnaires);
