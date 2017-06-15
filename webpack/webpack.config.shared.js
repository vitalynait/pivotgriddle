const path = require('path');
const fs = require('fs');

module.exports = {
  context: path.resolve(__dirname, '..'),
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif)$/, loader: 'url-loader?limit=100000&name=images/[name].[ext]' },
      { test: /\.(eot|woff|woff2|ttf|svg)(\?v=\d+\.\d+\.\d+)?/, loader: 'url-loader?limit=100000&name=fonts/[name].[ext]' },
    ],
  },
};
