import express from "express";
import * as markersController from "../controllers/markers.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, markersController.getMarkers);
router.post("/", verifyToken, markersController.createMarker);
router.delete("/:id", verifyToken, markersController.deleteMarker);

export default router;
