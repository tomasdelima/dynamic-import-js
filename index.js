var fs = require('fs')
var configs = require(`../../.dynamic_import_config.json`)

class DynamicImport {
  constructor (folder) {
    this.folder  = folder
    this.entries = []
    this.folderImports = []
  }

  run () {
    fs.writeFileSync(`${configs.root}/local-modules.js`, this.read())
  }

  isPresent () {
    return this.entries.length + this.folderImports.length > 0
  }

  toString () {
    let comment = `// .${this.folder.replace(configs.root, '')}`
    let entries = this.entries.join("\n")
    let folders = this.folderImports.filter(folderImport => folderImport.isPresent()).join("\n\n")

    if (entries && folders) {
      entries = `${entries}\n`
    }

    return [comment, entries, folders].filter(part => part.length).join("\n")
  }

  addEntry (key, filePath) {
    this.entries.push(`global.${key} = require('.${filePath}').default`)
  }

  read () {
    let folderName = this.folder

    fs.readdirSync(folderName).forEach(file => {
      let key, fileName = `${folderName}/${file}`

      if (configs.exceptions.includes(fileName.replace(`${configs.root}/`, ''))) {
        return
      }

      try {
        let stat = fs.statSync(fileName)

        if (stat.isDirectory()) {
          this.folderImports.push(new DynamicImport(fileName).read())
          return
        }

        if (!/\.jsx?$/.test(file)) {
          return
        }

        if (configs.prefixlessFolders.includes(folderName.replace(`${configs.root}/`, ''))) {
          key = file
        } else {
          key = fileName.replace(`${configs.root}/`, '').replace(/\//g, '')
        }

        this.addEntry(key.replace('.js', ''), fileName.replace(configs.root, ''))
      } catch (err) {
        console.log(err)
      }
    })

    return this
  }
}

new DynamicImport(configs.root).run()