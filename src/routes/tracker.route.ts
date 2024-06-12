const express = require("express");
const router = express.Router();

const trackerController = require("../controllers/tracker.controller");

router.get("/devices", trackerController.getDevices);
router.get("/positions", trackerController.getPositions);

export default router;
