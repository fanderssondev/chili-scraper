import { db } from './db';

const main = async () => {
  // await db.product.create({
  //   data: {
  //     title: 'Fresh Chilli BBQ Mix',
  //     sku: 'XM075',
  //     slug: 'fresh-chilli-bbq-mix',
  //     price: 13.98,
  //     url: 'https://www.pepperworldhotshop.com/en/bbq-shop/fresh-chillies/fresh-chilli-bbq-mix/',
  //     pictures: {
  //       create: {
  //         smallPic:
  //           'https://www.pepperworldhotshop.com/out/pictures/generated/product/1/160_155_75/ba097_die-letzten-ihrer-art.jpg',
  //         largePics: [
  //           'https://www.pepperworldhotshop.com/out/pictures/master/product/1/ba097_die-letzten-ihrer-art.jpg',
  //         ],
  //       },
  //     },
  //     description: {
  //       create: {
  //         description_short:
  //           'You get at least 5 different types of chillies from mild to wild, which are perfect for every BBQ lover.',
  //         description_long:
  //           '<h2>Fresh Chilli BBQ Mix<br></h2><h3>Get a BBQ surprise package with at least 5 different types of chillies now</h3><p><b>You\'ll get from us:</b><br></p><ul><li><b>at least 5 different kinds of chilies</b><br></li><li>Heat level from <b>mild to&nbsp;the fiery hotness of Habanero</b><br></li><li>A total weight of <b>400 grams</b><br></li></ul><p><b>These varieties can be:</b><br></p><p></p><p></p><ul><li><font><a>Habanero red</a>/<a>yellow</a>/<a>orange&nbsp; </a>A real highlight due to the very fruity taste.</font></li><li><font><a>Jalapeño green</a>/<a>red</a>&nbsp; One of the best known and most varied chilli varieties.&nbsp;</font></li><li><font><a>Pimientos de Padrón</a>&nbsp; The chili for beginners, ideal as a fried snack or for tapas.</font></li><li><font><a>Cayenne</a>&nbsp; Fresh Red Cayenne for conjuring up your own creations</font></li><li><font><a>Green Peperoni</a>&nbsp; Green Pepperoni are the classics among the chili fruits.&nbsp;</font></li><li><a>Rawit</a>&nbsp;&nbsp;<font>Originating from Indonesia, this chili is used worldwide and is probably the typical "chili".</font></li><li><font><a>Ancho</a>&nbsp; Fresh Poblano - a mild Mexican classic!</font></li></ul>',
  //       },
  //     },
  //     productDetail: {
  //       create: {
  //         category: 'Fresh Chillies',
  //         manufacturer: 'Pepperworld',
  //         hotness: 5,
  //         weight: 0.4,
  //         rating: {
  //           create: {
  //             average: 5,
  //             nr_of_reviews: 1,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  const product = await db.product.findMany({
    select: {
      title: true,
      sku: true,
      slug: true,
      price: true,
      url: true,
      pictures: {
        select: {
          smallPic: true,
          largePics: true,
        },
      },
      description: {
        select: {
          description_short: true,
          description_long: true,
        },
      },
      productDetail: {
        select: {
          category: true,
          manufacturer: true,
          hotness: true,
          weight: true,
          rating: {
            select: {
              average: true,
              nr_of_reviews: true,
            },
          },
        },
      },
    },
  });

  console.log(product);
};

main()
  .catch((e) => {
    console.log(e);
  })
  .finally(async () => db.$disconnect());
