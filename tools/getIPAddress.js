const os = require('os')

module.exports = function getIPAddress () {
  const networkInterfaces = os.networkInterfaces()
  const interfaceArr = networkInterfaces.en0 || networkInterfaces.lo0
  let ip

  interfaceArr.some(value => {
    if (value.family === 'IPv4') {
      ip = value.address
      return true
    }
  })

  return ip
}
