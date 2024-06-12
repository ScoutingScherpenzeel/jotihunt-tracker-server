import { Marker } from "../models/marker";

export async function getMarkers(req, res) {
  const markers = await Marker.find();
  return res.status(200).json(markers);
}

export async function createMarker(req, res) {
  try {
    const { name, coordinates } = req.body;

    // Validate request body
    if (!name || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        message: "Name and coordinates (array of [longitude, latitude]) are required",
      });
    }

    // Create a new marker
    const marker = new Marker({
      name,
      location: {
        type: "Point",
        coordinates,
      },
    });

    // Save the marker to the database
    await marker.save();

    return res.status(201).json(marker);
  } catch (error) {
    return res.status(500).json({ message: "Error creating marker", error });
  }
}
