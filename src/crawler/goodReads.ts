import * as puppeteer from "puppeteer";
import * as prompts from "prompts";
import { Answers } from "prompts";
import { Browser, Page } from "puppeteer";

import { getRandomNumber } from "../utils/helpers";
import { goodReadsLink } from "../utils/constants";
import { Genre } from "../utils/types";

export const getRandomGoodReadsBookTitle = async () => {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  // Navigate to goodreads page
  await page.goto(goodReadsLink);
  const choices: Array<Genre> | null = await page.$$eval(
    "#categories > div > div.category",
    (elements) => {
      return elements.map((element: any) => element?.firstElementChild && ({
        title: element.firstElementChild.innerText,
        value: element.firstElementChild.href,
      }));
    }
  );

  const selectedCategory: Answers<string> = await prompts([
    {
      type: "select",
      name: "genre",
      message: "Select preferred genre",
      choices,
    },
  ]);

  // Navigate to goodreads page containing books for selected category
  await page.goto(selectedCategory.genre);

  const bookTitles = await page.$$eval(
    "div.poll > div.pollContents > div.pollAnswer > div.answerWrapper > div",
    (elements) => {
      return elements.map(
        (element: Element) => element.getElementsByTagName("img")[0].alt
      );
    }
  );

  const randomBookTitle = bookTitles[getRandomNumber(0, 19)];

  await page.close();
  await browser.close();

  return randomBookTitle;
};
