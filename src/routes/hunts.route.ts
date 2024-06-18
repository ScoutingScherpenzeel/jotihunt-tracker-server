import express from "express";
import * as huntsController from "../controllers/hunts.controller";

const router = express.Router();

router.get("/", huntsController.getHunts);

export default router;
