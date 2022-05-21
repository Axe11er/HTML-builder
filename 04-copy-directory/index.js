const { mkdir, readdir, copyFile } = require('fs/promises')
const { join } = require('path')

const copyDirectory = async (input, output) => {
  await mkdir(output, { recursive: true })
  const files = await readdir(input, {
    withFileTypes: true,
  })
  for (let file of files) {
    const inputPath = join(input, file.name)
    const outputPath = join(output, file.name)
    file.isDirectory()
      ? await copyDirectory(inputPath, outputPath)
      : await copyFile(inputPath, outputPath)
  }
}

copyDirectory(
  join(__dirname, './files'),
  join(__dirname, './files-copy')
)
