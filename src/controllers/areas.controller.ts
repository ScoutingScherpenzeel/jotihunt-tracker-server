import { Area } from "../models/area.model";
import { Request, Response } from "express";

export async function getAreas(_req: Request, res: Response) {
  const areas = await Area.find();
  return res.status(200).json(areas);
}
