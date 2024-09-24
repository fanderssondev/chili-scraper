import { db } from './db';
import * as fs from 'fs';

interface Product {
  title: string;
  sku: string;
  slug: string;
  price: number;
  url: string;
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
}

const main = async () => {
  const products: Product[] = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));

  for (const product of products) {
    await db.product.create({
      data: {
        title: product.title,
        sku: product.sku,
        slug: product.slug,
        price: product.price,
        url: product.url,
        pictures: {
          create: {
            smallPic: product.pictures.smallPic,
            largePics: product.pictures.largePics,
          },
        },
        description: {
          create: {
            description_short: product.description.description_short,
            description_long: product.description.description_long,
          },
        },
        productDetail: {
          create: {
            category: product.product_details.category,
            manufacturer: product.product_details.manufacturer,
            hotness: product.product_details.hotness,
            weight: product.product_details.weight,
            rating: {
              create: {
                average: product.product_details.rating.average,
                nr_of_reviews: product.product_details.rating.nr_of_reviews,
              },
            },
          },
        },
      },
    });
  }
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());

// const product = await db.product.findFirst({
//   select: {
//     title: true,
//     sku: true,
//     slug: true,
//     price: true,
//     url: true,
//     pictures: {
//       select: {
//         smallPic: true,
//         largePics: true,
//       },
//     },
//     description: {
//       select: {
//         description_short: true,
//         description_long: true,
//       },
//     },
//     productDetail: {
//       select: {
//         category: true,
//         manufacturer: true,
//         hotness: true,
//         weight: true,
//         rating: {
//           select: {
//             average: true,
//             nr_of_reviews: true,
//           },
//         },
//       },
//     },
//   },
// });

// console.log(product);
