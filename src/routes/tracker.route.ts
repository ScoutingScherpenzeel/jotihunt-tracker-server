import express from "express";
import * as trackerController from "../controllers/tracker.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/devices", verifyToken, trackerController.getDevices);
router.get("/positions", verifyToken, trackerController.getPositions);

export default router;
