const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './client/src/index.js',
  resolve: {
    fallback: {
      fs: false, // or require.resolve("browserify-fs")
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new webpack.ProvidePlugin({ path: 'path-browserify' }),
    new Dotenv({
      path: './client/.env'
    }),
  ]
};
