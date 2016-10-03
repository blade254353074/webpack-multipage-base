const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const urls = require('../urls')
const NODE_ENV = process.env.NODE_ENV

function fileExist (path) {
  try {
    fs.accessSync(path, fs.constants.R_OK)
    return true
  } catch (err) {
    return false
  }
}

function constructEntries (htmlFiles) {
  const pagesAttr = []
  htmlFiles.map(url => {
    const dir = path.dirname(url)
    // key `dir/subpage1` or `poage1`
    const key = path.dirname(path.relative(urls.pages, url))
    const jsPath = path.resolve(dir, 'index.js')
    const page = { key, html: url }

    if (fileExist(jsPath)) {
      page.js = jsPath || './' + path.relative(urls.project, jsPath)
    }

    /*
      page {
        key: 'dir/subpage1',
        html: '/absolute/path/to/dir/subpage1/index.html',
        js: './src/pages/dir/subpage1/index.js' // optional
      }
    */
    pagesAttr.push(page)
  })

  return pagesAttr
}

function constructEntryObject (pagesAttr) {
  const entry = {}
  pagesAttr.map(page => {
    entry[page.key] = page.js
    // 'dir/subpage1': [ jspath, htmlpath ]
    // entry[page.key] = [page.js, page.html]
  })

  return entry
}

function constructHtmlPluginsConfigArray (pagesAttr) {
  return pagesAttr.map(page => {
    const chunks = NODE_ENV !== 'production' ? ['dev', 'vendor'] : ['vendor']
    const inject = NODE_ENV !== 'production' ? 'head' : true
    const config = {
      key: page.key,
      filename: `${page.key}.html`,
      template: page.html,
      inject,
      chunks
    }

    if (page.js) {
      config.chunks.push(page.key)
    }
    /*
      config {
        filename: 'dir/subpage.html',
        template: '/absolute/path/to/dir/subpage/index.html',
        inject: true,
        chunks: ['vendor', 'dir/subpage']
      }
    */
    return config
  })
}

function getPagesConfig () {
  try {
    const htmlFiles = glob.sync(`${urls.pages}/**/index.+(html|ejs|hbs)`)
    const pagesAttr = constructEntries(htmlFiles)
    const entry = constructEntryObject(pagesAttr) // Object
    const htmls = constructHtmlPluginsConfigArray(pagesAttr) // Array

    return { entry, htmls }
  } catch (err) {
    console.log("\007") // Beep
    console.error(err)
  }
}

module.exports = getPagesConfig
