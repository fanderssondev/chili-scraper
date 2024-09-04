import puppeteer from 'puppeteer';
import * as fs from 'fs';
import { url } from 'inspector';

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
const scrape = async () => {
  const start = Date.now();

  // Read in products short version
  const products: Product_short[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));
  const currentProduct = products[3];

  // Launch browser and goto page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(currentProduct.url, {
    waitUntil: 'networkidle0',
  });

  interface Res {
    sku: string;
    pictures: {
      largePics: string[];
    };
    description: {
      description_short: string;
      description_long: string;
    };
    product_details: {
      category: string;
      manufacturer: string;
      weight: number;
      rating: {
        average: number;
        nr_of_reviews: number;
      };
    };
  }

  const res: Res = await page.$eval('#productinfo', (element) => {
    const getPics = (): string[] => {
      const morePicsContainer = element.querySelector<HTMLDivElement>('#morePicsContainer');

      if (morePicsContainer) {
        const imgs = Array.from(morePicsContainer.querySelectorAll<HTMLAnchorElement>('ul li a')).map(
          (img) => img.href
        );
        return imgs;
      }

      return [];
    };

    return {
      sku: element.querySelector<HTMLSpanElement>('.details-col-middle > span')?.innerHTML ?? '',
      pictures: {
        largePics: getPics(),
      },
      description: {
        description_short: element.querySelector<HTMLParagraphElement>('#productShortdesc')?.innerText ?? 'FAIL',
        description_long: element.querySelector<HTMLDivElement>('#description')?.innerHTML ?? 'FAIL',
      },
      product_details: {
        category:
          element.querySelector<HTMLDataElement>('[data-original-title="Category"]')?.nextElementSibling?.textContent ??
          'Fail',
        manufacturer:
          element.querySelector<HTMLDataElement>('[data-original-title="Manufacturer"]')?.nextElementSibling
            ?.textContent ?? 'Fail',
        weight: +(
          element.querySelector<HTMLParagraphElement>('#productPricePerUnit_ > p')?.innerText.split(' ')[0] ?? -1
        ),
        rating: {
          average: +(element.querySelector<HTMLDivElement>('.ratings .d-none')?.innerText ?? -1),
          nr_of_reviews: +(
            element.querySelector<HTMLElement>('.ratings a small')?.innerText.split(' ')[0].replace('(', '') ?? -1
          ),
        },
      },
    };
  });

  // console.log(res);

  const product_long: Product_long = {
    title: currentProduct.title,
    sku: res.sku.split(' ').pop()!,
    slug: currentProduct.slug,
    price: currentProduct.price,
    pictures: {
      smallPic: currentProduct.pictures.smallPic,
      largePics: res.pictures.largePics,
    },
    description: {
      description_short: res.description.description_short,
      description_long: res.description.description_long,
    },
    product_details: {
      category: res.product_details.category,
      manufacturer: res.product_details.manufacturer,
      hotness: currentProduct.hotness,
      weight: res.product_details.weight,
      rating: {
        average: res.product_details.rating.average,
        nr_of_reviews: res.product_details.rating.nr_of_reviews,
      },
    },
    url: currentProduct.url,
  };

  console.log(product_long);

  // Close browser
  await browser.close();

  // Calculate runtime
  const end = Date.now();
  console.log(`Scraping took ${(end - start) / 1000} seconds`);
};

scrape();
