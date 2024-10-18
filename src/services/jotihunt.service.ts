import axios from "axios";
import { logger } from "..";
import puppeteer, { Page } from "puppeteer";

const apiUrl = process.env.JOTIHUNT_API_URL as string;
const websiteUrl = process.env.JOTIHUNT_WEB_URL as string;
const websiteUsername = process.env.JOTIHUNT_WEB_USERNAME as string;
const websitePassword = process.env.JOTIHUNT_WEB_PASSWORD as string;

const apiClient = axios.create({
  baseURL: apiUrl,
});

export interface ApiTeam {
  id: number;
  name: string;
  accomodation: string;
  street: string;
  housenumber: number;
  housenumber_addition: string;
  postcode: string;
  city: string;
  lat: string;
  long: string;
  area: string;
}

export interface ApiArea {
  name: string;
  status: string;
  updated_at: string;
}

export interface WebHunt {
  area: string;
  huntCode: string;
  status: string;
  points: number;
  huntTime: string;
}

export interface ApiArticle {
  id: number;
  title: string;
  type: string;
  publish_at: string;
  message: {
    content: string;
    type: string;
    max_points: number;
    end_time: string;
  };
}

/**
 * Function to get all teams from Jotihunt.
 * @returns {Promise<Array>} - A promise that resolves to an array of teams.
 */
export async function getTeams(): Promise<ApiTeam[]> {
  try {
    const response = await apiClient.get("/subscriptions");
    return response.data.data as ApiTeam[];
  } catch (error) {
    logger.error("Error fetching teams:", error);
    throw new Error("Could not fetch teams");
  }
}

/**
 * Function to get all areas from Jotihunt.
 * @returns {Promise<Array>} - A promise that resolves to an array of areas.
 */
export async function getAreas(): Promise<ApiArea[]> {
  try {
    const response = await apiClient.get("/areas");
    return response.data.data as ApiArea[];
  } catch (error) {
    logger.error("Error fetching areas:", error);
    throw new Error("Could not fetch areas");
  }
}

/**
 * Function to get all articles from Jotihunt.
 * Only returns the first 15 articles.
 * @returns {Promise<Array>} - A promise that resolves to an array of articles.
 */
export async function getArticles(): Promise<ApiArticle[]> {
  try {
    const response = await apiClient.get("/articles");
    return response.data.data as ApiArticle[];
  } catch (error) {
    logger.error("Error fetching articles:", error);
    throw new Error("Could not fetch articles");
  }
}
/**
 * Use Puppeteer to login to the Jotihunt website.
 * @returns {Promise<Page>} - A promise that resolves to a Puppeteer page.
 */
export async function login(): Promise<Page> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  logger.info("(SCRAPER) Logging in to Jotihunt website with e-mail: " + websiteUsername);
  await page.goto(websiteUrl + "/login");
  await page.type('input[name="email"]', websiteUsername);
  await page.type('input[name="password"]', websitePassword);

  await Promise.all([page.click("button.btn"), page.waitForNavigation()]);

  if (page.url().endsWith("/login")) {
    logger.error("(SCRAPER) Login failed, check your credentials.");
    return Promise.reject("Login failed");
  }

  logger.info("(SCRAPER) Logged in to Jotihunt website.");

  return page;
}

/**
 * Scrape the last 15 hunts from the Jotihunt website.
 * @param page Logged in Puppeteer page.
 */
export async function scrapeHunts(page: Page): Promise<WebHunt[]> {
  logger.info("(SCRAPER) Scraping hunts from Jotihunt website...");

  await page.goto(websiteUrl + "/hunts");

  const hunts = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("table tbody tr"));
    return rows.map((row) => {
      const columns = Array.from(row.querySelectorAll("td"));
      return {
        area: columns[0].textContent,
        huntCode: columns[1].textContent,
        status: columns[2].textContent,
        points: parseInt(columns[3].textContent || "0"),
        huntTime: columns[4].textContent,
      } as WebHunt;
    });
  });

  logger.info(`(SCRAPER) Found ${hunts.length} hunts from website.`);

  return hunts;
}
