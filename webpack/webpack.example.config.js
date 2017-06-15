const path = require('path');
const webpack = require('webpack');
const appConfig = require('./config');

const sharedConfig = require('./webpack.config.shared.js');

module.exports = {
  entry: {
    app: [
      `webpack-dev-server/client?http://${appConfig.host}:${appConfig.port}`,
      'webpack/hot/only-dev-server',
      './examples/js/index.js',
    ],
  },
  context: path.resolve(__dirname, '..'),
  devtool: '#eval-source-map',
  output: {
    path: path.join(__dirname, 'examples'),
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
        loaders: [
          'style',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[local]',
          'resolve-url',
          'sass-loader?sourceMap',
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProgressPlugin((percentage, message) => {
      const percent = Math.round(percentage * 100);
      process.stderr.clearLine();
      process.stderr.cursorTo(0);
      process.stderr.write(`${percent}% ${message}`);
    }),
  ],
};
