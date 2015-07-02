'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {

  output: {
    path: '/assets/',
    publicPath: '/assets/',
    filename: "[name].js"
  },

  entry: {
    main: ['webpack/hot/only-dev-server', './client/main.js'],
    vendor: ['d3','lodash','debug']
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      styles: path.resolve(__dirname, "src/styles")
    }
  },

  cache: true,
  debug: true,
  devtool: 'source-map',

  stats: {
    colors: true,
    reasons: true
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel?optional[]=runtime&stage=0','virtual-dom']
    }, {
      test: /\.scss/,
      loaders: ['style','css','autoprefixer?browsers=last 2 version!',
        'sass?&sourceMap=true&outputStyle=expanded&includePaths[]=' + 
          path.resolve(__dirname, './node_modules')
      ]
    }, {
      test: /\.css$/,
      loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version']
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url?limit=8192'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
      loader: "url?limit=10000&minetype=application/font-woff" 
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
      loader: "file" 
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
};
