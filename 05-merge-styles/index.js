const { createReadStream } = require('fs')
const {
  readdir,
  appendFile,
  rm,
} = require('fs/promises')
const { join, parse } = require('path')

const setPath = path => join(__dirname, path)
const filterCss = async () => {
  const files = await readdir(
    setPath('./styles'),
    {
      withFileTypes: true,
    }
  )
  return files.filter(
    file =>
      file.isFile() &&
      parse(setPath(`./styles/${file.name}`))
        .ext === '.css'
  )
}
const mergeCss = async getStyles => {
  await rm(setPath('./project-dist/bundle.css'), {
    force: true,
  })
  const files = await getStyles
  for (const file of files) {
    const read = createReadStream(
      setPath(`./styles/${file.name}`)
    )
    let cssData = ''
    read.on('data', chunk => {
      cssData += chunk
    })
    read.on('end', () => {
      appendFile(
        setPath('./project-dist/bundle.css'),
        cssData,
        'utf-8'
      )
    })
  }
}

mergeCss(filterCss())
