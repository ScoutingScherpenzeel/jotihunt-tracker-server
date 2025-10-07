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

export async function reloadTeams(_req: Request, res: Response) {
    const { exec } = await import("child_process");
    exec("bun run load-teams", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ message: "Error reloading teams", error });
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        return res.status(200).json({ message: "Teams reloaded" });
    });
}