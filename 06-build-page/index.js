const {
  mkdir,
  readdir,
  copyFile,
  appendFile,
  rm,
} = require('fs/promises')
const { join, parse } = require('path')
const {
  createReadStream,
  createWriteStream,
} = require('fs')

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

const copyDirectory = async (input, output) => {
  try {
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
  } catch (error) {
    console.log(error)
  }
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
  files.reverse()
  for (const file of files) {
    const cssData = await readStream(
      createReadStream(`${entry}/${file.name}`)
    )
    appendFile(output, cssData, 'utf-8')
  }
}

const replaceTags = async () => {
  let template = await readStream(
    createReadStream(setPath('./template.html'))
  )
  const files = await filterFiles(
    setPath('./components'),
    '.html'
  )
  for (const file of files) {
    const filePath = `./components/${file.name}`
    const tag = `{{${parse(setPath(filePath)).name}}}`
    const component = await readStream(
      createReadStream(setPath(filePath))
    )
    template = template.replace(tag, component)
  }
  return template
}

const createIndexHTML = async getTemplate => {
  const template = await getTemplate()
  const writeStream = createWriteStream(
    setPath('./project-dist/index.html')
  )
  writeStream.write(template)
}

const build = async () => {
  await copyDirectory(
    setPath('./assets'),
    setPath('./project-dist/assets')
  )
  await mergeFiles(
    setPath('./styles'),
    setPath('./project-dist/style.css'),
    filterFiles(setPath('./styles'), '.css')
  )
  await createIndexHTML(replaceTags)
}

build()
