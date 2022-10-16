require('dotenv').config();

export const goodReadsLink: string =
  "https://www.goodreads.com/choiceawards/best-books-2020";
export const amazonLink: string = "https://www.amazon.com/";
export const email: string | undefined = process.env.AMAZON_EMAIL;
export const password: string | undefined  = process.env.AMAZON_PASSWORD;
export const userAgent: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36";
