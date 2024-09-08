import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { cleanHTML } from './utils';

interface Product_long {
  title: string;
  sku: string;
  slug: string;
  price: number;
  pictures: {
    smallPic: string;
    largePics: string[];
  };
  description: {
    description_short: string;
    description_long: string;
  };
  product_details: {
    category: string;
    manufacturer: string;
    hotness: number;
    weight: number;
    rating: {
      average: number;
      nr_of_reviews: number;
    };
  };
  url: string;
}

interface Product_short {
  title: string;
  slug: string;
  hotness: number;
  price: number;
  pictures: {
    smallPic: string;
  };
  url: string;
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
//         title: e.querySelector<HTMLDivElement>('.listDetails > .title')?.innerText ?? 'Fail',
//         hotness: +(e.querySelector<HTMLImageElement>('.listDetails > .hotness > img')?.title.split(' ')[1] ?? -1),
//         price: +(
//           e
//             .querySelector<HTMLAnchorElement>('.listDetails > .price > .content > .lead > a')
//             ?.innerText.split(' ')[0]
//             .replace(',', '.') ?? -1
//         ),
//         pictures: {
//           smallPic: e.querySelector<HTMLImageElement>('img')?.getAttribute('data-src') ?? 'FAIL',
//         },
//         url: e.querySelector<HTMLAnchorElement>('a')?.href ?? 'FAIL',
//       };
//     });
//   });

//   const products = res.map((product) => {
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
// const scrape = async () => {
//   const start = Date.now();

//   // Read in URL of pictures and map to array
//   const products: Product[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

//   // Launch browser and open new page
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   for (const product of products) {
//     const source = await page.goto(product.pictures.smallPic, { waitUntil: 'networkidle2' });

//     const buffer = await source?.buffer();

//     if (buffer) {
//       await fs.promises.writeFile(`src/pics/${product.slug}.jpg`, buffer);
//     }
//   }

//   // Close browser
//   await browser.close();

//   const end = Date.now();
//   console.log(`Scraping took ${(end - start) / 1000} seconds`);
// };

/**
 * Get pdp info
 */
// const scrape = async () => {
//   const start = Date.now();

//   // Read in products short version
//   const products: Product_short[] = JSON.parse(fs.readFileSync('./products_short.json', { encoding: 'utf-8' }));

//   // Launch browser and goto page
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   interface Res {
//     sku: string;
//     pictures: {
//       largePics: string[];
//     };
//     description: {
//       description_short: string;
//       description_long: string;
//     };
//     product_details: {
//       category: string;
//       manufacturer: string;
//       weight: number;
//       rating: {
//         average: number;
//         nr_of_reviews: number;
//       };
//     };
//   }

//   const productsAll = async () => {
//     // const product = products[0];

//     const allProducts: Product_long[] = [];

//     for (const product of products) {
//       await page.goto(product.url, {
//         waitUntil: 'networkidle0',
//       });

//       const res: Res = await page.$eval('#productinfo', (element) => {
//         const getPics = (): string[] => {
//           const morePicsContainer = element.querySelector<HTMLDivElement>('#morePicsContainer');

//           if (morePicsContainer) {
//             const links = Array.from(morePicsContainer.querySelectorAll<HTMLAnchorElement>('ul li a')).map(
//               (link) => link.href
//             );
//             return links;
//           }

//           const link = element.querySelector<HTMLAnchorElement>('.picture.details-picture a.details-picture-link')
//             ?.href!;

//           return [link];
//         };

//         return {
//           sku: element.querySelector<HTMLSpanElement>('.details-col-middle > span')?.innerHTML ?? '',
//           pictures: {
//             largePics: getPics(),
//           },
//           description: {
//             description_short: element.querySelector<HTMLParagraphElement>('#productShortdesc')?.innerText ?? 'FAIL',
//             description_long: element.querySelector<HTMLDivElement>('#description')?.innerHTML ?? 'FAIL',
//           },
//           product_details: {
//             category:
//               element.querySelector<HTMLDataElement>('[data-original-title="Category"]')?.nextElementSibling
//                 ?.textContent ?? 'Fail',
//             manufacturer:
//               element.querySelector<HTMLDataElement>('[data-original-title="Manufacturer"]')?.nextElementSibling
//                 ?.textContent ?? 'Fail',
//             weight: +(
//               element.querySelector<HTMLParagraphElement>('#productPricePerUnit_ > p')?.innerText.split(' ')[0] ?? -1
//             ),
//             rating: {
//               average: +(element.querySelector<HTMLDivElement>('.ratings .d-none')?.innerText ?? -1),
//               nr_of_reviews: +(
//                 element.querySelector<HTMLElement>('.ratings a small')?.innerText.split(' ')[0].replace('(', '') ?? -1
//               ),
//             },
//           },
//         };
//       });

//       const product_long: Product_long = {
//         title: product.title,
//         sku: res.sku.split(' ').pop() ?? 'FAIL',
//         slug: product.slug,
//         price: product.price,
//         pictures: {
//           smallPic: product.pictures.smallPic,
//           largePics: res.pictures.largePics,
//         },
//         description: {
//           description_short: res.description.description_short,
//           description_long: res.description.description_long,
//         },
//         product_details: {
//           category: res.product_details.category,
//           manufacturer: res.product_details.manufacturer,
//           hotness: product.hotness,
//           weight: res.product_details.weight,
//           rating: {
//             average: res.product_details.rating.average,
//             nr_of_reviews: res.product_details.rating.nr_of_reviews,
//           },
//         },
//         url: product.url,
//       };
//       allProducts.push(product_long);
//     }
//     return allProducts;
//   };

//   fs.writeFile('products.json', JSON.stringify(await productsAll(), null, 2), (err) => {});

//   // console.log(product_long);

//   // Close browser
//   await browser.close();

//   // Calculate runtime
//   const end = Date.now();
//   console.log(`Scraping took ${(end - start) / 1000} seconds`);
// };

/**
 * Get and save all pdp pictures
 */
// const scrape = async () => {
//     const start = Date.now();

//     // Read in products
//     const products: Product_long[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

//     // Launch browser and goto page
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     const getPics = async (slug: string, url: string, index: number) => {
//         const source = await page.goto(url, { waitUntil: 'networkidle0' });

//         const buffer = await source?.buffer();

//         if (buffer) {
//             await fs.promises.writeFile(`src/pics/lg_pics/${slug}_${index + 1}.jpg`, buffer);
//         }
//     };

//     // const product = products[0];

//     for (let i = 0; i < products.length; i++) {
//         for (let j = 0; j < products[i].pictures.largePics.length; j++) {
//             const source = await page.goto(products[i].pictures.largePics[j], { waitUntil: 'networkidle0' });

//             const buffer = await source?.buffer();

//             if (buffer) {
//                 await fs.promises.writeFile(`src/pics/lg_pics/${products[i].slug}_${j + 1}.jpg`, buffer);
//             }
//         }
//     }

//     // Close browser
//     await browser.close();

//     // Calculate runtime
//     const end = Date.now();
//     console.log(`Scraping took ${(end - start) / 1000} seconds`);
// };

/**
 * Count nr of lg_pics
 */
// const products: Product_long[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

// const nrOfPics = products.reduce((tot, product) => tot + product.pictures.largePics.length, 0);
// console.log(nrOfPics);

// scrape();

/**
 * Clean html
 */
const products: Product_long[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

const newProducts: Product_long[] = products.map((product) => {
  return {
    ...product,
    description: {
      description_short: product.description.description_short,
      description_long: cleanHTML(product.description.description_long.trim()),
    },
  };
});

fs.writeFile('products.json', JSON.stringify(newProducts, null, 2), (err) => {});

// console.log(newProducts);

// scrape();
