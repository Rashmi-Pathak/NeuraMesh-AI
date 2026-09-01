const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:8080');
  
  // Wait for the input field to be available
  await page.waitForSelector('input[placeholder*="Ask a complex question"]', { timeout: 5000 }).catch(() => console.log("Input not found"));
  
  // Type and press Enter
  await page.type('input[placeholder*="Ask a complex question"]', 'Test query');
  await page.keyboard.press('Enter');
  
  // Wait a bit to catch errors
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await browser.close();
})();
