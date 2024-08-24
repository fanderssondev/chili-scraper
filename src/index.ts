import { title } from 'process';
import puppeteer from 'puppeteer';

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
  console.log('scraping...');

  // Launch browser and open new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('before');
  await page.goto(baseURL, { waitUntil: 'networkidle0' });
  console.log('after');

  const res = await page.$$eval('.productList > .productBox.product-box > .borderbox > form', (elements) => {
    return elements.map((e) => {
      return {
        title: e.querySelector<HTMLDivElement>('.listDetails > .title')?.innerText ?? 'FAILED',
        hotness: +(e.querySelector<HTMLImageElement>('.listDetails > .hotness > img')?.title.split(' ')[1] ?? 0),
        price: +(
          e
            .querySelector<HTMLAnchorElement>('.listDetails > .price > .content > .lead > a')
            ?.innerText.split(' ')[0]
            .replace(',', '.') ?? 0
        ),
        pictures: {
          smallPic: e.querySelector<HTMLImageElement>('img')?.src,
        },
      };
    });
  });

  console.log(res);

  // Close browser
  await browser.close();
};

scrape();

// https://www.pepperworldhotshop.com/out/pictures/generated/product/1/160_155_75/ba097_die-letzten-ihrer-art.jpg
// https://www.pepperworldhotshop.com/out/pictures/master/product/1/ba097_die-letzten-ihrer-art.jpg
