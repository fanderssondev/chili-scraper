import puppeteer from 'puppeteer';
import * as fs from 'fs';

interface Product {
  sku: string;
  title: string;
  hotness: number;
  price: number;
  pictures: {
    smallPic: string;
    largePics: string[];
  };
  shortDescription: string;
  description: string;
}

const baseURL = 'https://www.pepperworldhotshop.com/en/bbq-shop/fresh-chillies/';

const scrape = async () => {
  const start = Date.now();

  console.log('scraping...');

  // Launch browser and open new page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(baseURL, { waitUntil: 'networkidle0' });

  // Wait for the images to load by targeting the specific selector for the images
  // await page.waitForSelector('.productList > .productBox.product-box img');

  const res = await page.$$eval('.productList > .productBox.product-box > .borderbox > form', (elements) => {
    console.log('inside', new Date());
    return elements.map((e) => {
      return {
        title: e.querySelector<HTMLDivElement>('.listDetails > .title')?.innerText,
        hotness: +(e.querySelector<HTMLImageElement>('.listDetails > .hotness > img')?.title.split(' ')[1] ?? -1),
        price: +(
          e
            .querySelector<HTMLAnchorElement>('.listDetails > .price > .content > .lead > a')
            ?.innerText.split(' ')[0]
            .replace(',', '.') ?? -1
        ),
        pictures: {
          smallPic: e.querySelector<HTMLImageElement>('img')?.getAttribute('data-src'),
        },
      };
    });
  });

  // console.log(res);

  fs.writeFile('products.json', JSON.stringify(res, null, 2), (err) => {});

  // Close browser
  await browser.close();

  const end = Date.now();
  console.log(`Scraping took ${(end - start) / 1000} seconds`);
};

scrape();
