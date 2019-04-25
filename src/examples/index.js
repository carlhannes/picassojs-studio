const use = require.context('./', true, /^(?!.*index.js)((.*\.(js\.*))[^.]*$)/i);
const files = use.keys();
const registry = [];

for (let index = 0; index < files.length; index += 1) {
  const fileName = files[index];
  registry.push(use(fileName).default);
}

export default registry;

/* eslint global-require: 0, import/no-dynamic-require: 0 */
// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
  const fs = require('fs');
  const path = require('path');

  require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
    const polyfiles = {};

    function readDirectory(directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.resolve(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
          if (scanSubDirectories) readDirectory(fullPath);

          return;
        }

        if (!regularExpression.test(fullPath)) return;

        polyfiles[fullPath] = true;
      });
    }

    readDirectory(path.resolve(__dirname, base));

    function Module(file) {
      return require(file);
    }

    Module.keys = () => Object.keys(polyfiles);

    return Module;
  };
}
