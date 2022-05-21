const readline = require('readline')
const {
  stdin: input,
  stdout: output,
  exit,
} = require('process')
const { createWriteStream } = require('fs')
const { join } = require('path')

const rl = readline.createInterface({ input, output })
const writeStream = createWriteStream(
  join(__dirname, 'text.txt'),
  'utf-8'
)

rl.question('Введите текст\n', answer => {
  if (answer === 'exit') {
    exit()
  }
  writeStream.write(`${answer}\n`)
})
rl.on('line', input => {
  if (input === 'exit') {
    exit()
  }
  writeStream.write(`${input}\n`)
})
process.on('exit', () => output.write('Хорошего дня!'))
