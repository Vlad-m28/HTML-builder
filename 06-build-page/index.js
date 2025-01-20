const path = require('path');
const fs = require('fs');
const process = require('process');

//1.Creates a folder named project-dist

const projectDistPath = path.join(__dirname, '/project-dist');

function createFolder(folder) {
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) {
      process.stdout.write(err);
    } else process.stdout.write(`${folder} создана!\n`);
  });
}

//2.Replaces template tags in the template.html file with filenames from the components folder

const templatePath = path.join(__dirname, 'template.html');
const templateDistPath = path.join(projectDistPath, '/index.html');
const componentsPath = path.join(__dirname, '/components');

function replaceTags(readerPath, writerPath, paths) {
  let templateReader = fs.createReadStream(readerPath, 'utf-8');
  let templateWriter = fs.createWriteStream(writerPath, 'utf-8');

  templateReader.on('data', function (chunk) {
    let html = chunk;
    fs.readdir(paths, { withFileTypes: true }, (error, files) => {
      if (error) {
        process.stdout.write(error);
      } else {
        files.forEach((file, index, arr) => {
          if (file.isFile()) {
            if (path.extname(file.name) === '.html') {
              const readerHtml = fs.createReadStream(
                path.join(paths, file.name),
                'utf-8',
              );
              readerHtml.on('data', function (chunk) {
                const extansion = path.extname(file.name);
                const base = path.basename(file.name, extansion);
                const tag = `{{${base}}}`;
                html = html.replace(tag, chunk);
                if (index === arr.length - 1) {
                  templateWriter.write(html);
                }
              });
            }
          }
        });
      }
    });
  });
}

//3.Compiles styles from the styles folder into a single file and places it in project-dist/style.css

const stylePath = path.join(__dirname, '/styles');
const styleDistPath = path.join(projectDistPath, '/style.css');

function compileStyles(bundlePath) {
  const fileWriter = fs.createWriteStream(bundlePath, 'utf-8');
  fs.readdir(stylePath, { withFileTypes: true }, (err, files) => {
    if (err) {
      process.stdout.write(err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          if (path.extname(file.name) === '.css') {
            const itemPath = path.join(stylePath, file.name);
            const itemReader = fs.createReadStream(itemPath, 'utf-8');
            itemReader.on('data', function (chunk) {
              fileWriter.write(chunk);
            });
          }
        }
      });
    }
  });
}

//4. Copies the assets folder into project-dist/assets

const assetsPath = path.join(__dirname, '/assets');
const assetsDistPath = path.join(projectDistPath, '/assets');

function copyDir(originalLink, copyLink) {
  fs.mkdir(copyLink, (err) => {
    if (err) {
      process.stdout.write(err);
    } else {
      fs.readdir(originalLink, { withFileTypes: true }, (err, files) => {
        if (err) {
          process.stdout.write(err);
        } else {
          files.forEach((file) => {
            const originalItem = path.join(originalLink, file.name);
            const copyItem = path.join(copyLink, file.name);
            if (file.isFile()) {
              fs.copyFile(originalItem, copyItem, (err) => {
                if (err) {
                  process.stdout.write('Произошла ошибка:', err);
                } else {
                  process.stdout.write('Копирование файла выполнено успешно\n');
                }
              });
            } else {
              copyDir(originalItem, copyItem);
            }
          });
        }
      });
    }
  });
}

fs.rm(projectDistPath, { recursive: true }, () => {
  createFolder(projectDistPath);
  replaceTags(templatePath, templateDistPath, componentsPath);
  compileStyles(styleDistPath);
  copyDir(assetsPath, assetsDistPath);
});
