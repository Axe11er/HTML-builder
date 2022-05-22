const { createReadStream } = require('fs')
const { join } = require('path')
const { stdout } = require('process')

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

const readFile = async () => {
  const data = await readStream(
    createReadStream(setPath('text.txt'))
  )
  stdout.write(data)
}

readFile()
