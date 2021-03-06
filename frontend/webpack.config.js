'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');

const webpackCommon = {
  entry: {
    app: [
        './app/initialize',
        bootstrapEntryPoints.dev
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.jst$/,
        loader: 'underscore-template-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'bootstrap')
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(jpe?g|png|gif)$/i, loader:"file" },
    ],
    rules: [
        {
            test: /\.(jpe?g|png|gif)$/i,
            loader:"file-loader",
            query:{
                name:'[name].[ext]',
                outputPath:'images/'
                //the images will be emmited to public/assets/images/ folder
                //the images will be put in the DOM <style> tag as eg. background: url(assets/images/image.png);
            }
        },
        {
            test: /\.css$/,
            loaders: ["style-loader","css-loader"]
        }
    ]
  },
  // output: {
  //   filename: 'app.js',
  //   path: path.join(__dirname, './public'),
  //   publicPath: '/'
  // },
  output: {
      filename: 'app.js',
      path: path.join(__dirname, '../web'),
      publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('app.css'),
    new CopyWebpackPlugin([{
      from: './app/assets/index.html',
      to: './index.html'
    }]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      _: 'underscore'
    }),
      new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
      )
      // new webpack.DefinePlugin({
      //     API_BASE_URL: 'http://127.0.0.1:8000/api/'
      // })
  ],
  resolve: {
    root: path.join(__dirname, './app'),
    modulesDirectories: ["node_modules", "bower_components"]
  },
  resolveLoader: {
    root: [path.join(__dirname, './node_modules'), path.join(__dirname, './bower_components')]
  }
};

switch (process.env.npm_lifecycle_event) {
  case 'start':
  case 'dev':
    module.exports = merge(webpackCommon, {
      devtool: '#inline-source-map',
      devServer: {
        inline: true
      }
    });
    break;
  default:
    module.exports = merge(webpackCommon, {
      devtool: 'source-map'
    });
    break;
}
