const path = require('path')
const cwd = process.cwd()

// __dirname js 文件路径
// process.cwd() node 运行的路径
// path.resolve('node_modules') node 运行时路径 + node_modules 
const src = path.resolve('src')

const urls = {
  /* base urls */
  project: cwd,
  src: src,
  build: path.resolve('build'),
  node_modules: path.resolve('node_modules'),
  /* resource urls */
  favicon: path.resolve(src, 'favicon'),
  assets: path.resolve(src, 'assets'),
  components: path.resolve(src, 'components'),
  pages: path.resolve(src, 'pages'),
  /*  */
}

module.exports = urls
