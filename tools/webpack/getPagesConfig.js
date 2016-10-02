const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const urls = require('../urls')



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
        html: '/path/to/dir/subpage1/index.html',
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
  })

  return entry
}

function constructHtmlPluginsConfigArray (pagesAttr) {
  return pagesAttr.map(page => {
    const config = {
      key: page.key,
      filename: `${page.key}.html`,
      template: page.html,
      inject: true,
      chunks: ['vendor']
    }

    if (page.js) {
      config.chunks.push(page.key)
    }

    // {
    //   filename: 'dir/subpage.html',
    //   template: '/absolute/path/to/dir/subpage/index.html',
    //   inject: true,
    //   chunks: ['vendor', 'dir/subpage']
    // }
    return config
  })
}

function getPagesConfig () {
  try {
    const htmlFiles = glob.sync(`${urls.pages}/**/index.html`)
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
