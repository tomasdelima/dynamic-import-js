var fs = require('fs')
var configs = require(`../../.dynamic_import_config.json`)

class DynamicImport {
  root = configs.root
  exceptions = configs.exceptions.map(file => `${this.root}/${file}`)
  prefixlessFolders = configs.prefixlessFolders.map(file => `${this.root}/${file}`)

  run = () => {
    this.initializeFile()
    this.readFolder(this.root)
  }

  initializeFile = () => {
    fs.writeFile(`${this.root}/local-modules.js`, '', null, () => {})
  }

  appendFile = (string, fileName) => {
    fs.appendFile(`${this.root}/local-modules.js`, string, null, () => {})
  }

  writeImportStatement = (key, fileName) => {
    this.appendFile(`global.${key} = require('.${fileName.replace(this.root, '')}').default\n`)
  }

  readFolder = (folderName) => {
    fs.readdirSync(folderName).map((file) => {
      let fileName = (`${folderName}/${file}`)

      if (this.exceptions.indexOf(fileName) >= 0) {
        return
      }

      fs.stat(fileName, {}, (err, stat) => {
        if (err) {
          console.error(err)
        } else {
          if (stat.isDirectory()) {
            this.readFolder(fileName)
          } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            if (this.lastDirectory != folderName) {
              this.appendFile(`\n// .${folderName.replace(this.root, '')}\n`)
              this.lastDirectory = folderName
            }

            if (this.prefixlessFolders.indexOf(folderName) >= 0) {
              var key = file
            } else {
              var key = fileName.replace(this.root, '').replace(/\//g, '')
            }

            this.writeImportStatement(key.replace('.js', ''), fileName)
          }
        }
      })
    })
  }
}

new DynamicImport().run()
