import { db } from './db';
import * as fs from 'fs';

const main = async () => {
  const products = await db.product.findMany({
    include: {
      pictures: true,
      description: true,
      productDetail: true,
    },
  });

  fs.writeFile('products2.json', JSON.stringify(products, null, 2), (err) => {});
  console.log(products);
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());
