import express from "express";
import * as markersController from "../controllers/markers.controller";

const router = express.Router();

router.get("/", markersController.getMarkers);
router.post("/", markersController.createMarker);
router.delete("/:id", markersController.deleteMarker);

export default router;
