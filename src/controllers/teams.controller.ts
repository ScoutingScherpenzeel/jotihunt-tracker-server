import { Team } from "../models/team.model";

export async function getTeams(req, res) {
    const teams = await Team.find();
    return res.status(200).json(teams);
}