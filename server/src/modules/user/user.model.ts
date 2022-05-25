import { model, Schema } from "mongoose";

const users = new Schema({
  name: { type: String, default: '' },
  email: { type: String, unique: true },
  role: { type: String, required: true },
  active: { type: Boolean, default: true },
  password: { type: String, default: null },

  showChat: { type: Boolean, default: true },
  phone: { type: String, default: '' },
  accesses: { type: Array, default: [] },
  times: { type: String, default: '' },
  days: { type: String, default: '' },
  dayLength: { type: Number, default: 0 },

  token: { type: String, default: null },
  reset: { type: String, default: null },

  courses: { type: Boolean, default: false },
  course: { type: Schema.Types.ObjectId, ref: 'courses' },
  avatar: { type: Schema.Types.ObjectId, ref: 'files', default: null },

  comments: { type: Object, default: { 
    target: '',
    expert: '',
    existing: '',
    student: '',
    stock: '',
    bond: '',
    alternative: '',
    tactic: '',
    common: '',
  } },
});

export default model("users", users);
