'use strict';

var gulp = require('gulp');
var nodemon = require('nodemon');
var $ = require('gulp-load-plugins')();
var $log = $.util.log;
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

gulp.task('serve', function () {
  var publicPath = 'http://localhost:9090/assets/';

  webpackConfig.output.publicPath = publicPath;

  var compiler = webpack(webpackConfig),
      host = '0.0.0.0', port = 9090;

  new WebpackDevServer(compiler, {
    contentBase: 'public/',
    hot: true, port: port,
    publicPath: publicPath,
    noInfo: true
  })
  .listen(port, host, function (err){
    if (err) $log('[webpack-dev-server] error', err);

    $log('[webpack-dev-server] started');
  });

  nodemon({
    execMap: {
      js: 'node --harmony'
    },
    script: 'server/main.js',
    ext: 'js'
  }).on('restart', function () {
    $log('[nodemon] restarted');
  });
});

gulp.task('default', []);
