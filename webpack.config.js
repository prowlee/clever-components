const path = require('path');

module.exports = {
  entry: './components/test-trad.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  optimization: {
    // minimize: true,
    minimize: false,
  },
  resolve: {
    alias: {
      // '@i18n': path.resolve(__dirname, './components/lib/i18n.js'),
      '@i18n': path.resolve(__dirname, './components/lib/i18n.macro.js'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            'plugins': [
              'macros',
            ],
          },
        },
      },
    ],
  },
};
