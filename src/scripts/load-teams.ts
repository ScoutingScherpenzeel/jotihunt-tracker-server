import mongoose from "mongoose";
import { logger } from "..";
import { getTeams } from "../services/jotihunt.service";
import { Team } from "../models/team.model";

async function loadTeams() {
  const connection = await mongoose.connect(process.env.MONGO_URI!);

  logger.info("Retrieving Jotihunt teams from API...");
  const apiTeams = await getTeams();

  const teams = apiTeams.map((team) => {
    return {
      apiId: team.id,
      name: team.name,
      accomodation: team.accomodation,
      street: team.street,
      houseNumber: team.housenumber,
      housenumberAddition: team.housenumber_addition,
      postCode: team.postcode,
      city: team.city,
      area: team.area,
      location: {
        type: "Point",
        coordinates: [team.long, team.lat],
      },
    };
  });

  logger.info(`Found ${teams.length} teams`);

  await Team.deleteMany({}).catch((error) => {
    logger.error("Error deleting teams from database:", error);
    process.exit(1);
  });
  await Team.insertMany(teams).catch((error) => {
    logger.error("Error inserting teams into database:", error);
    process.exit(1);
  });
}

await loadTeams();
