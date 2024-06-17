import express from "express";
import * as areasController from "../controllers/areas.controller";

const router = express.Router();

router.get("/", areasController.getAreas);

export default router;
