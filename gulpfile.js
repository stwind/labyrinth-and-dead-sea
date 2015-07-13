'use strict';

var gulp = require('gulp');
var nodemon = require('nodemon');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var $log = $.util.log;
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');
var webpackDistConfig = require('./webpack.dist.config.js');

gulp.task('clean', require('del').bind(null, ['dist/*','!dist/.git*']));

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

gulp.task('html', function() {
  return gulp.src('public/index.html')
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

gulp.task('webpack', function () {
  return gulp.src('client/scripts/main.js')
  .pipe(webpackStream(webpackDistConfig))
  .pipe(gulp.dest('dist/assets'))
  .pipe($.size({ title: 'webpack' }));
});

gulp.task('build', ['clean'], function(cb) {
  runSequence(['webpack', 'html'], cb);
});

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
      js: 'npm run babel-node'
    },
    script: 'server/main.js',
    ext: 'js'
  }).on('restart', function () {
    $log('[nodemon] restarted');
  });
});

gulp.task('default', []);
