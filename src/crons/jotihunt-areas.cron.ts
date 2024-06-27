import { logger } from "..";
import { Area } from "../models/area.model";
import { getAreas } from "../services/jotihunt.service";

export default async function retrieveJotihuntAreas() {
  logger.info("Retrieving Jotihunt areas from API...");

  const apiAreas = await getAreas();

  const areas = apiAreas.map((team) => {
    return {
      name: team.name,
      status: team.status,
      updatedAt: new Date(team.updated_at),
    };
  });

  logger.info(`Found ${areas.length} areas`);

  await Area.deleteMany({}).catch((error) => {
    logger.error("Error deleting areas from database:", error);
  });
  await Area.insertMany(areas).catch((error) => {
    logger.error("Error inserting areas into database:", error);
  });
}
