import { db } from './db';
import * as fs from 'fs';
import { Product } from './utils';
import { create } from 'domain';

const productsSeedDB = async () => {
  const products: Product[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

  for (const product of products) {
    await db.product.create({
      data: {
        title: product.title,
        sku: product.sku,
        slug: product.slug,
        price: product.price,
        pictures: product.pictures,
        description: {
          create: {
            description_short: product.description.description_short,
            description_long: product.description.description_long
          },
        },
        productDetails: {
          create: {
            category: product.product_details.category,
            manufacturer: product.product_details.manufacturer,
            hotness: product.product_details.hotness,
            weight: product.product_details.weight,
            rating: {
              create: {
                average: product.product_details.rating.average,
                nr_of_reviews: product.product_details.rating.nr_of_reviews
              }
            }
          }
        }
      }
    });
  }
};

const main = async () => {
  // await productsSeedDB();
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());