const { readFileSync, writeFileSync } = require("fs");
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const htmlFile = readFileSync('./index.html', 'utf-8');

const dom = new JSDOM(htmlFile);

const testcases = dom.window.document.querySelectorAll("a");

const convert = (i) => {
    const digits = 3;
    let number = String(Math.floor(i / 3));
    while (number.length !== digits) number = "0" + number;
    return number;
}

for (let i = 0; i < testcases.length; i++) {
    if (i % 3 === 1) continue;
    const filename = "testcases/test" + convert(i) + (i % 3 === 0 ? '.inp' : '.out');
    // console.log(filename);
    request(testcases[i].href, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            writeFileSync(filename, html);
            // console.log(html);
        }
    });
}

