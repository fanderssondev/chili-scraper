import puppeteer from 'puppeteer';

const baseURL = 'https://www.pepperworldhotshop.com/en/bbq-shop/fresh-chillies/';

const scrape = async () => {
  console.log('scraping...');

  // Launch browser and open new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  const res = await page.$$eval('.productList > .productBox.product-box', (elements) => {
    return elements.map((e) => {
      return e.classList;
    });
  });

  console.log(res);

  // Close browser
  await browser.close();
};

scrape();

// productList row productSlider grid-view newItems
