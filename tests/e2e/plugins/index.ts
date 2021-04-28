/* eslint-disable
  arrow-body-style,
  no-param-reassign,
  import/no-extraneous-dependencies,
  global-require */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// const webpack = require('@cypress/webpack-preprocessor')
const cucumber = require('cypress-cucumber-preprocessor').default;
require('dotenv').config();

module.exports = (on) => {
  on('file:preprocessor', cucumber());
};

module.exports = (on, config) => {
  config.env.email = process.env.EMAIL;
  config.env.password = process.env.PASSWORD;
  config.env.base_api = process.env.VUE_APP_BASE_API;

  return {
    ...config,
    fixturesFolder: 'tests/e2e/fixtures',
    integrationFolder: 'tests/e2e/specs',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    supportFile: 'tests/e2e/support/index.ts',
  };
};
