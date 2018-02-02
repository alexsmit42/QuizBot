let fs = require('fs');
let path = require('path');
let yaml = require('js-yaml');

let localeDir = './locale/';

fs.readdirSync(localeDir).forEach(file => {
    if (path.extname(file) === '.yaml') {
        module.exports[path.basename(file, path.extname(file))] = yaml.safeLoad(fs.readFileSync(localeDir + file).toString());
    }
});