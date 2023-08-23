const fs = require('fs');
const ColorDiff = require('color-diff');
const colorAtlas = require('color-name-list');

// Создаем палитру из атласа цветов
const palette = colorAtlas.map(entry => entry.hex);

// Преобразуем HEX цвет в RGB компоненты
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { R: r, G: g, B: b };
}

// Преобразуем RGB компоненты в HEX
function rgbToHex(rgb) {
    return `#${rgb.R.toString(16).padStart(2, '0')}${rgb.G.toString(16).padStart(2, '0')}${rgb.B.toString(16).padStart(2, '0')}`;
}

// Преобразуем строку в верблюжий стиль
function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

// Функция для поиска ближайшего цвета
function findNearestColor(color) {
    const rgbColor = hexToRgb(color);
    const nearestColor = ColorDiff.closest(rgbColor, palette.map(hexToRgb));
    const nearestHexColor = rgbToHex(nearestColor);

    const foundColor = colorAtlas.find(entry => entry.hex.toUpperCase() === nearestHexColor.toUpperCase());

    if (foundColor) {
        return `val ${toCamelCase(foundColor.name)} = "${foundColor.hex}"`;
    } else {
        return "// Цвет не найден в атласе.";
    }
}

// Чтение цветов из файла
fs.readFile('color.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    const inputColors = data
        .split(',')
        .map(color => color.trim().replace(/^#/, '').toUpperCase());

    const results = inputColors.map(color => findNearestColor(`#${color}`));

    // Запись результатов в файл
    const output = results.join('\n');
    fs.writeFile('colorDoneVar.txt', output, 'utf8', err => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Результаты записаны в файл colorDoneVar.txt');
    });
});