import axios from "axios";
import {logger} from "..";
import puppeteer, {Page} from "puppeteer";
import {ApiArea, ApiArticle, WebHunt} from "../types/api";

const apiUrl = process.env.JOTIHUNT_API_URL as string;
const websiteUrl = process.env.JOTIHUNT_WEB_URL as string;
const websiteUsername = process.env.JOTIHUNT_WEB_USERNAME as string;
const websitePassword = process.env.JOTIHUNT_WEB_PASSWORD as string;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const apiClient = axios.create({
    baseURL: apiUrl,
});

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
    const environment = process.env.NODE_ENV;
    const isProduction = environment === "production";
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ...(isProduction && { executablePath: "/usr/bin/chromium" })
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);

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
