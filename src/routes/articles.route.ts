import express from "express";
import * as articlesController from "../controllers/articles.controller";

const router = express.Router();

router.get("/", articlesController.getArticles);

export default router;
