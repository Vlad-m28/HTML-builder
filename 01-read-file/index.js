const fs = require('fs');
const path = require('path'); // Импорты модулей

const filePath = path.join(__dirname, 'text.txt'); // Ссылка на файл
const fileReader = fs.createReadStream(filePath, 'utf-8'); // Открытие файла

fileReader.on('data', (chunk) => console.log(chunk.toString()));
