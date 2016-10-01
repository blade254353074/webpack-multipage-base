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
  const existEntries = []
  htmlFiles.map(url => {
    const dir = path.dirname(url)
    const jsPath = path.resolve(dir, 'index.js')
    if (fileExist(jsPath)) {
      existEntries.push(jsPath)
    }
  })
  return existEntries
}

function constructEntryObject (existEntries) {
  const entry = {}
  existEntries.map(url => {
    const key = path.dirname(path.relative(urls.pages, url))
    // webpack config does not support src/pages/xxx, must add './' front of path
    const value = './' + path.relative(urls.project, url)
    entry[key] = value
  })
  return entry
}

function getPagesEntry () {
  try {
    const htmlFiles = glob.sync(`${urls.pages}/**/index.html`)
    const existEntries = constructEntries(htmlFiles)
    const entry = constructEntryObject(existEntries)

    return entry
  } catch (err) {
    console.log("\007") // Beep
    console.error(err)
  }
}

module.exports = getPagesEntry
