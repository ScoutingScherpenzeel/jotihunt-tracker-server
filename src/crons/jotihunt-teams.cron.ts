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

    await Team.deleteMany({});
    await Team.insertMany(teams);
        
}