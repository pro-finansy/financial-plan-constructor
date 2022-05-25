import { model, Schema } from "mongoose";

const assets = new Schema({
  name: { type: String, required: true },
  stock: { type: Number, default: 0 },
  bond: { type: Number, default: 0 },
  alternative: { type: Number, default: 0 },
});

export default model("mixedAssets", assets);
