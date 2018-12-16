const {readdirSync, readFileSync, writeFileSync} = require('fs');
const {join} = require('path');

const templates = readdirSync('./src/templates');
const styles = readdirSync('./src/styles');
const scripts = readdirSync('./src/scripts');

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

templates.forEach((templateName) => {
  const filePath = join('./src/templates', templateName);
  let content = readFileSync(filePath, 'utf-8');

  styles.forEach((styleFile) => {
    const filePath = join('./src/styles', styleFile);
    const styleContent = readFileSync(filePath, 'utf-8');
    content = content.replace('${SITE_STYLE}', minifyStyle(styleContent));
  });

  let scriptContents = [];
  scripts.sort((a, b) => a - b).forEach((scriptFile) => {
    const filePath = join('./src/scripts', scriptFile);
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
