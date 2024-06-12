import express from "express";
const router = express.Router();

const markersController = require("../controllers/markers.controller");

router.get("/", markersController.getMarkers);
router.post("/", markersController.createMarker);

export default router;
