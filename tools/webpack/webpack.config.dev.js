const webpack = require('webpack')

/* Webpack Plugins */
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 在 react-hot-loader v3.0.0-beta.2 下，加上 happypack 会使 hot-reload 失效
const HappyPack = require('happypack')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

/* Plugins */
const autoprefixer = require('autoprefixer')
const getIPAddress = require('../getIPAddress')
const getPagesEntry = require('./getPagesEntry')

/* vars */
const urls = require('../urls')
const ip = getIPAddress()
const port = 8080

const config = {
  cache: true,
  debug: true,
  devtool: 'cheap-module-eval-source-map', // original source (lines only), no production supported
  entry: {
    vendor: [
      `webpack-dev-server/client?http://${ip}:${port}`, // WebpackDevServer host and port
      'webpack/hot/dev-server', // "only" prevents reload on syntax errors
      'babel-polyfill',
      'zepto',
      'fastclick',
      './src/components/init' // 页面初始化
    ]
  },
  output: {
    path: urls.build,
    publicPath: '/',
    filename: 'assets/js/[name].js',
    chunkFilename: 'assets/js/chunk.[name].js'
  },
  resolve: {
    // 把node_modules路径添加到 resolve search root 列表里边，这样就可以直接 load npm 模块了
    root: [urls.node_modules],
    // alias 可以直接 require 路径，避免写 `../`
    alias: {
      components: urls.components,
      assets: urls.assets
    },
    extensions: ['', '.js', '.jsx', '.css', '.scss', '.gif', '.png', '.jpg', '.jpeg', '.html']
  },
  module: {
    preLoaders: [{
      text: /\.jsx?$/,
      loader: 'standard',
      exclude: /(node_modules|bower_components)/
    }],
    loaders: [{
      test: /\.jsx?$/i,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        cacheDirectory: true
      }
    }, {
      test: /\.scss$/i,
      loaders: ['style', 'css', 'postcss', 'sass?sourceMap']
    }, {
      test: /\.css$/i,
      loaders: ['style', 'css', 'postcss?sourceMap']
    }, {
      test: /\.json$/i,
      loader: 'json'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'url?limit=1000&name=assets/imgs/[name].[ext]'
    }]
  },
  postcss: () => [autoprefixer],
  plugins: [
    new DashboardPlugin(),
    // new HappyPack({
    //   loaders: ['babel']
    // }),
    new webpack.ProvidePlugin({
      $: "zepto"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // 允许错误不打断程序
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: `http://localhost:${port}/` })
  ]
}

Object.assign(config.entry, getPagesEntry())

module.exports = config
