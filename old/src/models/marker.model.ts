import mongoose from "mongoose";
import { pointSchema } from "./point";

export enum MarkerType {
  Hint = "hint",
  Hunt = "hunt",
  Spot = "spot",
}

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
  type: {
    type: String,
    enum: MarkerType,
    default: MarkerType.Hint,
    required: true,
  },
});

export const Marker = mongoose.model("Marker", MarkerSchema);
