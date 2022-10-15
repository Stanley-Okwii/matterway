import * as puppeteer from "puppeteer";
import * as prompts from "prompts";
import { getRandomInt } from "../utils";

const goodReads: string =
  "https://www.goodreads.com/choiceawards/best-books-2020";

const amazon: string = "https://www.amazon.com/";

(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(goodReads);
  const choices = await page.$$eval(
    "#categories > div > div.category",
    (elements) => {
      return elements.map((element: any) => ({
        title: element.firstElementChild.innerText,
        value: element.firstElementChild.href,
      }));
    }
  );

  const selectedCategory: any = await (async () => {
    return await prompts([
      {
        type: "select",
        name: "genre",
        message: "Select preferred genre",
        choices,
      },
    ]);
  })();

  await page.goto(selectedCategory.genre);
  const bookTitles = await page.$$eval(
    "div.poll > div.pollContents > div.pollAnswer > div.answerWrapper > div",
    (elements) => {
      return elements.map(
        (element: any) => element.getElementsByTagName("img")[0].alt
      );
    }
  );

  const randomBookTitle = bookTitles[getRandomInt(0, 19)];

  await page.close();
  await browser.close();

  browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    slowMo: 250,
  });
  page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.setViewport({
    width: 1240,
    height: 1080,
  });

  // Search book on amazon
  await page.goto(amazon);
  await page.waitForSelector("#searchDropdownBox");
  const dismissPopUp = await page.$("input[data-action-type='DISMISS']");

  // Dismiss change country pop up modal
  if (dismissPopUp) {
    await page.click("input[data-action-type='DISMISS']");
  }
  await page.click("#nav-search-dropdown-card");
  await page.select("#searchDropdownBox", "search-alias=stripbooks-intl-ship");
  await page.type("#twotabsearchtextbox", randomBookTitle);
  await page.click("#nav-search-submit-button");

  await page.waitForSelector("div[data-cel-widget='MAIN-SEARCH_RESULTS-1']");

  await Promise.all([
    page.waitForNavigation(),
    page.click(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(2) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-mini > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a"
    ),
  ]);
  await page.$eval(
    "#add-to-cart-button",
    (addToCartButton: any) => addToCartButton && addToCartButton.click()
  );

  await page.waitForSelector("#NATC_SMART_WAGON_CONF_MSG_SUCCESS");
  await page.$eval(
    "input[data-feature-id='proceed-to-checkout-action']",
    (checkoutButton: any) => checkoutButton && checkoutButton.click()
  );
})();
