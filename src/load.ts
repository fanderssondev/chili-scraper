import { db } from './db';
import * as fs from 'fs';

interface Product {
  id: string;
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

const productsLoadFromDB = async () => {
  const products = await db.product.findMany({
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

const seed;

const main = async () => {




  // fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {});
  // console.log(JSON.stringify(products, null, 3));

  // const products: Product[] = JSON.parse(fs.readFileSync('./products2.json', { encoding: 'utf-8' }));

  // for (const product of products) {
  //   let newPics: string[] = [];

  //   for (const pics of product.pictures) {
  //     const renamed = pics.replace('.jpg', '.png');
  //     newPics.push(renamed);
  //   }

  //   // console.log(newPics);

  //   await db.product.update({
  //     where: {
  //       id: product.id,
  //     },
  //     data: {
  //       pictures: newPics,
  //     },
  //   });
  // }

  // console.log(JSON.stringify(products, null, 3));
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());
