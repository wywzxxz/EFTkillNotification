const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://escapefromtarkov.gamepedia.com/Debut');
  const task = await page.evaluate(() => {
    return {
      name:document.querySelector("#firstHeading").textContent
    };
  });

  console.log(task);
  await browser.close();
})();