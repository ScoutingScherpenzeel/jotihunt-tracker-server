import { Area } from "../models/area.model";

export async function getAreas(req, res) {
    const areas = await Area.find();
    return res.status(200).json(areas);
}