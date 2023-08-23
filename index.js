const { readFileSync, writeFileSync, rmSync, mkdirSync } = require("fs");
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

rmSync('./testcases', { recursive: true, force: true });
mkdirSync('./testcases');

const htmlFile = readFileSync('./index.html', 'utf-8');

const dom = new JSDOM(htmlFile);

const table = dom.window.document.getElementsByClassName("submission-table")[0];

const testcases = table.querySelectorAll("a");

const convert = (i) => {
    const digits = 3;
    let number = String(Math.floor(i / 2));
    while (number.length !== digits) number = "0" + number;
    return number;
}

const req = [];

for (let i = 0; i < testcases.length; i++) {
    if (!testcases[i].href) continue;
    if (testcases[i].href.includes('temporary')) continue;
    req.push(testcases[i].href);
}

for (let i = 0; i < req.length; i++) {
    request(req[i], function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const filename = "testcases/test" + convert((i)) + ((i) % 2 === 0 ? '.inp' : '.out');
            // console.log(i, req[i], filename);
            writeFileSync(filename, html);
        } else {
            console.log(error);
        }
    });
}

