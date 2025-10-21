import { logger } from "..";
import { Hunt } from "../models/hunt.model";
import { login, scrapeHunts } from "../services/jotihunt.service";

export default async function scrapeJotihuntWebsite() {
  logger.info("(CRON) Scraping required data from Jotihunt website...");

  const page = await login();

  const webHunts = await scrapeHunts(page);
  const hunts = webHunts.map((webHunt) => {
    return {
      area: webHunt.area,
      status: webHunt.status,
      huntCode: webHunt.huntCode,
      points: webHunt.points,
      huntTime: webHunt.huntTime,
      updatedAt: new Date(),
    };
  });

  await Hunt.deleteMany({}).catch((error) => {
    logger.error("(CRON) Error deleting hunts from database:", error);
  });
  await Hunt.insertMany(hunts).catch((error) => {
    logger.error("(CRON) Error inserting hunts into database:", error);
  });

  await page.close();
  await page.browser().close();
}
