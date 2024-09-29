import { title } from 'process';
import { db } from './db';
import * as fs from 'fs';
import { create } from 'domain';

interface Product {
  title: string;
  sku: string;
  slug: string;
  price: number;
  pictures: string[];
  description: {
    description_short: string;
    description_long: string;
  };
  productDetails: {
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
  const products = JSON.parse(fs.readFileSync('./products.json', { encoding: 'utf-8' }));
  const products2 = JSON.parse(fs.readFileSync('./products2.json', { encoding: 'utf-8' }));

  // console.log(JSON.stringify(products, null, 3));

  // let array: Product[] = [];
  for (let i = 0; i < products2.length; i++) {
    // const newProduct: Product = {
    //   title: products2[i].title,
    //   sku: products2[i].sku,
    //   slug: products2[i].slug,
    //   price: products2[i].price,
    //   pictures: products2[i].pictures.largePics,
    //   description: {
    //     description_short: products2[i].description.description_short,
    //     description_long: products2[i].description.description_long,
    //   },
    //   productDetails: {
    //     category: products2[i].productDetail.category,
    //     manufacturer: products2[i].productDetail.manufacturer,
    //     hotness: products2[i].productDetail.hotness,
    //     weight: products2[i].productDetail.weight,
    //     rating: {
    //       average: products[i].product_details.rating.average,
    //       nr_of_reviews: products[i].product_details.rating.nr_of_reviews,
    //     },
    //   },
    // };

    await db.product.create({
      data: {
        title: products2[i].title,
        sku: products2[i].sku,
        slug: products2[i].slug,
        price: products2[i].price,
        pictures: products2[i].pictures.largePics,
        description: {
          create: {
            description_short: products2[i].description.description_short,
            description_long: products2[i].description.description_long,
          },
        },
        productDetails: {
          create: {
            category: products2[i].productDetail.category,
            manufacturer: products2[i].productDetail.manufacturer,
            hotness: products2[i].productDetail.hotness,
            weight: products2[i].productDetail.weight,
            rating: {
              create: {
                average: products[i].product_details.rating.average,
                nr_of_reviews: products[i].product_details.rating.nr_of_reviews,
              },
            },
          },
        },
      },
    });
    // array.push(newProduct);
  }
  // console.log(JSON.stringify(array, null, 3));

  // for (const product of products) {
  //   await db.product.create({
  //     data: {
  //       title: product.title,
  //       sku: product.sku,
  //       slug: product.slug,
  //       price: product.price,
  //       url: product.url,
  //       pictures: {
  //         create: {
  //           smallPic: product.pictures.smallPic,
  //           largePics: product.pictures.largePics,
  //         },
  //       },
  //       description: {
  //         create: {
  //           description_short: product.description.description_short,
  //           description_long: product.description.description_long,
  //         },
  //       },
  //       productDetail: {
  //         create: {
  //           category: product.product_details.category,
  //           manufacturer: product.product_details.manufacturer,
  //           hotness: product.product_details.hotness,
  //           weight: product.product_details.weight,
  //           rating: {
  //             create: {
  //               average: product.product_details.rating.average,
  //               nr_of_reviews: product.product_details.rating.nr_of_reviews,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
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
