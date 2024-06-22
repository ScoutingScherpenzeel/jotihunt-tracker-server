import mongoose from "mongoose";
import { pointSchema } from "./point";

const MarkerSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
});

export const Marker = mongoose.model("Marker", MarkerSchema);
