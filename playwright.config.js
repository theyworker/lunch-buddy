require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  use: {
    baseURL: 'https://brainxhr.directfn.net',
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
});
