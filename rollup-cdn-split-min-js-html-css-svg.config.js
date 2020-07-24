import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import { babelPlugin, importMetaUrlAssetsPlugin, inputs, terserPlugin } from './rollup-common.js';

const SOURCE_DIR = 'src';
const OUTPUT_DIR = `cdn/split-min-js-html-css-svg`;

export default {
  input: inputs(SOURCE_DIR, (file) => {
    const { name } = path.parse(file);
    return [name, file];
  }),
  output: {
    dir: OUTPUT_DIR,
    sourcemap: true,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
  },
  preserveModules: true,
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
