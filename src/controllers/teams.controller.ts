import { Team } from "../models/team.model";
import { Request, Response } from 'express';

export async function getTeams(_req: Request, res: Response) {
    const teams = await Team.find();
    return res.status(200).json(teams);
}