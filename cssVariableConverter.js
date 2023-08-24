const fs = require('fs');
const path = require('path');

const variables = {
    "--color-white": "#ffffff",
    "--color-ghost-white": "#f8faff",
    "--color-anti-flash-white": "#f2f2f2",
    // ... (other color mappings)
    "--color-blue": "#0000ee"
};

fs.readFile("styles.css", "utf-8", (err, cssContent) => {
    if (err) {
        console.error("Ошибка при чтении файла styles.css:", err);
        return;
    }

    for (const variable in variables) {
        if (variables.hasOwnProperty(variable)) {
            const value = variables[variable];
            const variableRegex = new RegExp(`var\\(${escapeRegExp(variable)}\\)`, "g");
            cssContent = cssContent.replace(variableRegex, value);
        }
    }

    fs.writeFile("output.css", cssContent, "utf-8", (err) => {
        if (err) {
            console.error("Ошибка при записи файла output.css:", err);
            return;
        }
        console.log("Преобразование выполнено успешно.");
    });
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
