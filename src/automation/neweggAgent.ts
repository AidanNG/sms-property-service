import { chromium } from "playwright";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
export async function loginToNewegg() {
  const browser = await chromium.launch({ headless: false }); // Set true for headless automation
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    logger.info("🌐 Navigating to Newegg login...");
    await page.goto("https://secure.newegg.com/identity/signin?tk=b767ea_765ccca5ad4145e0bf09b7853db90236122fb", {
      waitUntil: "domcontentloaded",
    });

    await page.getByRole('button', { name: 'refresh' }).click();   
    logger.info("📝 Filling in credentials...");
    await page.fill('input[type="email"]', env.NEWEGG_EMAIL);
    await page.click('button[type="submit"]'); // Continue button

    // Wait for password field to appear
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.fill('input[type="password"]', env.NEWEGG_PASSWORD);

    logger.info("🔐 Submitting login form...");
    await page.click('button[type="submit"]');

    // Wait for dashboard or homepage
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 });

    if (page.url().includes("newegg.com")) {
      logger.info("✅ Logged into Newegg successfully!");
    } else {
      logger.warn("⚠️ Login may not have succeeded, check for CAPTCHA.");
    }

    // Example: Navigate to account dashboard
    await page.goto("https://secure.newegg.com/myaccount/dashboard");
    logger.info("📋 Navigated to Newegg account dashboard.");

    // Example: Fill a dummy form (like search)
    await page.goto("https://www.newegg.com/");
    await page.fill('input[type="search"]', "Graphics Card");
    await page.press('input[type="search"]', "Enter");
    logger.info("🔎 Performed product search.");

  } catch (error) {
    logger.error("❌ Newegg automation failed:", error);
  } finally {
    await browser.close();
  }
}

loginToNewegg();
