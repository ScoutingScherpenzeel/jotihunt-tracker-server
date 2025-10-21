import { logger } from "..";
import { Article } from "../models/article.model";
import { getArticles } from "../services/jotihunt.service";

export default async function retrieveJotihuntArticles() {
  logger.info("(CRON) Retrieving Jotihunt articles from API...");

  const apiArticles = await getArticles();

  const articles = apiArticles.map((article) => {
    return {
      id: article.id,
      title: article.title,
      type: article.type,
      publishAt: article.publish_at,
      content: article.message.content,
      messageType: article.message.type,
      maxPoints: article.message.max_points,
      endTime: article.message.end_time,
    };
  });

  logger.info(`(CRON) Found ${articles.length} articles`);

  await Article.deleteMany({}).catch((error) => {
    logger.error("(CRON) Error deleting articles from database:", error);
  });
  await Article.insertMany(articles).catch((error) => {
    logger.error("(CRON) Error inserting articles into database:", error);
  });
}
