import { db } from './db';
import * as fs from 'fs';


const productsLoadFromDB = async () => {
  return await db.product.findMany({
    select: {
      title: true,
      sku: true,
      slug: true,
      price: true,
      pictures: true,
      description: {
        select: {
          description_short: true,
          description_long: true,
        }
      },
      productDetails: {
        select: {
          category: true,
          manufacturer: true,
          hotness: true,
          weight: true,
          rating: {
            select: {
              average: true,
              nr_of_reviews: true,
            }
          }
        }
      }
    }
  });
};

const main = async () => {
  // await productsLoadFromDB();
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());
