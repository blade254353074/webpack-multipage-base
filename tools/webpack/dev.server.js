const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const urls = require('../urls.js')
const config = require('./config.dev.js')
const getIPAddress = require('../getIPAddress.js')

const ip = getIPAddress()
const host = '0.0.0.0'
const port = 8080
const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  proxy: {
    '/v2': {
      target: 'http://api.douban.com/',
      secure: false,
      changeOrigin: true
    }
  },
  hot: true,
  compress: true,
  noInfo: false,
  publicPath: '/',
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: true,
    hash: true,
    timings: true,
    chunks: true,
    chunkModules: false
  }
})

server.listen(port, host, function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log([
    '┌------------------------------------┐',
    `├ local IP address is: ${    ip    } ┤`,
    '|                                    |',
    `├ Listening at ${host}:${port}          ┤`,
    '└------------------------------------┘',
    ''
  ].join('\r\n'))
})
