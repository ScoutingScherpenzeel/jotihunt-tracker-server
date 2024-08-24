import mongoose from "mongoose";
import { pointSchema } from "./point";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accomodation: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  houseNumber: {
    type: Number,
    required: true,
  },
  housenumberAddition: {
    type: String,
    required: false,
  },
  postCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: false,
  },
  location: {
    type: pointSchema,
    required: true,
  },
});

export const Team = mongoose.model("Team", TeamSchema);
