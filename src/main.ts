import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

async function main() {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json')).toString());

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--mute-audio'],
  });
  const page = await browser.newPage();
  await page.goto(config.alertBoxUrl);

  page.on('console', (e) => {
    const type = e.type();
    const text = e.text();

    if (type !== 'info') {
      return;
    }

    console.info(e.text());
  });

  await page.exposeFunction('clone', (obj: any) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    const copy = obj.constructor();
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }

    return copy;
  });

  await page.evaluate(([config]: any) => {
    // @ts-ignore
    window.$config = config;
  }, [config]);

  await page.evaluate(fs.readFileSync(path.join(__dirname, './assets/script.js')).toString());
}

main();
