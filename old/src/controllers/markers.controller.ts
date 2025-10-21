import { logger } from "..";
import { Marker, MarkerType } from "../models/marker.model";
import { Request, Response } from "express";

export async function getMarkers(_req: Request, res: Response) {
  const markers = await Marker.find();
  return res.status(200).json(markers);
}

export async function createMarker(req: Request, res: Response) {
  try {
    const { area, location, time, type } = req.body;

    // Validate request body
    if (!area || !time || !location || !location.coordinates || !type || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({
        message: "Area, type, time and coordinates (array of [longitude, latitude]) are required",
      });
    }

    // Area must be any of the following: alpha, bravo, charlie, delta, echo, foxtrot, golf, hotel, oscar
    if (!["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "oscar"].includes(area)) {
      return res.status(400).json({
        message: "Area must be any of the following: alpha, bravo, charlie, delta, echo, foxtrot, golf, hotel, oscar",
      });
    }

    // Type must be any of values in markertype enum
    if (!Object.values(MarkerType).includes(type)) {
      return res.status(400).json({
        message: "Type must be any of the following: " + Object.values(MarkerType).join(", "),
      });
    }

    // Time must be a valid date
    const parsedTime = new Date(time);

    if (isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "Time must be a valid date" });
    }

    parsedTime.setSeconds(0);

    if(type == MarkerType.Hint) parsedTime.setMinutes(0);

    // Create a new marker
    const marker = new Marker({
      area,
      time: parsedTime,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      type,
    });

    // Save the marker to the database
    await marker.save();

    return res.status(201).json(marker);
  } catch (error) {
    logger.error("Error creating marker", error);
    return res.status(500).json({ message: "Error creating marker", error });
  }
}

export async function deleteMarker(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate request parameters
    if (!id) {
      return res.status(400).json({
        message: "Marker ID is required",
      });
    }

    // Find the marker by ID
    const marker = await Marker.findById(id);

    if (!marker) {
      return res.status(404).json({
        message: "Marker not found",
      });
    }

    // Delete the marker
    await Marker.findByIdAndDelete(id);

    return res.status(200).json(marker);
  } catch (error) {
    logger.error("Error deleting marker", error);
    return res.status(500).json({ message: "Error deleting marker", error });
  }
}
