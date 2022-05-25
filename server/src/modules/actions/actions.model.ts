import { model, Schema } from "mongoose";

const actions = new Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
});

export default model("actions", actions);
