import express from "express";
import * as teamsController from "../controllers/teams.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, teamsController.getTeams);

export default router;
