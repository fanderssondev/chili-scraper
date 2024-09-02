import puppeteer from 'puppeteer';
import * as fs from 'fs';

// interface Product {
//   sku: string;
//   slug: string;
//   title: string;
//   hotness: number;
//   price: number;
//   pictures: {
//     smallPic: string;
//     largePics: string[];
//   };
//   shortDescription: string;
//   description: string;
// }

interface Product {
  title: string;
  hotness: number;
  price: number;
  pictures: {
    smallPic: string;
  };
  url: string;
  slug: string;
}

/**
 * Get products
 */
// const scrape = async () => {
//   const baseURL = 'https://www.pepperworldhotshop.com/en/bbq-shop/fresh-chillies/';

//   const start = Date.now();

//   console.log('scraping...');

//   // Launch browser and open new page
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.goto(baseURL, { waitUntil: 'networkidle0' });

//   const res = await page.$$eval('.productList > .productBox.product-box > .borderbox > form', (elements) => {
//     console.log('inside', new Date());
//     return elements.map((e) => {
//       return {
//         title: e.querySelector<HTMLDivElement>('.listDetails > .title')?.innerText,
//         hotness: +(e.querySelector<HTMLImageElement>('.listDetails > .hotness > img')?.title.split(' ')[1] ?? -1),
//         price: +(
//           e
//             .querySelector<HTMLAnchorElement>('.listDetails > .price > .content > .lead > a')
//             ?.innerText.split(' ')[0]
//             .replace(',', '.') ?? -1
//         ),
//         pictures: {
//           smallPic: e.querySelector<HTMLImageElement>('img')?.getAttribute('data-src'),
//         },
//         url: e.querySelector<HTMLAnchorElement>('a')?.href,
//       };
//     });
//   });

//   const products: ProductTemp[] = res.map((product) => {
//     return {
//       ...product,
//       slug: product.url?.split('/').at(-2),
//     };
//   });

//   // console.log(products);

//   fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {});

//   // Close browser
//   await browser.close();

//   const end = Date.now();
//   console.log(`Scraping took ${(end - start) / 1000} seconds`);
// };

/**
 * Save small pictures of product
 */
const scrape = async () => {
  const start = Date.now();

  // Read in URL of pictures and map to array
  const products: Product[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

  // Launch browser and open new page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const product of products) {
    const source = await page.goto(product.pictures.smallPic, { waitUntil: 'networkidle2' });

    const buffer = await source?.buffer();

    if (buffer) {
      await fs.promises.writeFile(`src/pics/${product.slug}.jpg`, buffer);
    }
  }

  // Close browser
  await browser.close();

  const end = Date.now();
  console.log(`Scraping took ${(end - start) / 1000} seconds`);
};

scrape();
