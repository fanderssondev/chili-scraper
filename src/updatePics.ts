import { db } from './db';
import * as fs from 'fs';

const main = async () => {
  const products = await db.product.findMany({
    include: {
      pictures: true,
    },
  });

  // for (const product of products) {
  //   const newSmallPic = `${product.slug}_sm.jpg`;

  //   await db.picture.update({
  //     where: {
  //       id: product.picturesId,
  //     },
  //     data: {
  //       smallPic: newSmallPic,
  //     },
  //   });
  // }

  // for (let i = 0; i < products.length; i++) {
  //   for (let j = 0; j < products[i].pictures.largePics.length; j++) {
  //     console.log(`${products[i].slug}_${j + 1}.jpg`);
  //   }
  // }

  for (const product of products) {
    const newLargePics = [];
    for (const [index, pic] of product.pictures.largePics.entries()) {
      newLargePics.push(`${product.slug}_${index + 1}.jpg`);
    }

    // await db.picture.update({
    //   where: {
    //     id: product.picturesId,
    //   },
    //   data: {
    //     largePics: newLargePics,
    //   },
    // });
  }

  console.log(JSON.stringify(products, null, 3));
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());
