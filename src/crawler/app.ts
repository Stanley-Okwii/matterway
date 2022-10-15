import * as puppeteer from "puppeteer";
import * as prompts from "prompts";

import { getRandomNumber } from "../utils/helpers";
import { password, email, goodReadsLink, amazonLink } from "../utils/constants";

(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();
  await page.goto(goodReadsLink);
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

  const randomBookTitle = bookTitles[getRandomNumber(0, 19)];

  await page.close();
  await browser.close();

  browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    // slowMo: 250,
  });
  page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 1822 });

  // Navigate book on amazon.com
  await page.goto(amazonLink);

  // Login into amazon if password and email exist
  if (email && password) {
    await page.waitForSelector(
      "#nav-signin-tooltip > .nav-action-button > .nav-action-inner"
    );
    await page.click(
      " #nav-signin-tooltip > .nav-action-button > .nav-action-inner"
    );

    await page.waitForSelector("#ap_email");
    await page.type("#ap_email", email);

    await page.click("#continue");

    await page.waitForSelector("#ap_password");
    await page.type("#ap_password", password);

    await page.click("#signInSubmit");
  }

  await page.waitForSelector("#searchDropdownBox");
  const dismissPopUp = await page.$("input[data-action-type='DISMISS']");

  // Dismiss change country pop up modal
  if (dismissPopUp) {
    await page.click("input[data-action-type='DISMISS']");
  }

  // Select book category to optimize search
  await page.click("#nav-search-dropdown-card");
  await page.select("#searchDropdownBox", "search-alias=stripbooks-intl-ship");

  // Type random book title in the search input
  await page.type("#twotabsearchtextbox", randomBookTitle);
  await page.click("#nav-search-submit-button");

  await page.waitForSelector("div[data-cel-widget='MAIN-SEARCH_RESULTS-1']");

  await Promise.all([
    page.waitForNavigation(),
    page.click(
      "div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(2) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-mini > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a"
    ),
  ]);

  await page.waitForSelector("#add-to-cart-button");
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
