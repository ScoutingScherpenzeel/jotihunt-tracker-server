import express from "express";
import * as teamsController from "../controllers/teams.controller";
import verifyToken from "../middleware/auth.middleware";
import { body, param } from "express-validator";
import { Area } from "../models/area.model";
import { validate } from "../middleware/validate.middleware";
import { Team } from "../models/team.model";

// Validations
const updateAreaValidator = [
  body("area").notEmpty().withMessage("Area must not be empty"),
  body("area").isString().withMessage("Area must be a string"),
  body("area").isMongoId().withMessage("Area must be a mongoId"),
  body("area").custom(async (value) => {
    const area = await Area.findById(value);
    if (!area) {
      throw new Error("Area must exist in the areas table");
    }

    return true;
  }),
  param("id").notEmpty().withMessage("Id must not be empty"),
  param("id").isMongoId().withMessage("Id must be a mongoId"),
  param("id").custom(async (value) => {
    const team = await Team.findById(value);
    if (!team) {
      throw new Error("Team must exist in the teams table");
    }
    return true;
  }),
];
const router = express.Router();

router.get("/", verifyToken, teamsController.getTeams);
router.put("/:id/area", [verifyToken, validate(updateAreaValidator)], teamsController.setTeamArea);

export default router;
