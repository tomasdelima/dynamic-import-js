var fs = require('fs')
var appRoot = '../..'
var { exceptions, root } = require(`${appRoot}/.dynamic_import_config.json`)
var scanRoot = `../../${root}`

exceptions = exceptions.map(file => `${scanRoot}/${file}`)

fs.writeFile(`${scanRoot}/local-modules.js`, '', null, () => {})

var writeImportStatement = (key, fileName) => {
  fs.appendFile(`${scanRoot}/local-modules.js`, `global.${key} = require('.${fileName.replace(scanRoot, '')}').default\n`, null, () => {})
}

var appendNewLine

var readFolder = (folderName) => {
  fs.readdirSync(folderName).map((file) => {
    let fileName = (`${folderName}/${file}`).replace('//', '/')

    if (exceptions.indexOf(fileName) >= 0) {
      return
    }

    fs.stat(fileName, {}, (err, stat) => {
      if (err) {
        console.error(err)
      } else {
        if (stat.isDirectory()) {
          readFolder(fileName)
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
          appendNewLine = true
          writeImportStatement(file.replace('.js', ''), fileName)
        }
      }
    })
  })

  if (appendNewLine) {
    fs.appendFile(`${scanRoot}/local-modules.js`, '\n', null, () => {})
    appendNewLine = false
  }
}

readFolder(scanRoot)
