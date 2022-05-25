import { model, Schema } from "mongoose";

const convert = new Schema({
  list: { type: Object, required: true },
});

export default model("convert", convert);
