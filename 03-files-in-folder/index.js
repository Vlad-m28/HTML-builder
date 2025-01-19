const fs = require('fs');
const path = require('path');
const process = require('process');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    process.stdout.write(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            process.stdout.write(err);
          }
          const fileExtension = path.extname(file.name).slice(1);
          const fileName = path.basename(file.name, `.${fileExtension}`);
          const fileSize = stats.size;
          process.stdout.write(
            `${fileName} - ${fileExtension} - ${fileSize} bytes\n`,
          );
        });
      }
    });
  }
});
