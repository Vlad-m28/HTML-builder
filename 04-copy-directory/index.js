const path = require('path');
const fs = require('fs');
const process = require('process');

const originalFolderPath = path.join(__dirname, '/files');
const сopyFolderPath = path.join(__dirname, '/files-copy');

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

fs.rm(сopyFolderPath, { recursive: true }, () => {
  copyDir(originalFolderPath, сopyFolderPath);
});
