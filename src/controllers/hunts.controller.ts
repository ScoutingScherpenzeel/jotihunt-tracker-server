import { Hunt } from "../models/hunt.model";
import { Request, Response } from 'express';

export async function getHunts(_req: Request, res: Response) {
    const hunts = await Hunt.find().sort({ updatedAt: -1 });
    return res.status(200).json(hunts);
}