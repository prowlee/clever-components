'use strict';

const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const bundleAnalyzerPluginConfig = {
  analyzerMode: 'static',
  generateStatsFile: true,
  openAnalyzer: false,
  reportFilename: path.join(__dirname, '.webpack-stats', 'webpack-bundle-stats.html'),
  statsFilename: path.join(__dirname, '.webpack-stats', 'webpack-bundle-stats.json'),
};

module.exports = {
  entry: {
    // 'lit-element': 'lit-element',
    // 'lit-html': 'lit-html',
    'atoms/cc-button': './components/atoms/cc-button.js',
    'atoms/cc-input-text': './components/atoms/cc-input-text.js',
    'env-var/env-var-create': './components/env-var/env-var-create.js',
    'env-var/env-var-editor-expert': './components/env-var/env-var-editor-expert.js',
    'env-var/env-var-editor-simple': './components/env-var/env-var-editor-simple.js',
    'env-var/env-var-form': './components/env-var/env-var-form.js',
    'env-var/env-var-input': './components/env-var/env-var-input.js',
  },
  output: {
    filename: '[name].js',
    // chunkFilename: '[name].[chunkhash].js',
    // chunkFilename: '[name].js',
    // filename: 'clever-components.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  // devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(bundleAnalyzerPluginConfig),
  ],
  optimization: {
    // minimize: false,
    // runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      name (module, chunks, cacheGroupKey) {

        if (module.userRequest.includes('/node_modules/')) {
          let foo = module.userRequest.replace(/^.*\/node_modules\/([^\/]+).*$/, 'vendors/$1');
          return foo;
        }

        let bar = module.userRequest.replace(/^.*\/components\/(.+)\.js$/, '$1');
        if (!bar.startsWith('/')) {
          console.log(bar);
          return bar;
        }

        // generate a chunk name...
        console.log({ cacheGroupKey });
        return cacheGroupKey;
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'template-html-minifier',
                {
                  modules: {
                    'lit-html': ['html'],
                    'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                  },
                  htmlMinifier: {
                    collapseWhitespace: true,
                    removeComments: true,
                    caseSensitive: true,
                    minifyCSS: { 'level': 2 },
                  },
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
};
