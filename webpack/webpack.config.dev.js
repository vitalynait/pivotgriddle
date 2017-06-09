var path = require('path');
var webpack = require('webpack');
var appConfig = require('./config');
var host = appConfig.host;
var port = appConfig.port;
var sharedConfig = require('./webpack.config.shared.js');

var plugins = [
    ...sharedConfig.plugins
];

module.exports = {
    devtool: 'eval',
    context: sharedConfig.context,
    entry: {
        'app' : [
            'webpack-dev-server/client?http://' + host + ':' + port,
            'webpack/hot/only-dev-server',
            './example/index.js',
        ]
    },
    output: {
        path: path.join(__dirname, '..', 'dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    module: {
        rules: [
            ...sharedConfig.module.rules,
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'react-hot-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        }
                    }
                ]
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
                        }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            }
        ]
    },
    resolve: sharedConfig.resolve,
    plugins: [
        ...plugins,
        new webpack.DefinePlugin(sharedConfig.definitions),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
