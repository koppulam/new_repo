const recursive = require('recursive-readdir');
const nodePath = require('path');
const fs = require('fs');

const dirName = 'index.scss';
const allScssFiles = [];
const allJsxFiles = [];
let dir = '';
// let response = {
//     present: false,
//     path: '',
//     name: dirName
// };

/**
 * @description Does a recursive traverse over folders
 * @param {*} path Initial Path
 * @returns {void}
 */
function doRecurse(path) {
    recursive(path, (err, files) => {
        files.forEach(file => {
            dir = nodePath.dirname(file);
            if (allScssFiles.indexOf(dir) === -1 && file.indexOf('scss') !== -1) {
                allScssFiles.push(nodePath.normalize(file));
            }
            if (allJsxFiles.indexOf(dir) === -1 && file.indexOf('jsx') !== -1) {
                allJsxFiles.push(`./${nodePath.normalize(file)}`);
            }
        });

        // removing fe-components folder from stack
        allScssFiles.forEach(dirr => {
            console.log(`@ import '${dirr}';`);
        });
        // console.log(allJsxFiles);
        allJsxFiles.forEach(jsxfile => {
            fs.readFile(jsxfile, 'utf8', (errs, data) => {
                if (errs) {
                    return console.log(errs);
                }
                const result = data.replace('import \'./index.scss\';', '');

                console.log(jsxfile);

                fs.writeFile(jsxfile, result, 'utf8', (errss) => {
                    console.log(errss);
                    // if (errss) return console.log(errss);
                });
            });
        });
    });
}

doRecurse('./src/react-app/');
