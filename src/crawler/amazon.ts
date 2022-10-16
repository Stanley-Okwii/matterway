import * as puppeteer from "puppeteer";
import { Browser, Page } from "puppeteer";

import { password, email, amazonLink, userAgent } from "../utils/constants";
import { waitForElementAndClick, loginToAmazon } from "../utils/helpers";

export const addBookToAmazonCart = async (bookTitle: string) => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
  });
  const page: Page = await browser.newPage();

  try {
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1200, height: 1822 });

    // Navigate book on amazon.com
    await page.goto(amazonLink);

    // Login into amazon if password and email exist
    if (email && password) {
      await loginToAmazon(page, email, password);
    }

    // Select book category to optimize search
    await page.waitForSelector("#searchDropdownBox");
    await page.click("#nav-search-dropdown-card");
    await page.select(
      "#searchDropdownBox",
      "search-alias=stripbooks-intl-ship"
    );

    // Type random book title in the search input
    await page.type("#twotabsearchtextbox", bookTitle);
    await page.click("#nav-search-submit-button");

    // Select first result on the page
    await page.waitForSelector("div[data-cel-widget='MAIN-SEARCH_RESULTS-1']");

    // Select the first book available in Paperback format
    const [PaperbackLink]: any = await page.$x(
      '//a[contains(text(), "Paperback")]'
    );
    if (PaperbackLink) {
      await PaperbackLink.click();
    }

    // Add book to cart
    await waitForElementAndClick(page, "#add-to-cart-button");

    // Navigate to the checkout page
    await waitForElementAndClick(
      page,
      "input[data-feature-id='proceed-to-checkout-action']"
    );
  } catch (error) {
    console.error("Error: ", error);
    await page.close();
    await browser.close();
  }
};
