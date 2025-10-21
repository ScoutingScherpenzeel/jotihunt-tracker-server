import mongoose from "mongoose";

const HuntSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true,
  },
  huntCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  huntTime: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export const Hunt = mongoose.model("Hunt", HuntSchema);
