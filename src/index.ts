import express from "express";
import cron from "node-cron";
import trackerRoute from "./routes/tracker.route";
import markersRoute from "./routes/markers.route";
import teamsRoute from "./routes/teams.route";
import areasRoute from "./routes/areas.route";
import huntsRoute from "./routes/hunts.route";
import articlesRoute from "./routes/articles.route";
import adminRoute from "./routes/admin.route";
import retrieveJotihuntTeams from "./crons/jotihunt-teams.cron";
import retrieveJotihuntAreas from "./crons/jotihunt-areas.cron";
import retrieveJotihuntArticles from "./crons/jotihunt-articles.cron";
import winston from "winston";
import mongoose from "mongoose";
import expressWinston from "express-winston";
import cors from "cors";
import scrapeJotihuntWebsite from "./crons/jotihunt-scraper.cron";
import authRoute from "./routes/auth.route";

const debug = process.env.DEBUG === "true";

// Setup logging with Winston
export const logger = winston.createLogger({
  level: debug ? "debug" : "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`),
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
if (debug) logger.warn("Debug mode enabled");

logger.info("Starting Jotihunt tracker...");

// Check if JWT secret is set
if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET is not set");
  process.exit(1);
}

// Setup express and CORS
logger.info("Setting up Express and loading config...");
const app = express();
app.use(express.json());
app.use(expressWinston.logger({ winstonInstance: logger }));
app.use(cors());

// Setup routes
logger.info("Setting up routes...");
app.use("/auth", authRoute);
app.use("/tracker", trackerRoute);
app.use("/markers", markersRoute);
app.use("/teams", teamsRoute);
app.use("/areas", areasRoute);
app.use("/hunts", huntsRoute);
app.use("/articles", articlesRoute);
app.use("/admin", adminRoute);

// Database connection
const db = process.env.MONGO_URI || "";
logger.info("Trying to connect to MongoDB...");
await mongoose.connect(db).then(() => {
  logger.info("Connected to MongoDB!");
  if (debug) mongoose.set("debug", true);
});

// Start the server
const port = process.env.PORT || 3000;
logger.info(`Starting server on port ${port}...`);
app.listen(port);

// Schedule cron jobs
logger.info("Starting cron jobs...");

cron.schedule("*/5 * * * *", retrieveJotihuntTeams);
cron.schedule("*/10 * * * * *", retrieveJotihuntAreas);
cron.schedule("*/10 * * * * *", retrieveJotihuntArticles);
cron.schedule("*/60 * * * * *", scrapeJotihuntWebsite);
await retrieveJotihuntTeams();
