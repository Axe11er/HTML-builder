const {
  mkdir,
  readdir,
  copyFile,
  rm,
} = require('fs/promises')
const { join } = require('path')

const setPath = path => join(__dirname, path)

const copyDirectory = async (input, output) => {
  await rm(output, { force: true, recursive: true })
  await mkdir(output, { recursive: true })
  const files = await readdir(input, {
    withFileTypes: true,
  })
  for (const file of files) {
    const inputPath = `${input}/${file.name}`
    const outputPath = `${output}/${file.name}`
    file.isDirectory()
      ? await copyDirectory(inputPath, outputPath)
      : await copyFile(inputPath, outputPath)
  }
}

copyDirectory(setPath('./files'), setPath('./files-copy'))
