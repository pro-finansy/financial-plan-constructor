import { model, Schema } from "mongoose";

const currencies = new Schema({
  name: { type: String, required: true },
  code: { type: String, default: '' },
  sign: { type: String, default: '' },
});

export default model("currencies", currencies);
