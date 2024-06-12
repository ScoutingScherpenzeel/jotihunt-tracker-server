import express from "express";
import dotenv from "dotenv";
import trackerRoute from "./routes/tracker.route";
import markersRoute from "./routes/markers.route";

const mongoose = require("mongoose");
const app = express();
app.use(express.json());

dotenv.config();

const db = process.env.MONGO_URI;
app.use("/tracker", trackerRoute);
app.use("/markers", markersRoute);

await mongoose.connect(db).then(() => {
  console.log("Connected to MongoDB!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
