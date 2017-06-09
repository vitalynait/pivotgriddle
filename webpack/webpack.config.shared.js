const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const appConfig = require('./config.js');

module.exports = {
  context: path.resolve(__dirname, '..'),
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: process.env.NODE_ENV === 'development',
      __DEVTOOLS__: false,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
  ],
  definitions: {
    'process.env': {
      BROWSER: JSON.stringify('true'),
      SERVER: JSON.stringify('false'),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      SOCKETHOST: JSON.stringify(appConfig.socketHost),
      SOCKETPORT: JSON.stringify(appConfig.socketPort),
      SOCKETPROTO: JSON.stringify(appConfig.socketProto),
    },
  },
  module: {
    rules: [
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.(jpe?g|png|gif)$/, loader: 'url-loader', options: { limit: 100000, name: 'images/[name].[ext]' } },
      { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader', options: { limit: 100000, name: 'fonts/[name].[ext]' } },
    ],
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      'lib',
    ],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
};
