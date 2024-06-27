import * as traccarrService from "../services/traccarr.service";
import { Request, Response } from "express";

async function getDevices(req: Request, res: Response) {
  try {
    const devices = await traccarrService.getDevices();
    res.json(devices);
  } catch (error) {
    if (error instanceof Error) res.status(500).send(error.message);
  }
}

async function getPositions(req: Request, res: Response) {
  try {
    const positions = await traccarrService.getPositions();
    res.json(positions);
  } catch (error) {
    if (error instanceof Error) res.status(500).send(error.message);
  }
}

export { getDevices, getPositions };
