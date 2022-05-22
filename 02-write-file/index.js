const readline = require('readline')
const {
  stdin: input,
  stdout: output,
  exit,
} = require('process')
const { createWriteStream } = require('fs')
const { join } = require('path')

const setPath = path => join(__dirname, path)

const rl = readline.createInterface({
  input,
  output,
})
const writeStream = createWriteStream(
  setPath('text.txt'),
  'utf-8'
)

output.write('Введите текст\n')
rl.on('line', input => {
  if (input === 'exit') exit()
  writeStream.write(`${input}\n`)
})

process.on('exit', () => output.write('Хорошего дня!'))
