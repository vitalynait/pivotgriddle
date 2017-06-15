const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'pivot-griddle': './src/index.js'
  },
  devtool: '#cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'PivotGriddle',
    libraryTarget: 'umd'
  },
  externals: [{
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }, {
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  }],
  module: {
    // preLoaders: [{
    //   test: /\.js$/,
    //   exclude: [/node_modules/, path.resolve(__dirname, './src/filesaver.js')],
    //   loader: 'eslint'
    // }],
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
