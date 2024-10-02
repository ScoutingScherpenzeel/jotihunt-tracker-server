import * as traccarrService from "../services/traccarr.service";
import { Request, Response } from "express";

async function getDevices(req: Request, res: Response) {
  try {
    const devices = await traccarrService.getDevices();
    const groups = await traccarrService.getGroups();
    devices.forEach((device) => {
      const group = groups.find((group) => group.id === device.groupId);
      device.groupName = group ? group.name : undefined;
    });
    res.json(devices);
  } catch (error) {
    if (error instanceof Error) res.status(500).send(error.message);
  }
}

async function getPositions(req: Request, res: Response) {
  try {
    const positions = await traccarrService.getPositions();
  } catch (error) {
    if (error instanceof Error) res.status(500).send(error.message);
  }
}

export { getDevices, getPositions };
