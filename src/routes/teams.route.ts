import express from "express";
import * as teamsController from "../controllers/teams.controller";

const router = express.Router();

router.get("/", teamsController.getTeams);

export default router;
