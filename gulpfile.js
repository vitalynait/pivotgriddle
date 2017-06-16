const gulp = require('gulp');
const babel = require('gulp-babel');
const del = require('del');
const shell = require('gulp-shell');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const exampleConfig = require('./webpack/webpack.example.config');
const appConfig = require('./webpack/config');

gulp.task('default', ['prod']);

gulp.task('clean', () => del(['./dist/*', './lib/**']));

//-------------
// PRODUCTION
//-------------
gulp.task('prod', ['umdBuild'], () => {
  gulp.src([
    './src/**/*.js',
    './src/*js',
    './src/**/*.jsx',
    './src/*jsx',
  ])
    .pipe(babel())
    .pipe(gulp.dest('./lib'));
});

gulp.task('umdBuild', ['clean'], shell.task([
  'webpack --config webpack/webpack.umd.config.js',
  'webpack --config webpack/webpack.umd.min.config.js',
]));

//-------------
// EXAMPLES
//-------------
gulp.task('example-server', () => {
  new WebpackDevServer(webpack(exampleConfig), {
    publicPath: exampleConfig.output.publicPath,
    contentBase: 'examples/',
    hot: true,
    inline: true,
    lazy: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false,
    },
    historyApiFallback: true,
  }).listen(appConfig.port, 'localhost', (err) => {
    if (err) {
      console.log(err);
    }

    console.log(`Listening at localhost:${appConfig.port}`);
  });
});
