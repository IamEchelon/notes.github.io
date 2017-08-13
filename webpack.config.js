// Requires
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

// Set plugin constants
const hmr = new webpack.HotModuleReplacementPlugin()
const loadHtml = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
})
const extractPlugin = new ExtractTextPlugin({
  filename: 'main.css'
})
const uglify = new UglifyJSPlugin()

// Main
module.exports = env => {
  // setup entry points for src and distribution
  return {
    entry: './src/js/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    // setup loaders for different filetypes
    module: {
      rules: [
        {
          // Stylesheets loader
          test: /\.(css|sass)$/,
          use: extractPlugin.extract({
            use: ['css-loader', 'sass-loader']
          })
        },
        {
          // Elm loader
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/, /notesAPI/],
          use: [
            {
              loader: 'elm-hot-loader'
            },
            {
              loader: 'elm-webpack-loader',
              options: env && env.production ? {} : { debug: true, warn: true }
            }
          ]
        },
        {
          // Babel ES6 loader
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [/elm-stuff/, /node_modules/, /notesAPI/]
        },
        {
          // Images and assets loader
          test: /\.(png|svg|jpg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img/',
                publicPath: 'img/'
              }
            }
          ]
        }
      ]
    },

    // Additional functionality
    plugins: [loadHtml, hmr, extractPlugin, uglify],

    // webserver object
    devServer: {
      hot: true,
      inline: true,
      stats: { colors: true }
      // host: '192.168.0.12'
    }
  }
}
