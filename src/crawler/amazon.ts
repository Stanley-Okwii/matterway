import * as puppeteer from "puppeteer";
import { Browser, Page, ElementHandle } from "puppeteer";

import { password, email, amazonLink, userAgent } from "../utils/constants";
import {
  waitForSelectorAndClick,
  waitForSelectorAndType,
  waitForElementAndClick,
} from "../utils/helpers";

export const addBookToAmazonCart = async (bookTitle: string) => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
  });
  const page: Page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.setViewport({ width: 1200, height: 1822 });

  // Navigate book on amazon.com
  await page.goto(amazonLink);

  // Dismiss change country pop up modal
  const dismissPopUp: ElementHandle<Element> | null = await page.$(
    "input[data-action-type='DISMISS']"
  );
  if (dismissPopUp) {
    await page.click("input[data-action-type='DISMISS']");
  }

  // Login into amazon if password and email exist
  if (email && password) {
    await waitForSelectorAndClick(
      page,
      "#nav-signin-tooltip > .nav-action-button > .nav-action-inner"
    );
    await waitForSelectorAndType(page, "#ap_email", email);
    await waitForSelectorAndClick(page, "#continue");

    await waitForSelectorAndType(page, "#ap_password", password);

    await waitForSelectorAndClick(page, "#signInSubmit");
  }

  // Select book category to optimize search
  await page.waitForSelector("#searchDropdownBox");
  await page.click("#nav-search-dropdown-card");
  await page.select("#searchDropdownBox", "search-alias=stripbooks-intl-ship");

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
};
