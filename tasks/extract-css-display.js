'use strict';

const fs = require('fs').promises;
const { promisify } = require('util');
const babel = require('@babel/core');
const rawGlob = require('glob');
const postcss = require('postcss');

const glob = promisify(rawGlob);

function isCustomElementDefineCallExpression (node) {
  return node.callee != null
    && node.callee.property != null
    && node.callee.property.name === 'define'
    && node.callee.object.property.name === 'customElements';
}

function extractCustomElementTagName (ast) {

  let tagName;

  babel.traverse(ast, {
    CallExpression: (path) => {
      if (isCustomElementDefineCallExpression(path.node)) {
        tagName = path.node.arguments[0].value;
      }
    },
  });

  return tagName;
}

function extractCss (ast) {

  let cssCode;

  babel.traverse(ast, {
    TaggedTemplateExpression: (path) => {
      if (path.node.tag.name === 'css') {
        cssCode = (path.node.quasi.quasis || []).map((q) => q.value.raw).join('\n');
      }
    },
  });

  return cssCode;
}

async function run () {

  const filenameList = await glob('./src/**/*.js');

  const customElements = [];

  for (const filename of filenameList) {

    const contents = await fs.readFile(filename, 'utf-8');
    const ast = await babel.parseAsync(contents, {
      ast: true,
      plugins: [
        '@babel/plugin-syntax-import-meta',
      ],
    });

    const tagName = extractCustomElementTagName(ast);
    if (tagName != null) {

      const css = extractCss(ast);
      if (css != null) {

        const { root } = await postcss()
          .process(css, { parser: null, from: filename });

        const hostSelectors = [];
        root.walkRules((rule) => {
          const selector = rule.selector.trim();
          if (selector.match(/^:host(\([^)]*\))?$/)) {

            rule.walkDecls('display', (decl) => {
              hostSelectors.push({ selector, display: decl.value });
            });
          }
        });

        let prefix = ' * 🎨 default CSS display: `unknown`';
        if (hostSelectors.length > 0) {
          prefix = ` * 🎨 default CSS display: \`${hostSelectors[0].display}\``;
          hostSelectors.slice(1).forEach(({ selector, display }) => {
            const matcher = selector.replace(/:host\((.*)\)/, '$1');
            prefix += ` - \`${display}\` with \`${matcher}\``;
          });
        }

        const newContents = contents.replace('/**', '/**\n *\n' + prefix);

        await fs.writeFile(filename, newContents);

        customElements.push({ tagName, hostSelectors });
      }
    }
  }

  // console.log(JSON.stringify(customElements, null, '  '));
}

run()
  // .then(console.log)
  .catch(console.error);
