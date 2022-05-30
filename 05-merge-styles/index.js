const { readdir, appendFile, rm } = require('fs/promises')
const { join, parse } = require('path')
const { createReadStream } = require('fs')

const setPath = path => join(__dirname, path)

const readStream = (stream, encoding = 'utf8') => {
  stream.setEncoding(encoding)
  return new Promise((resolve, reject) => {
    let data = ''
    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(data))
    stream.on('error', error => reject(error))
  })
}

const filterFiles = async (path, ext) => {
  const files = await readdir(path, {
    withFileTypes: true,
  })
  return files.filter(
    file =>
      file.isFile() &&
      parse(`${path}/${file.name}`).ext === ext
  )
}
const mergeFiles = async (entry, output, getFiles) => {
  await rm(output, {
    force: true,
  })
  const files = await getFiles
  for (const file of files) {
    const data = await readStream(
      createReadStream(`${entry}/${file.name}`)
    )
    appendFile(output, data, 'utf-8')
  }
}

const mergeCss = async (entry, output) => {
  await mergeFiles(
    entry,
    output,
    filterFiles(entry, '.css')
  )
}

mergeCss(
  setPath('./styles'),
  setPath('./project-dist/bundle.css')
)
