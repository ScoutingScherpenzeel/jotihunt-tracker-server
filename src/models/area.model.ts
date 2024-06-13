import mongoose from "mongoose";
import { pointSchema } from "./point";

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  }
});

export const Area = mongoose.model("Area", AreaSchema);
