const path = require('path');
const webpack = require('webpack');
const appConfig = require('./config');

const sharedConfig = require('./webpack.config.shared.js');

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      './examples/js/index.js',
    ],
    vendors: [`webpack-dev-server/client?http://localhost:${appConfig.port}`, 'webpack/hot/only-dev-server'],
  },
  devtool: '#eval-source-map',
  output: {
    path: path.join(__dirname, 'examples'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'pivot-griddle': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      ...sharedConfig.module.rules,
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]',
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/\.json$/),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProgressPlugin((percentage, message) => {
      const percent = Math.round(percentage * 100);
      process.stderr.clearLine();
      process.stderr.cursorTo(0);
      process.stderr.write(`${percent}% ${message}`);
    }),
  ],
};
