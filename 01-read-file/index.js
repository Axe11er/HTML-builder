const { createReadStream } = require('fs')
const { join } = require('path')
const { stdout } = require('process')

const read = createReadStream(
  join(__dirname, './text.txt'),
  'utf-8'
)
let data = ''
read.on('data', chunk => {
  data += chunk
})
read.on('end', () => stdout.write(data))
