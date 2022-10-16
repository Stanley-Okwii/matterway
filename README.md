# MATTERWAY

This is a web crawler app that allows a user to place an order for a book on amazon. A selects a book category from goodreads and the

## Pre-requisites

- Node v16.13.2 (Can be downloaded [here](https://nodejs.org/download/release/v16.13.2/)). Download a `.pkg` file to install Node on MacOS.

## To Run

- Clone this repository, run `git clone https://github.com/Stanley-Okwii/matterway.git`
- Run `npm run install` to install project dependencies
- Copy the `.env` file in the root of the project, and copy over the variables from `.env.example`. Add your amazon password and email if you would the web crawler to show the amazon checkout page.
- For Mac OS users, run `sudo codesign --force --deep --sign - ./node_modules/puppeteer-core/.local-chromium/*/chrome-mac/Chromium.app` to sign the chromium.app used by puppeteer. Signing the app prevents a warning pop from showing when the script runs.
- Run `npm run start` to start the crawler

## Demo

![1](/screenshots/web_crawler.gif)

## Unhandled Edge Cases

- Order for a given book is not available in Paperback format.
