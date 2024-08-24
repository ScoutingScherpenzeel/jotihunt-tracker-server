import express from "express";
import * as huntsController from "../controllers/hunts.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, huntsController.getHunts);

export default router;
