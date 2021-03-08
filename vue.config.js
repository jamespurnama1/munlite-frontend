/* eslint-disable quotes */
module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@use "~@/styles" as *;`,
      },
    },
  },
};
