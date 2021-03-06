const fs = require('fs')
const path = require('path')
const glob = require('glob')
const promisify = require('bluebird').promisify
const globAsync = promisify(glob)

const repoRoot = 'https://github.com/raineorshine/solidity-by-example/blob/master/'
const readmeTemplateFile = 'README-template.md'
const readmeFile = 'README.md'
const readmePlaceholder = '<%=links%>'

function renderPaths(relativePaths) {
  return relativePaths.map(relativePath => {
    const filename = path.basename(relativePath)
    const url = repoRoot + relativePath
    return `- [${filename}](${url})`
  }).join('\n')
}

function renderReadme(content) {
  const readmeTemplate = fs.readFileSync(readmeTemplateFile, 'utf-8')
  return readmeTemplate.replace(readmePlaceholder, content)
}

globAsync('examples/*/*.sol')
  .then(renderPaths)
  .then(renderReadme)
  .then(fileContent => fs.writeFileSync(readmeFile, fileContent))

