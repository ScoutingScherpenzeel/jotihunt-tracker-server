import mongoose from "mongoose";
import { Team } from "../models/team.model";
import axios from "axios";
import { ApiTeam } from "../types/api";

const apiUrl = process.env.JOTIHUNT_API_URL as string;

const apiClient = axios.create({
  baseURL: apiUrl,
});

/**
 * Function to get all teams from Jotihunt.
 * @returns {Promise<Array>} - A promise that resolves to an array of teams.
 */
export async function getTeams(): Promise<ApiTeam[]> {
  try {
    const response = await apiClient.get("/subscriptions");
    return response.data.data as ApiTeam[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Could not fetch teams");
    process.exit(1);
  }
}

async function loadTeams() {
  const connection = await mongoose.connect(process.env.MONGO_URI!);

  console.log("Retrieving Jotihunt teams from API...");
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

  console.log(`Found ${teams.length} teams`);

  await Team.deleteMany({}).catch((error) => {
    console.log("Error deleting teams from database:", error);
    process.exit(1);
  });
  await Team.insertMany(teams).catch((error) => {
    console.log("Error inserting teams into database:", error);
    process.exit(1);
  });

  process.exit(0);
}

await loadTeams();
