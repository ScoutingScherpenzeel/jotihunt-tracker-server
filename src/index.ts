import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import trackerRoute from "./routes/tracker.route";
import markersRoute from "./routes/markers.route";
import teamsRoute from "./routes/teams.route";
import retrieveJotihuntTeams from "./crons/jotihunt-teams.cron";
import retrieveJotihuntAreas from "./crons/jotihunt-areas.cron";
import winston from "winston";
import mongoose from "mongoose";
import expressWinston from "express-winston";
import cors from "cors";

// Setup logging with Winston
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`)
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
logger.info("Starting Jotihunt tracker...");

// Setup express and CORS
logger.info("Setting up Express and loading config...");
dotenv.config();
const app = express();
app.use(express.json());
app.use(expressWinston.logger({ winstonInstance: logger }));
app.use(cors())

// Setup routes
logger.info("Setting up routes...");
app.use("/tracker", trackerRoute);
app.use("/markers", markersRoute);
app.use("/teams", teamsRoute)

// Database connection
const db = process.env.MONGO_URI || "";
logger.info("Trying to connect to MongoDB...");
await mongoose.connect(db).then(() => {
  logger.info("Connected to MongoDB!");
});

// Start the server
const port = process.env.PORT || 3000;
logger.info(`Starting server on port ${port}...`);
app.listen(port);

// Schedule cron jobs
logger.info("Starting cron jobs...");

cron.schedule("*/5 * * * *", retrieveJotihuntTeams);
cron.schedule("*/10 * * * * *", retrieveJotihuntAreas);
