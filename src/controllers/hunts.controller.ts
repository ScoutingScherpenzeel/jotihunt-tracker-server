import { Hunt } from "../models/hunt.model";

export async function getHunts(req, res) {
    const hunts = await Hunt.find();
    return res.status(200).json(hunts);
}