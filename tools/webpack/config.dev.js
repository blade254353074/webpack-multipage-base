const fs = require('fs')
const webpack = require('webpack')

/* Webpack Plugins */
const DashboardPlugin = require('webpack-dashboard/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
// 在 react-hot-loader v3.0.0-beta.2 下，加上 happypack 会使 react-hot-reload 失效
const HappyPack = require('happypack')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

/* Plugins */
const autoprefixer = require('autoprefixer')
const getIPAddress = require('../getIPAddress')
const getPagesConfig = require('./getPagesConfig')

/* vars */
const port = 8080
const urls = require('../urls')
const ip = getIPAddress()
const pagesConfig = getPagesConfig()

const config = {
  cache: true,
  debug: true,
  // devtool: 'source-map',
  devtool: 'cheap-module-source-map',
  // 用 eval 可以大幅提高开发中构建效率，但 map 存在 js 文件中，会影响对文件大小的判断
  // devtool: 'cheap-module-eval-source-map', // original source (lines only), no production supported
  entry: {
    '[development]': [
      `webpack-dev-server/client?http://${ip}:${port}`, // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // 'only' prevents reload on syntax errors
      'handlebars/dist/handlebars.runtime'
    ],
    vendor: [
      'babel-polyfill/dist/polyfill', // use builded js to boost build process
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
    alias: {
      components: urls.components,
      assets: urls.assets
    },
    extensions: ['', '.js', '.jsx', '.css', '.scss', '.gif', '.png', '.jpg', '.jpeg', '.json', '.html']
  },
  resolveLoader: {
    root: urls.node_modules
  },
  module: {
    noParse: [/(babel-polyfill|bower_components)/],
    preLoaders: [{
      test: /\.jsx?$/,
      loader: 'standard',
      exclude: /(node_modules|bower_components)/
    }],
    loaders: [{
      test: /\.jsx?$/i,
      exclude: /(node_modules|bower_components)/,
      loader: 'happypack/loader',
      query: {
        cacheDirectory: true
      }
    }, {
      test: /\.scss$/i,
      // loader: ExtractTextPlugin.extract('style', ['css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap'])
      loaders: ['style', 'css?sourceMap', 'postcss?sourceMap', 'sass?sourceMap']
    }, {
      test: /\.css$/i,
      // loader: ExtractTextPlugin.extract('style', ['css?sourceMap', 'postcss?sourceMap'])
      loaders: ['style', 'css?sourceMap', 'postcss?sourceMap']
    }, {
      test: /\.json$/i,
      loader: 'json'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'url?limit=1000&name=assets/imgs/[name].[ext]'
    }, {
      test: /\.hbs$/,
      loader: "handlebars",
      query: {
        partialDirs: [urls.templates]
      }
    }, {
      test: require.resolve('zepto'),
      loader: 'exports?window.Zepto!script'
    }]
  },
  postcss: () => [autoprefixer],
  plugins: [
    new DashboardPlugin(),
    new HappyPack({
      loaders: ['babel'],
      tempDir: urls.temp
    }),
    new webpack.ProvidePlugin({ $: 'zepto' }),
    // new ExtractTextPlugin('assets/css/[name].[id].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: `http://localhost:${port}/` })
  ],
  standard: {
    globals: ['$', 'Zepto']
  }
}

// 添加所有页面配置
Object.assign(config.entry, pagesConfig.entry)
config.plugins.push(...pagesConfig.htmls.map(cfg => new HtmlWebpackPlugin(cfg)))
// config.entry.dev.push(...pagesConfig.htmls.map(cfg => cfg.template))
config.plugins.push(
  (new webpack.optimize.CommonsChunkPlugin({
    name: '[development]',
    chunks: ['[development]'].concat(pagesConfig.htmls.map(cfg => cfg._templateKey))
  }))
)
// write config.dev.json to .temp dir
fs.writeFileSync(`${urls.temp}/config.dev.json`, JSON.stringify(config, null, 2), 'utf8')

module.exports = config
