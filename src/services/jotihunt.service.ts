import axios from "axios";
import { logger } from "..";

const apiUrl = process.env.JOTIHUNT_API_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
});

export interface ApiTeam {
    name: string;
    accomodation: string;
    street: string;
    housenumber: number;
    housenumber_addition: string;
    postcode: string;
    city: string;
    lat: string;
    long: string;
    area: string;
}

export interface ApiArea {
    name: string;
    status: string;
    updated_at: string;
}

/**
 * Function to get all teams from Jotihunt.
 * @returns {Promise<Array>} - A promise that resolves to an array of teams.
 */
export async function getTeams(): Promise<ApiTeam[]> {
  try {
    const response = await apiClient.get("/subscriptions");
    return response.data.data as ApiTeam[];
  } catch (error) {
    logger.error("Error fetching teams:", error);
    throw new Error("Could not fetch teams");
  }
}

/**
 * Function to get all areas from Jotihunt.
 * @returns {Promise<Array>} - A promise that resolves to an array of areas.
 */
export async function getAreas(): Promise<ApiArea[]> {
  try {
    const response = await apiClient.get("/areas");
    return response.data.data as ApiArea[];
  } catch (error) {
    logger.error("Error fetching areas:", error);
    throw new Error("Could not fetch areas");
  }
}