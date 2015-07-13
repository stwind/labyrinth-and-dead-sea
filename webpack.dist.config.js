'use strict';

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  output: {
    publicPath: '/assets/',
    filename: "[name].js"
  },

  entry: {
    main: './client/scripts/main',
    vendor: ['debug','immutable','@cycle/core','@cycle/web']
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      styles: path.resolve(__dirname, "client/styles")
    }
  },

  cache: true,
  debug: true,

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
      loader: ExtractTextPlugin.extract('style',
        'css!autoprefixer?browsers=last 2 version!' + 
        'sass?&sourceMap=true&outputStyle=expanded&includePaths[]=' + 
        path.resolve(__dirname, './node_modules'))
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 
                                        'css!autoprefixer?browsers=last 2 version')
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
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('styles.css')
  ]

};
