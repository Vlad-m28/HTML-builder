const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

let filePath = path.join(__dirname, 'text.txt');
let fileWriter = fs.createWriteStream(filePath, 'utf-8');
let rl = readline.createInterface(process.stdin, process.stdout);

process.stdout.write('Привет! Введите что-нибудь...\n');

rl.on('line', (input) => {
  if (input === 'exit') {
    process.stdout.write('Запись успешно завершена:)\n');
    rl.close();
  } else fileWriter.write(input + '\n');
});

rl.on('SIGINT', () => {
  process.stdout.write('Запись успешно завершена:)\n');
  rl.close();
  fileWriter.close();
});
