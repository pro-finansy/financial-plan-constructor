import mongoose from "mongoose";
const DEFAULT_DB = 'mongodb://localhost/finance';

export = () => {
  mongoose
    .connect(process.env.LIVE_DB || DEFAULT_DB)
    .then(() => {
      console.log("MongoDB connected");
    })
};