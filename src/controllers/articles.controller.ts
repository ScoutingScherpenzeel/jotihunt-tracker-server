import { Article } from "../models/article.model";
import { Request, Response } from 'express';

export async function getArticles(_req: Request, res: Response) {
    const articles = await Article.find();
    return res.status(200).json(articles);
}