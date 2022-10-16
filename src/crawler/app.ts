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
  });
  page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
  );
  await page.setViewport({ width: 1200, height: 1822 });

  // Navigate book on amazon.com
  await page.goto(amazonLink);

  // Dismiss change country pop up modal
  const dismissPopUp = await page.$("input[data-action-type='DISMISS']");
  if (dismissPopUp) {
    await page.click("input[data-action-type='DISMISS']");
  }

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

  // Select book category to optimize search
  await page.waitForSelector("#searchDropdownBox");
  await page.click("#nav-search-dropdown-card");
  await page.select("#searchDropdownBox", "search-alias=stripbooks-intl-ship");

  // Type random book title in the search input
  await page.type("#twotabsearchtextbox", randomBookTitle);
  await page.click("#nav-search-submit-button");

  // Select first result on the page
  await page.waitForSelector("div[data-cel-widget='MAIN-SEARCH_RESULTS-1']");

  // Select the first book available in Paperback format
  const [PaperbackLink]: any = await page.$x(
    '//a[contains(text(), "Paperback")]'
  );
  await PaperbackLink.click();

  // Add book to cart
  await page.waitForSelector("#add-to-cart-button");
  await page.$eval(
    "#add-to-cart-button",
    (addToCartButton: any) => addToCartButton && addToCartButton.click()
  );

  // Navigate to the checkout page
  await page.waitForSelector(
    "input[data-feature-id='proceed-to-checkout-action']"
  );
  await page.$eval(
    "input[data-feature-id='proceed-to-checkout-action']",
    (checkoutButton: any) => checkoutButton && checkoutButton.click()
  );
})();
