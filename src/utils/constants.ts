require('dotenv').config();

export const goodReadsLink: string =
  "https://www.goodreads.com/choiceawards/best-books-2020";
export const amazonLink: string = "https://www.amazon.com/";
export const email: string | undefined = process.env.AMAZON_EMAIL;
export const password: string | undefined  = process.env.AMAZON_PASSWORD;
