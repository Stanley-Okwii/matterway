import { Page } from "puppeteer";

export const waitForSelector = async (page: Page, selector: string) => {
  return page.waitForSelector(selector, { timeout: 10000 });
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

export const getRandomNumber = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};
