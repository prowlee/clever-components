import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import { babelPlugin, importMetaUrlAssetsPlugin, terserPlugin } from './rollup-common.js';

const OUTPUT_DIR = `cdn/bundle-min-js-html-css-svg`;

export default {
  input: 'src/index.js',
  output: {
    dir: OUTPUT_DIR,
    sourcemap: true,
  },
  treeshake: false,
  plugins: [
    clear({
      targets: [OUTPUT_DIR],
    }),
    importMetaUrlAssetsPlugin,
    json(),
    terserPlugin,
    babelPlugin,
    // teaches Rollup how to find external modules (bare imports)
    resolve(),
    // convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs(),
  ],
};
