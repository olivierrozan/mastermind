const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      // Define Bundler Build Feature Flags
      new webpack.DefinePlugin({
        // Drop Options API from bundle
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
      })
    ]
  }
};