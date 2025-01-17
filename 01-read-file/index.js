const fs = require('fs');
const path = require('path'); // Импорты модулей

const textPath = path.join(__dirname, 'text.txt'); // Ссылка на файл
const textReader = fs.createReadStream(textPath, 'utf-8'); // Открытие файла

textReader.on('data', (chunk) => console.log(chunk.toString()));