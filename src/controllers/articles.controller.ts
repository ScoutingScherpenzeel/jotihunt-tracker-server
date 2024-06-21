import { Article } from "../models/article.model";

export async function getArticles(req, res) {
    const articles = await Article.find();
    return res.status(200).json(articles);
}