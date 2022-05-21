const { stat } = require('fs/promises')
const { readdir } = require('fs/promises')
const path = require('path')
const { stdout } = require('process')

readdir(path.join(__dirname, 'secret-folder'), {
  withFileTypes: true,
}).then(files => {
  files
    .filter(file => file.isFile())
    .forEach(file => {
      const filePath = path.join(
        __dirname,
        `./secret-folder/${file.name}`
      )
      const parsedFile = path.parse(filePath)
      stat(filePath).then(file => {
        stdout.write(
          `${
            parsedFile.name
          } - ${parsedFile.ext.slice(1)} - ${
            file.size
          }b\n`
        )
      })
    })
})
