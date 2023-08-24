const fs = require('fs');
const xmlParser = require('xml-parser');

fs.readFile('xmlVar.txt', 'utf-8', (err, xmlData) => {
    if (err) {
        console.error(err);
        return;
    }

    const parsedXml = xmlParser(xmlData);
    const colors = parsedXml.root.children

    const resultObject = {};
    colors.forEach(colorNode => {
        const name = colorNode.attributes.name;
        const hexValue = colorNode.content;
        resultObject[name] = hexValue;
    });

    const jsonResult = JSON.stringify(resultObject, null, 2);

    fs.writeFile('result.json', jsonResult, 'utf-8', err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('JSON data has been written to result.json');
    });
});
