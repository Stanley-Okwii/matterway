import { Page } from "puppeteer";

export const waitForSelector = async (page: Page, selector: string) => {
  return page.waitForSelector(selector);
};

export const waitForSelectorAndClick = async (page: Page, selector: string) => {
  await waitForSelector(page, selector);
  await page.click(selector);
};

export const waitForElementAndClick = async (page: Page, selector: string) => {
  await page.waitForSelector(selector);
  await page.$eval(
    selector,
    (element: Element) => element instanceof HTMLElement && element.click()
  );
};

export const waitForSelectorAndType = async (
  page: Page,
  selector: string,
  value: string
) => {
  await waitForSelector(page, selector);
  await page.type(selector, value);
};

export const loginToAmazon = async (
  page: Page,
  email: string,
  password: string
) => {
  await waitForSelectorAndClick(
    page,
    "#nav-signin-tooltip > .nav-action-button > .nav-action-inner"
  );
  await waitForSelectorAndType(page, "#ap_email", email);
  await waitForSelectorAndClick(page, "#continue");

  await waitForSelectorAndType(page, "#ap_password", password);

  await waitForSelectorAndClick(page, "#signInSubmit");
};

export const getRandomNumber = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
