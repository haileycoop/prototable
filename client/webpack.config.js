const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false, // or require.resolve("browserify-fs")
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new Dotenv(),
    new path()
  ]
};
