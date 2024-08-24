import express from "express";
import * as authController from "../controllers/auth.controller";
const router = express.Router();

router.post("/login", authController.login);

export default router;
