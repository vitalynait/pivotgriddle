// bundle a min version of the umd build without source maps
const webpack = require('webpack');
const umdConfig = require('./webpack.umd.config');

umdConfig.output.filename = '[name].min.js';
umdConfig.devtool = false;
umdConfig.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin()
];

module.exports = umdConfig;
