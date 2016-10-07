const fs = require('fs')
const webpack = require('webpack')

/* Webpack Plugins */
const NyanProgressPlugin = require('nyan-progress-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ManifestPlugin = require('webpack-manifest-plugin')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const HappyPack = require('happypack')
const Visualizer = require('webpack-visualizer-plugin')

/* Plugins */
const autoprefixer = require('autoprefixer')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const getIPAddress = require('../getIPAddress')
const getPagesConfig = require('./getPagesConfig')

/* vars */
const port = 8080
const urls = require('../urls')
const ip = getIPAddress()
const pagesConfig = getPagesConfig()

const config = {
  entry: {
    vendor: [
      'babel-polyfill',
      'zepto',
      'fastclick',
      './src/components/init'
    ]
  },
  output: {
    path: urls.build,
    publicPath: '/',
    filename: 'assets/js/[name].[chunkhash:8].min.js',
    chunkFilename: 'assets/js/[name].[chunkhash:8].min.js'
  },
  resolve: {
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
    loaders: [{
      test: /\.jsx?$/i,
      exclude: /(node_modules|bower_components)/,
      loader: 'happypack/loader',
      query: {
        cacheDirectory: true
      }
    }, {
      test: /\.scss$/i,
      loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass'])
    }, {
      test: /\.css$/i,
      loader: ExtractTextPlugin.extract('style', ['css', 'postcss'])
    }, {
      test: /\.json$/i,
      loader: 'json'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: 'url?limit=1000&name=assets/imgs/[name].[chunkhash:8].[ext]'
    }, {
      test: /\.hbs$/,
      loader: "handlebars"
    }, {
      test: require.resolve(urls.zepto),
      loader: 'exports?Zepto!script'
    }]
  },
  postcss: () => [autoprefixer],
  plugins: [
    new NyanProgressPlugin({
      debounceInterval: 60,
      nyanCatSays (progress, messages) {
        if (progress === 1) return '呦, 又在写 Bug 了?'
      }
    }),
    new HappyPack({ loaders: ['babel'], tempDir: urls.temp }),
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' }}),
    new webpack.ProvidePlugin({ $: 'zepto' }),
    new ImageminPlugin({
      disable: false,
      optipng: { optimizationLevel: 3 },
      gifsicle: { optimizationLevel: 1 },
      jpegtran: { progressive: false },
      svgo: { plugins: [{ removeViewBox: false }] },
      pngquant: { quality: '70-85' },
      plugins: [imageminMozjpeg({ quality: 90 })]
    }),
    new webpack.BannerPlugin(`Build by SebastianBlade, at ${(new Date()).toLocaleString()}`),
    new ExtractTextPlugin('assets/css/[name].[contenthash:8].min.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new WebpackMd5Hash(),
    new webpack.NamedModulesPlugin(),
    new ManifestPlugin(),
    // new ChunkManifestPlugin({
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest"
    // })
    new Visualizer({ filename: `../tools/webpack/statistics.html` })
  ],
  recordsPath: `${urls.temp}/.webpack-records.json`
}

// 添加所有页面配置
Object.assign(config.entry, pagesConfig.entry)
config.plugins.push(...pagesConfig.htmls.map(cfg => new HtmlWebpackPlugin(cfg)))
fs.writeFileSync(`${urls.temp}/config.prod.json`, JSON.stringify(config, null, 2), 'utf8')

module.exports = config
