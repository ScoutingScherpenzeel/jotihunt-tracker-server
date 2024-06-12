import mongoose from "mongoose";
import { pointSchema } from "./point";

const MarkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
});

export const Marker = mongoose.model("Marker", MarkerSchema);
