import { Team } from "../models/team.model";
import { Request, Response } from "express";

export async function getTeams(_req: Request, res: Response) {
  const teams = await Team.find();
  return res.status(200).json(teams);
}

export async function setTeamArea(req: Request, res: Response) {
  const { id } = req.params;
  const { area } = req.body;

  const team = await Team.findById(id);
  team!.area = area;
  await team!.save();
  res.status(200).json(team);
}
