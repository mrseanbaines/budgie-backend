const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  watch: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
})
