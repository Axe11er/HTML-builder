const { stat } = require('fs/promises')
const { readdir } = require('fs/promises')
const { join, parse } = require('path')
const { stdout } = require('process')

const setPath = path => join(__dirname, path)

readdir(setPath('secret-folder'), {
  withFileTypes: true,
}).then(files => {
  files
    .filter(file => file.isFile())
    .forEach(file => {
      const filePath = setPath(
        `./secret-folder/${file.name}`
      )
      const parsedFile = parse(filePath)
      stat(filePath).then(file => {
        stdout.write(
          `${parsedFile.name} - ${parsedFile.ext.slice(
            1
          )} - ${file.size}b\n`
        )
      })
    })
})
