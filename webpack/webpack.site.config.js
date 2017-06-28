const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const sharedConfig = require('./webpack.config.shared.js');

module.exports = {
  entry: {
    app: [
      './examples/js/index.js',
    ],
  },
  context: path.resolve(__dirname, '..'),
  devtool: '#eval-source-map',
  output: {
    path: path.join(__dirname, '..', 'site', 'src'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    root: __dirname,
    extensions: ['', '.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      'pivot-griddle': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    loaders: [
      ...sharedConfig.module.loaders,
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader?cacheDirectory'],
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[local]!resolve-url!sass-loader?sourceMap',
          {
            publicPath: '/', // Prepends 'url' paths in CSS output files
          }
        ),
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new ExtractTextPlugin('css/[name].css?[hash]-[chunkHash]', {
      disable: false,
      allChunks: true,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProgressPlugin((percentage, message) => {
      const percent = Math.round(percentage * 100);
      process.stderr.clearLine();
      process.stderr.cursorTo(0);
      process.stderr.write(`${percent}% ${message}`);
    }),
  ],
};
