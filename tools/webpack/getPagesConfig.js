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

function constructEntries (templateFiles) {
  const pagesAttr = []
  templateFiles.map(template => {
    const dir = path.dirname(template)
    // key `dir/subpage1` or `poage1`
    const key = path.dirname(path.relative(urls.pages, template))
    const templateKey = `[template]${encodeURIComponent(key)}` // 让 template 模板可追踪
    const jsPath = path.resolve(dir, 'index.js')
    const page = {
      key,
      templateKey,
      template
    }

    if (fileExist(jsPath)) {
      page.js = jsPath || './' + path.relative(urls.project, jsPath)
    }

    /*
      page {
        key: 'dir/subpage1',
        templateKey: '<template>-dir/subpage1',
        template: '/absolute/path/to/dir/subpage1/index.html',
        js: './src/pages/dir/subpage1/index.js' // optional
      }
    */
    pagesAttr.push(page)
  })

  return pagesAttr
}

function constructEntryObject (pagesAttr) {
  let entry = {}
  pagesAttr.map(page => {
    Object.assign(entry, {
      [page.key]: page.js,
      [page.templateKey]: page.template
    })
    // entry[page.key] = page.js
    // 'dir/subpage1': [ jspath, htmlpath ]
    // 为了让每个页面都跟随源 html 进行热更新，入口要加入源文件路径
    // entry[page.key] = [page.js, page.html]
  })

  return entry
}

function constructHtmlPluginsConfigArray (pagesAttr) {
  return pagesAttr.map(page => {
    let chunks
    let inject
    let config
    if (NODE_ENV !== 'production') {
      inject = 'head' // 注入到头部避免样式震动
      chunks = ['[development]', page.templateKey, 'vendor']
    } else { // 生产环境
      inject = true
      chunks = ['vendor']
    }
    config = {
      _key: page.key,
      _templateKey: page.templateKey,
      filename: `${page.key}.html`,
      template: page.template,
      chunksSortMode: 'dependency', // 防止 [development] 被放到最后
      chunks,
      inject
    }

    if (page.js) {
      config.chunks.push(page.key)
    }
    /*
      config {
        _key: 'dir/page',
        _templateKey: '<template>-dir/page',
        filename: 'dir/page.html',
        template: '/absolute/path/to/dir/page/index.html',
        inject: true,
        chunks: ['vendor', 'dir/page']
      }
    */
    return config
  })
}

function getPagesConfig () {
  try {
    const templateFiles = glob.sync(`${urls.pages}/**/index.+(html|ejs|hbs)`)
    const pagesAttr = constructEntries(templateFiles)
    const entry = constructEntryObject(pagesAttr) // Object
    const htmls = constructHtmlPluginsConfigArray(pagesAttr) // Array

    return { entry, htmls }
  } catch (err) {
    console.log("\007") // Beep
    console.error(err)
  }
}

module.exports = getPagesConfig
