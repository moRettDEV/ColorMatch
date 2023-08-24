const fs = require('fs');

// Чтение файла result.json
fs.readFile('result.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        let convertedData = '';

        // Преобразование значений и формирование строки
        for (const key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                const colorValue = jsonData[key];
                convertedData += `--${key}: ${colorValue};\n`;
            }
        }

        // Запись строки в файл convertedResult.txt
        fs.writeFileSync('convertedResult.txt', convertedData);
        console.log('Преобразование выполнено успешно.');
    } catch (error) {
        console.error('Ошибка при обработке данных:', error);
    }
});
