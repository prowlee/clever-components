'use strict';

const babel = require('@babel/core');
const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const rawGlob = require('glob');
const util = require('util');

const glob = util.promisify(rawGlob);

const Terser = require('terser');

function minifyHtmlCss (code, sourceFileName) {
  return babel.transformSync(code, {
    sourceMaps: 'inline',
    sourceFileName,
    'plugins': [
      [
        'template-html-minifier',
        {
          'modules': {
            'lit-html': ['html'],
            'lit-element': [
              'html',
              { 'name': 'css', 'encapsulation': 'style' },
            ],
          },
          'htmlMinifier': {
            collapseWhitespace: true,
            removeComments: true,
            caseSensitive: true,
            minifyCSS: { 'level': 2 },
          },
        },
      ],
    ],
  }).code;
}

function minifyJs (code, sourceMapUrl) {
  return Terser.minify(code, {
    module: true,
    toplevel: true,
    mangle: {
      properties: {
        // mangle "private properties/functions" starting with _
        regex: /^_/,
      },
    },
    sourceMap: {
      content: 'inline',
      url: sourceMapUrl,
    },
  });
};

async function run () {

  await del('dist/**/*');

  const sourceFilepaths = await glob('./components/**/*.js');

  const filepaths = sourceFilepaths.map((src) => {
    const sourceMapFilename = src.replace('/components/', '/node_modules/@clever/components/');
    console.log({sourceMapFilename})
    const dst = src.replace('/components/', '/dist/');
    const { base: sourceMapBase } = path.parse(dst);
    const sourceMapUrl = sourceMapBase + '.map';
    return { src, sourceMapFilename, dst, sourceMapUrl };
  });

  for (let { src, sourceMapFilename, dst, sourceMapUrl } of filepaths) {
    console.log(`Minifying ${src} ...`);
    await fs.readFile(src, 'utf8')
      .then((code) => minifyHtmlCss(code, sourceMapFilename))
      .then((code) => minifyJs(code, sourceMapUrl))
      .then(async ({ code, map }) => {
        await fs.outputFile(dst, code);
        await fs.outputFile(dst + '.map', map);
      });
    console.log(`Minifying ${src} DONE ${dst}`);
  }
}

run()
  .then(console.log)
  .catch(console.error);
