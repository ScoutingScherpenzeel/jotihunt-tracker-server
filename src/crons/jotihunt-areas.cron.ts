import { logger } from "..";
import { Area } from "../models/area.model";
import { getAreas } from "../services/jotihunt.service";

export default async function retrieveJotihuntAreas() {
  logger.info("(CRON) Retrieving Jotihunt areas from API...");

  const apiAreas = await getAreas();

  const areas = apiAreas.map((team) => {
    return {
      name: team.name,
      status: team.status,
      updatedAt: new Date(team.updated_at),
    };
  });

  logger.info(`(CRON) Found ${areas.length} areas`);

  await Area.deleteMany({}).catch((error) => {
    logger.error("(CRON) Error deleting areas from database:", error);
  });
  await Area.insertMany(areas).catch((error) => {
    logger.error("(CRON) Error inserting areas into database:", error);
  });
}
