const path = require('path');
const fs = require('fs');
const process = require('process');

const inputFolderPath = path.join(__dirname, '/styles');
const outputFolderPath = path.join(__dirname, 'project-dist/bundle.css');
const fileWriter = fs.createWriteStream(outputFolderPath, 'utf-8');

fs.readdir(inputFolderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    process.stdout.write(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        if (path.extname(file.name) === '.css') {
          const itemPath = path.join(inputFolderPath, file.name);
          const itemReader = fs.createReadStream(itemPath, 'utf-8');
          itemReader.on('data', function (chunk) {
            fileWriter.write(chunk);
          });
        }
      }
    });
  }
});
