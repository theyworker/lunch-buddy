require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.js',
  timeout: 60_000,
  use: {
    baseURL: 'https://brainxhr.directfn.net',
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
});
