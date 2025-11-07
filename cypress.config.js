require("dotenv").config();
const { defineConfig } = require("cypress");
const { initPlugins } = require("./cypress/support/config-support");

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 15000,
  responseTimeout: 20000,
  requestTimeout: 15000,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      initPlugins(on, [
        (on) => {
          on("before:browser:launch", (launchOptions, browser = {}) => {
            // Disable shared memory when run since most CI environment do not support that
            if (browser.name === "chrome" || browser.name === "chromium") {
              launchOptions.args.push("--disable-dev-shm-usage");
            } else if (browser.name === "electron") {
              launchOptions.args["disable-dev-shm-usage"] = true;
            }
          });
        },
      ]);

      return config;
    },

    baseUrl: process.env.PATHWAYS_TEST_URL,
    specPattern: "cypress/tests/**/*.spec.{js,jsx,ts,tsx}",
    excludeSpecPattern: "cypress/tests/**/*.spec.skip.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 1000,
    chromeWebSecurity: false,
    screenshotsFolder: "cypress/artifacts/screenshots",
    videosFolder: "cypress/artifacts/videos",
    trashAssetsBeforeRuns: true,
  },

  env: {},
});
