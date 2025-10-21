import express from "express";
import * as articlesController from "../controllers/articles.controller";
import verifyToken from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", verifyToken, articlesController.getArticles);

export default router;
