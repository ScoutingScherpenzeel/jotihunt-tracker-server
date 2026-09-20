import { logger } from "..";
import { Hunt } from "../models/hunt.model";
import { login, scrapeHunts } from "../services/jotihunt.service";
import { Page } from "puppeteer";

let isScrapingJotihuntWebsite = false;

export default async function scrapeJotihuntWebsite() {
  if (isScrapingJotihuntWebsite) {
    logger.warn("(CRON) Skipping Jotihunt website scrape because a previous run is still in progress.");
    return;
  }

  isScrapingJotihuntWebsite = true;
  logger.info("(CRON) Scraping required data from Jotihunt website...");

  let page: Page | undefined;

  try {
    const currentPage = await login();
    page = currentPage;

    const webHunts = await scrapeHunts(currentPage);
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
  } finally {
    if (page) {
      await page.close().catch(() => undefined);
      await page.browser().close().catch(() => undefined);
    }

    isScrapingJotihuntWebsite = false;
  }
}
