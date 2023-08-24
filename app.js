const fs = require('fs');
const ColorDiff = require('color-diff');
const colorAtlas = require('color-name-list');

// Создаем массив палитры цветов из атласа
const palette = colorAtlas.map(entry => entry.hex);

// Преобразуем HEX-цвет в объект RGB компонент
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { R: r, G: g, B: b };
}

// Преобразуем объект RGB компонент в HEX-цвет
function rgbToHex(rgb) {
    const componentToHex = c => c.toString(16).padStart(2, '0');
    return `#${componentToHex(rgb.R)}${componentToHex(rgb.G)}${componentToHex(rgb.B)}`;
}

// Преобразуем строку в стиль верблюжьей нотации
function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    ).replace(/\s+/g, '');
}

// Находим ближайший цвет из палитры
function findNearestColor(color) {
    const rgbColor = hexToRgb(color);
    const nearestColor = ColorDiff.closest(rgbColor, palette.map(hexToRgb));
    const nearestHexColor = rgbToHex(nearestColor);
    const foundColor = colorAtlas.find(entry => entry.hex.toUpperCase() === nearestHexColor.toUpperCase());

    return foundColor ? `<color name="${toCamelCase(foundColor.name)}">${foundColor.hex}</color>` : "";
}

// Читаем цвета из файла
fs.readFile('color.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    // Разбиваем строку на массив цветов и преобразуем в верхний регистр
    const inputColors = data.split(',').map(color => color.trim().replace(/^#/, '').toUpperCase());

    // Находим ближайший цвет для каждого входного цвета и добавляем в указанный формат
    const results = inputColors.map(color => findNearestColor(`#${color}`)).filter(Boolean); // Фильтруем пустые результаты
    const output = results.join('\n');

    // Записываем результаты в файл вывода
    fs.writeFile('colorDoneVar.txt', output, 'utf8', err => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Результаты записаны в файл colorDoneVar.txt');
    });
});
