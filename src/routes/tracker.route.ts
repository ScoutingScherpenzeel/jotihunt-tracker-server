import express from "express";
import * as trackerController from "../controllers/tracker.controller";

const router = express.Router();

router.get("/devices", trackerController.getDevices);
router.get("/positions", trackerController.getPositions);

export default router;
