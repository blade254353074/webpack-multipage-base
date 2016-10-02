const path = require('path')
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
  compress: true,
  hot: true,
  noInfo: false,
  publicPath: '/',
  stats: {
    colors: true,
    displayModules: true,
    profile: true
  }
})

server.listen(port, host, function (err) {
  if (err) {
    console.error(err)
    return
  }
  console.log(`
┌------------------------------------┐
├ local IP address is: ${    ip    } ┤
|                                    |
├ Listening at ${host}:${port}          ┤
└------------------------------------┘\n`
  )
})
