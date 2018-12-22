const {readdirSync, readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
const basePath = __dirname;

const tplPath = join(basePath, 'src/templates');
const stylePath = join(basePath, 'src/styles');
const scriptPath = join(basePath, 'src/scripts');

const templateFiles = readdirSync(tplPath);
const styleFiles = readdirSync(join(basePath, 'src/styles'));
const scriptFiles = readdirSync(join(basePath, 'src/scripts'));

function minifyStyle(content) {
  return content.
      replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '').
      replace(/ {2,}/g, ' ').
      replace(/ ([{:}]) /g, '$1').
      replace(/([;,]) /g, '$1').
      replace(/ !/g, '!');
}

function minifyScript(content) {
  return content.replace(/^\s*|[\r|\n]/g, '');
}

templateFiles.forEach((templateName) => {
  const filePath = join(tplPath, templateName);
  let content = readFileSync(filePath, 'utf-8');

  styleFiles.forEach((styleFile) => {
    const filePath = join(stylePath, styleFile);
    const styleContent = readFileSync(filePath, 'utf-8');
    content = content.replace('${SITE_STYLE}', minifyStyle(styleContent));
  });

  let scriptContents = [];
  scriptFiles.sort((a, b) => a - b).forEach((scriptFile) => {
    const filePath = join(scriptPath, scriptFile);
    const scriptContent = readFileSync(filePath, 'utf-8');
    const id = Number(scriptFile.match(/^\d+/)[0]);
    switch (id) {
      case 1:
        return scriptContents.push(scriptContent);
      default:
        return scriptContents.push(minifyScript(scriptContent));
    }
  });
  content = content.replace('${SITE_SCRIPT}', scriptContents.join('\n'));
  writeFileSync(filePath.replace('src/templates', 'autoindex'), content);
});

console.log('Building AutoIndex Template Completed.');
