const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.dev.js');
const appConfig = require('./config.js');

const compiler = webpack(config);
const options = {
    publicPath: config.output.publicPath,
    quiet: false,
    hot: true,
    noInfo: true,
    inline: true,
    lazy: false,
    stats: {
        colors: true
    },
};

const server = new WebpackDevServer(compiler, options);
server.listen(appConfig.port, '0.0.0.0', function (err) {
    if (err) {
        return err;
    }
    console.log('webpack-server is running on localhost: ' + appConfig.port);
});