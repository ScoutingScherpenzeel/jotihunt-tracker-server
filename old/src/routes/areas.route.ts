import express from "express";
import * as areasController from "../controllers/areas.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, areasController.getAreas);

export default router;
