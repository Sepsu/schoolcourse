var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader?cacheDirectory'
    },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader" , "css-loader!sass-loader?sourceMap") },
      {      test: /\.less$/,      loader: ExtractTextPlugin.extract("style-loader" , "css-loader!less-loader?sourceMap" )}]},
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("bundle.css" , {allChunks : true})
  ]
};