import { logger } from "..";
import { Team } from "../models/team.model";
import { getTeams } from "../services/jotihunt.service";

export default async function retrieveJotihuntTeams() {
    logger.info("(CRON) Retrieving Jotihunt teams from API...");
    const apiTeams = await getTeams();
    
    let teams = apiTeams.map((team) => {
        return {
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

    logger.info(`(CRON) Found ${teams.length} teams`);

    await Team.deleteMany({}).catch((error) => { logger.error("Error deleting teams from database:", error) });
    await Team.insertMany(teams).catch((error) => { logger.error("Error inserting teams into database:", error) });
        
}