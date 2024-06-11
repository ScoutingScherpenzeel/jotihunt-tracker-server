import express from "express";
import dotenv from "dotenv";
import trackerRoute from "./routes/tracker.route";

const app = express();
dotenv.config();

app.use('/tracker', trackerRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});